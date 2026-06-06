import Skill from '../models/Skill.js';
import { createOwnedResourceHandlers } from '../utils/ownership.js';

const handlers = createOwnedResourceHandlers({
  Model: Skill,
  name: 'Skill',
  sort: { category: 1, order: 1 },
  writableFields: ['category', 'name', 'logo', 'proficiency', 'order'],
});

export const getAllSkills = handlers.getAll;
export const addSkill = handlers.add;
export const updateSkill = handlers.update;
export const deleteSkill = handlers.remove;
