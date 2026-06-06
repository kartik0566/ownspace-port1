import Education from '../models/Education.js';

export const getAllEducation = async (req, res) => {
  try {
    const educations = await Education.find({
      userId: req.user.userId,
    }).sort({ order: 1 });

    res.json(educations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addEducation = async (req, res) => {
  try {
    const education = new Education({
      ...req.body,
      userId: req.user.userId,
    });

    await education.save();

    res.status(201).json(education);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!education) {
      return res.status(404).json({
        message: 'Education not found',
      });
    }

    res.json(education);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!education) {
      return res.status(404).json({
        message: 'Education not found',
      });
    }

    res.json({
      message: 'Education deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};