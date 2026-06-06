import Education from '../models/Education.js';
import { createOwnedResourceHandlers } from '../utils/ownership.js';

const handlers = createOwnedResourceHandlers({
  Model: Education,
  name: 'Education',
  sort: { order: 1 },
  writableFields: [
    'institution',
    'degree',
    'field',
    'duration',
    'description',
    'logo',
    'gpa',
    'order',
  ],
});

export const getAllEducation = handlers.getAll;
export const addEducation = handlers.add;
export const updateEducation = handlers.update;
export const deleteEducation = handlers.remove;
