import Experience from '../models/Experience.js';

export const getAllExperience = async (req, res) => {
  try {
    const experiences = await Experience.find({
      userId: req.user.userId,
    }).sort({ order: 1 });

    res.json(experiences);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addExperience = async (req, res) => {
  try {
    const experience = new Experience({
      ...req.body,
      userId: req.user.userId,
    });

    await experience.save();

    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!experience) {
      return res.status(404).json({
        message: 'Experience not found',
      });
    }

    res.json(experience);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!experience) {
      return res.status(404).json({
        message: 'Experience not found',
      });
    }

    res.json({
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};