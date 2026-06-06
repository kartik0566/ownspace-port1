import About from '../models/About.js';
import { pick, readScope } from '../utils/ownership.js';

const writableFields = [
  'name',
  'title',
  'bio',
  'email',
  'phone',
  'location',
  'profileImage',
  'socialLinks',
];

const fallbackAbout = (user) => ({
  name: user.name || user.username,
  title: '',
  bio: '',
  email: user.email,
  phone: '',
  location: '',
  profileImage: '',
  socialLinks: {},
});

export const getAbout = async (req, res) => {
  try {
    const scope = await readScope(req, res);
    if (!scope) return;

    const about = await About.findOne(scope.filter);
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const payload = pick(req.body, writableFields);
    let about = await About.findOne({ userId: req.user.id });

    if (!about) {
      about = new About({
        ...fallbackAbout({
          name: req.user.username,
          username: req.user.username,
          email: req.user.email,
        }),
        ...payload,
        userId: req.user.id,
      });
    } else {
      Object.assign(about, payload);
    }

    await about.save();
    res.json(about);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
