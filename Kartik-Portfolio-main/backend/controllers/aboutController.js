import About from '../models/About.js';

export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne({
      userId: req.user.userId,
    });

    if (!about) {
      return res.status(404).json({
        message: 'About section not found',
      });
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne({
      userId: req.user.userId,
    });

    if (!about) {
      about = new About({
        ...req.body,
        userId: req.user.userId,
      });
    } else {
      Object.assign(about, req.body);
    }

    await about.save();

    res.json(about);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};