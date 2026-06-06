import About from '../models/About.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Education from '../models/Education.js';
import Experience from '../models/Experience.js';
import { publicUser, readScope } from '../utils/ownership.js';

export const getPortfolio = async (req, res) => {
  try {
    const scope = await readScope(req, res);
    if (!scope) return;

    const filter = scope.filter;
    const [about, projects, skills, education, experience] =
      await Promise.all([
        About.findOne(filter),
        Project.find(filter).sort({ order: 1 }),
        Skill.find(filter).sort({ category: 1, order: 1 }),
        Education.find(filter).sort({ order: 1 }),
        Experience.find(filter).sort({ order: 1 }),
      ]);

    res.json({
      user: publicUser(scope.user),
      about,
      projects,
      skills,
      education,
      experience,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
