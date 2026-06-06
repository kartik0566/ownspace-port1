import Experience from '../models/Experience.js';
import {
  createOwnedResourceHandlers,
  parseList,
} from '../utils/ownership.js';

const handlers = createOwnedResourceHandlers({
  Model: Experience,
  name: 'Experience',
  sort: { order: 1 },
  writableFields: [
    'company',
    'position',
    'duration',
    'description',
    'logo',
    'technologies',
    'order',
  ],
  transformPayload: (payload) => {
    const nextPayload = { ...payload };

    if (payload.technologies !== undefined) {
      nextPayload.technologies = parseList(payload.technologies);
    }

    return nextPayload;
  },
});

export const getAllExperience = handlers.getAll;
export const addExperience = handlers.add;
export const updateExperience = handlers.update;
export const deleteExperience = handlers.remove;
