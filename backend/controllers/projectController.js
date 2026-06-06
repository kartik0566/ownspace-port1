import Project from '../models/Project.js';
import {
  createOwnedResourceHandlers,
  parseList,
} from '../utils/ownership.js';

const handlers = createOwnedResourceHandlers({
  Model: Project,
  name: 'Project',
  sort: { order: 1 },
  writableFields: [
    'title',
    'description',
    'image',
    'technologies',
    'links',
    'featured',
    'order',
  ],
  transformPayload: (payload) => {
    const nextPayload = { ...payload };

    if (payload.technologies !== undefined) {
      nextPayload.technologies = parseList(payload.technologies);
    }

    if (payload.links !== undefined) {
      nextPayload.links = {
        github: payload.links.github || '',
        live: payload.links.live || '',
        npm: payload.links.npm || '',
      };
    }

    return nextPayload;
  },
});

export const getAllProjects = handlers.getAll;
export const addProject = handlers.add;
export const updateProject = handlers.update;
export const deleteProject = handlers.remove;
