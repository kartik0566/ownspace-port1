import Project from '../models/Project.js';

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      userId: req.user.userId,
    }).sort({ order: 1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      userId: req.user.userId,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    res.json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};