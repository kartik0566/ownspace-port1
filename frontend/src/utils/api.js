import {
  getStaticPortfolio,
  staticPortfolioUsername,
} from '../data/staticPortfolio';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:5000/api');

export const isStaticPortfolioMode = () =>
  import.meta.env.VITE_STATIC_PORTFOLIO === 'true' || !API_BASE_URL;

const getPublicPortfolio = (username = staticPortfolioUsername) => {
  const portfolio = getStaticPortfolio(username || staticPortfolioUsername);

  if (!portfolio) {
    throw new Error('No public portfolio exists for this username.');
  }

  return portfolio;
};

const publicRequest = (staticSelector, apiRequest) => {
  if (isStaticPortfolioMode()) {
    try {
      return Promise.resolve(staticSelector());
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return apiRequest();
};

const withUsername = (endpoint, username) => {
  if (!username) return endpoint;

  const separator = endpoint.includes('?') ? '&' : '?';
  return `${endpoint}${separator}username=${encodeURIComponent(username)}`;
};

export const apiCall = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error('Backend API is not configured for this deployment.');
  }

  const token = localStorage.getItem('token');
  const { username, ...fetchOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${withUsername(endpoint, username)}`,
    {
      ...fetchOptions,
      headers,
    }
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || `API Error: ${response.status}`);
  }

  return payload;
};

export const skillsAPI = {
  getAll: (username) =>
    publicRequest(
      () => getPublicPortfolio(username).skills,
      () => apiCall('/skills', { username })
    ),
  add: (data) =>
    apiCall('/skills', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    apiCall(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/skills/${id}`, { method: 'DELETE' }),
};

export const experienceAPI = {
  getAll: (username) =>
    publicRequest(
      () => getPublicPortfolio(username).experience,
      () => apiCall('/experience', { username })
    ),
  add: (data) =>
    apiCall('/experience', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    apiCall(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/experience/${id}`, { method: 'DELETE' }),
};

export const educationAPI = {
  getAll: (username) =>
    publicRequest(
      () => getPublicPortfolio(username).education,
      () => apiCall('/education', { username })
    ),
  add: (data) =>
    apiCall('/education', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    apiCall(`/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/education/${id}`, { method: 'DELETE' }),
};

export const projectsAPI = {
  getAll: (username) =>
    publicRequest(
      () => getPublicPortfolio(username).projects,
      () => apiCall('/projects', { username })
    ),
  add: (data) =>
    apiCall('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    apiCall(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/projects/${id}`, { method: 'DELETE' }),
};

export const aboutAPI = {
  get: (username) =>
    publicRequest(
      () => getPublicPortfolio(username).about,
      () => apiCall('/about', { username })
    ),
  update: (data) =>
    apiCall('/about', { method: 'PUT', body: JSON.stringify(data) }),
};

export const contactAPI = {
  submit: (data, username) => {
    if (isStaticPortfolioMode()) {
      const { about } = getPublicPortfolio(username);

      if (!about.email) {
        throw new Error('Contact email is not configured.');
      }

      const subject = encodeURIComponent(
        `Portfolio message from ${data.name || 'Visitor'}`
      );
      const body = encodeURIComponent(
        `${data.message || ''}\n\nFrom: ${data.name || ''} <${data.email || ''}>`
      );

      window.location.href = `mailto:${about.email}?subject=${subject}&body=${body}`;
      return Promise.resolve({ mailTo: true });
    }

    return apiCall('/contact', {
      method: 'POST',
      username,
      body: JSON.stringify(data),
    });
  },
  getAll: () => apiCall('/contact'),
  update: (id, data) =>
    apiCall(`/contact/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/contact/${id}`, { method: 'DELETE' }),
};

export const portfolioAPI = {
  get: (username) =>
    publicRequest(
      () => getPublicPortfolio(username),
      () => apiCall(`/portfolio/${username}`)
    ),
};

export const authAPI = {
  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (data) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  me: () => apiCall('/auth/me'),
};
