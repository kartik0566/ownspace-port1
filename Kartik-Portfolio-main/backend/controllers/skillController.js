import Skill from '../models/Skill.js';

export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      userId: req.user.userId,
    }).sort({ category: 1, order: 1 });

    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addSkill = async (req, res) => {
  try {
    const skill = new Skill({
      ...req.body,
      userId: req.user.userId,
    });

    await skill.save();

    res.status(201).json(skill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found',
      });
    }

    res.json(skill);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!skill) {
      return res.status(404).json({
        message: 'Skill not found',
      });
    }

    res.json({
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
