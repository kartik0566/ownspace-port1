import User from '../models/User.js';

export const jwtSecret = () =>
  process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

export const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  name: user.name,
  email: user.email,
});

export const pick = (source, allowedFields) =>
  allowedFields.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(source, field)) {
      payload[field] = source[field];
    }
    return payload;
  }, {});

export const parseList = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const usernameFromRequest = (req) =>
  req.params.username || req.query.username || process.env.DEFAULT_USERNAME;

export const findReadUser = async (req) => {
  const requestedUsername = usernameFromRequest(req);

  if (requestedUsername) {
    return User.findOne({ username: requestedUsername.toLowerCase() });
  }

  if (req.user?.id) {
    return User.findById(req.user.id);
  }

  return null;
};

export const readScope = async (req, res) => {
  const user = await findReadUser(req);

  if (!user) {
    res.status(404).json({ message: 'Portfolio user not found' });
    return null;
  }

  return {
    user,
    filter: { userId: user._id },
  };
};

export const ownerFilter = (req) => ({
  _id: req.params.id,
  userId: req.user.id,
});

export const createOwnedResourceHandlers = ({
  Model,
  name,
  sort,
  writableFields,
  transformPayload = (payload) => payload,
}) => {
  const getAll = async (req, res) => {
    try {
      const scope = await readScope(req, res);
      if (!scope) return;

      const items = await Model.find(scope.filter).sort(sort);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const add = async (req, res) => {
    try {
      const payload = transformPayload(pick(req.body, writableFields));
      const item = new Model({ ...payload, userId: req.user.id });
      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const update = async (req, res) => {
    try {
      const payload = transformPayload(pick(req.body, writableFields));
      const item = await Model.findOneAndUpdate(ownerFilter(req), payload, {
        new: true,
        runValidators: true,
      });

      if (!item) {
        return res.status(404).json({ message: `${name} not found` });
      }

      res.json(item);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const remove = async (req, res) => {
    try {
      const item = await Model.findOneAndDelete(ownerFilter(req));

      if (!item) {
        return res.status(404).json({ message: `${name} not found` });
      }

      res.json({ message: `${name} deleted successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  return { getAll, add, update, remove };
};
