import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { FiCheck, FiCopy, FiDownload, FiExternalLink } from 'react-icons/fi';
import {
  aboutAPI,
  contactAPI,
  educationAPI,
  experienceAPI,
  projectsAPI,
  skillsAPI,
} from '../utils/api';
import { useAuth } from '../utils/hooks';
import bgImage from '../assets/cosmic-purple-planet.jpg';

const fieldTypes = {
  text: 'text',
  email: 'email',
  number: 'number',
  textarea: 'textarea',
  select: 'select',
  tags: 'tags',
  checkbox: 'checkbox',
};

const resourceConfigs = {
  about: {
    label: 'About',
    single: true,
    api: aboutAPI,
    fields: [
      { name: 'name', label: 'Name', required: true },
      { name: 'title', label: 'Title', required: true },
      { name: 'bio', label: 'Bio', type: fieldTypes.textarea, required: true },
      { name: 'email', label: 'Email', type: fieldTypes.email, required: true },
      { name: 'phone', label: 'Phone' },
      { name: 'location', label: 'Location' },
      { name: 'profileImage', label: 'Profile Image URL' },
      { name: 'socialLinks.github', label: 'GitHub URL' },
      { name: 'socialLinks.linkedin', label: 'LinkedIn URL' },
      { name: 'socialLinks.twitter', label: 'Twitter URL' },
      { name: 'socialLinks.instagram', label: 'Instagram URL' },
    ],
  },
  skills: {
    label: 'Skills',
    api: skillsAPI,
    titleField: 'name',
    fields: [
      {
        name: 'category',
        label: 'Category',
        type: fieldTypes.select,
        options: ['Frontend', 'Backend', 'Languages', 'Tools'],
        required: true,
      },
      { name: 'name', label: 'Name', required: true },
      { name: 'logo', label: 'Logo URL' },
      {
        name: 'proficiency',
        label: 'Proficiency',
        type: fieldTypes.select,
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      },
      { name: 'order', label: 'Order', type: fieldTypes.number },
    ],
  },
  experience: {
    label: 'Experience',
    api: experienceAPI,
    titleField: 'position',
    subtitleField: 'company',
    fields: [
      { name: 'company', label: 'Company', required: true },
      { name: 'position', label: 'Position', required: true },
      { name: 'duration', label: 'Duration', required: true },
      {
        name: 'description',
        label: 'Description',
        type: fieldTypes.textarea,
        required: true,
      },
      { name: 'logo', label: 'Logo URL' },
      { name: 'technologies', label: 'Technologies', type: fieldTypes.tags },
      { name: 'order', label: 'Order', type: fieldTypes.number },
    ],
  },
  education: {
    label: 'Education',
    api: educationAPI,
    titleField: 'degree',
    subtitleField: 'institution',
    fields: [
      { name: 'institution', label: 'Institution', required: true },
      { name: 'degree', label: 'Degree', required: true },
      { name: 'field', label: 'Field', required: true },
      { name: 'duration', label: 'Duration', required: true },
      { name: 'description', label: 'Description', type: fieldTypes.textarea },
      { name: 'logo', label: 'Logo URL' },
      { name: 'gpa', label: 'Grade/GPA' },
      { name: 'order', label: 'Order', type: fieldTypes.number },
    ],
  },
  projects: {
    label: 'Projects',
    api: projectsAPI,
    titleField: 'title',
    subtitleField: 'description',
    fields: [
      { name: 'title', label: 'Title', required: true },
      {
        name: 'description',
        label: 'Description',
        type: fieldTypes.textarea,
        required: true,
      },
      { name: 'image', label: 'Image URL' },
      { name: 'technologies', label: 'Technologies', type: fieldTypes.tags },
      { name: 'links.github', label: 'GitHub URL' },
      { name: 'links.live', label: 'Live Demo URL' },
      { name: 'links.npm', label: 'NPM URL' },
      { name: 'featured', label: 'Featured', type: fieldTypes.checkbox },
      { name: 'order', label: 'Order', type: fieldTypes.number },
    ],
  },
};

const tabs = ['about', 'skills', 'experience', 'education', 'projects', 'contact'];

const getNested = (source, path) =>
  path.split('.').reduce((value, key) => value?.[key], source);

const setNested = (target, path, value) => {
  const parts = path.split('.');
  let current = target;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value;
      return;
    }

    current[part] = current[part] || {};
    current = current[part];
  });
};

const listToText = (value) =>
  Array.isArray(value) ? value.join(', ') : value || '';

const emptyForm = (fields) =>
  fields.reduce((form, field) => {
    form[field.name] = field.type === fieldTypes.checkbox ? false : '';
    return form;
  }, {});

const itemToForm = (item, fields) =>
  fields.reduce((form, field) => {
    const value = getNested(item, field.name);
    form[field.name] =
      field.type === fieldTypes.tags ? listToText(value) : value ?? '';
    return form;
  }, emptyForm(fields));

const textToList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const formToPayload = (form, fields) =>
  fields.reduce((payload, field) => {
    let value = form[field.name];

    if (field.type === fieldTypes.number) value = Number(value || 0);
    if (field.type === fieldTypes.tags) value = textToList(value);
    if (field.type === fieldTypes.checkbox) value = Boolean(value);

    setNested(payload, field.name, value);
    return payload;
  }, {});

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
};

function ShareProfileCard({ profileUrl, username }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!profileUrl || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, profileUrl, {
      width: 180,
      margin: 2,
      color: {
        dark: '#111827',
        light: '#ffffff',
      },
    });
  }, [profileUrl]);

  const handleCopy = async () => {
    await copyText(profileUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${username || 'portfolio'}-profile-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!profileUrl) return null;

  return (
    <section className="mb-8 rounded-2xl border border-purple-400/20 bg-black/10 backdrop-blur-md p-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Share Profile
          </p>
          <h2 className="mt-1 text-xl font-bold">Profile QR Code</h2>
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-sm text-purple-200 hover:text-purple-100"
          >
            {profileUrl}
            <FiExternalLink className="shrink-0" />
          </a>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-fit rounded bg-white p-3">
            <canvas
              ref={canvasRef}
              aria-label={`QR code for ${profileUrl}`}
              className="h-[180px] w-[180px]"
            />
          </div>

          <div className="flex flex-row gap-2 sm:flex-col">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded bg-purple-600/80 px-4 py-2 text-sm font-semibold hover:bg-purple-700"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 rounded bg-green-600/80 px-4 py-2 text-sm font-semibold hover:bg-green-700"
            >
              <FiDownload />
              Download QR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('about');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm(resourceConfigs.about.fields));
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const config = resourceConfigs[activeTab];
  const publicPath = user?.username ? `/${user.username}` : '/';
  const publicUrl = user?.username
    ? `${window.location.origin}${publicPath}`
    : '';

  const resetForm = useCallback(
    (nextConfig = config) => {
      setForm(nextConfig ? emptyForm(nextConfig.fields) : {});
      setEditingId(null);
    },
    [config]
  );

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError('');

    try {
      if (activeTab === 'contact') {
        setItems(await contactAPI.getAll());
        setForm({});
        setEditingId(null);
        return;
      }

      if (config.single) {
        const data = await config.api.get();
        setItems(data ? [data] : []);
        setForm(itemToForm(data || {}, config.fields));
        setEditingId(data?._id || null);
        return;
      }

      setItems(await config.api.getAll());
      resetForm(config);
    } catch (requestError) {
      setError(requestError.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [activeTab, config, isAuthenticated, resetForm]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [isAuthenticated, loadData, navigate]);

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = formToPayload(form, config.fields);

      if (config.single) {
        const saved = await config.api.update(payload);
        setItems([saved]);
        setForm(itemToForm(saved, config.fields));
        setEditingId(saved._id);
        return;
      }

      if (editingId) {
        await config.api.update(editingId, payload);
      } else {
        await config.api.add(payload);
      }

      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm(itemToForm(item, config.fields));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;

    setError('');
    try {
      await config.api.delete(id);
      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'Failed to delete item');
    }
  };

  const handleContactUpdate = async (id, data) => {
    setError('');
    try {
      await contactAPI.update(id, data);
      await loadData();
    } catch (requestError) {
      setError(requestError.message || 'Failed to update message');
    }
  };

  const renderedFields = useMemo(() => {
    if (!config) return null;

    return config.fields.map((field) => {
      const commonProps = {
        id: field.name,
        name: field.name,
        value: form[field.name] ?? '',
        onChange: handleChange,
        required: field.required,
        className:
          'w-full rounded-lg bg-transparent border border-purple-400/30 p-2 text-white placeholder-purple-200 backdrop-blur-sm focus:border-purple-400 focus:outline-none',
      };

      return (
        <label key={field.name} className="block text-sm text-gray-100">
          <span className="mb-1 block">{field.label}</span>

          {field.type === fieldTypes.textarea ? (
            <textarea {...commonProps} rows="4" />
          ) : field.type === fieldTypes.select ? (
            <select {...commonProps}>
              <option value="" className="bg-purple-950">
                Select
              </option>
              {field.options.map((option) => (
                <option key={option} value={option} className="bg-purple-950">
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === fieldTypes.checkbox ? (
            <input
              id={field.name}
              name={field.name}
              type="checkbox"
              checked={Boolean(form[field.name])}
              onChange={handleChange}
              className="h-5 w-5 accent-purple-600"
            />
          ) : (
            <input
              {...commonProps}
              type={
                field.type === fieldTypes.number
                  ? 'number'
                  : field.type === fieldTypes.email
                    ? 'email'
                    : 'text'
              }
            />
          )}
        </label>
      );
    });
  }, [config, form]);

  if (!isAuthenticated) return null;

  return (
   <div
  className="min-h-screen text-white bg-cover bg-center bg-fixed relative"
  style={{
    backgroundImage: `url(${bgImage})`,
  }}
>
  <div className="fixed inset-0 bg-purple-950/40 pointer-events-none"></div>
  <div className="relative z-10"></div>
      

      {/* NAVBAR SAME AS YOUR OLD CODE */}
      <nav className="bg-gray-800 px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Dashboard</h1>
          {user?.username && (
            <a
              href={publicPath}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-300 hover:text-blue-200"
            >
              View public portfolio: {publicUrl}
            </a>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          type="button"
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-col md:flex-row">
        <aside className="bg-black/20 backdrop-blur-md md:min-h-[calc(100vh-64px)] md:w-56 p-4">
          <div className="grid grid-cols-2 gap-2 md:block md:space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded p-2 text-left ${
                  activeTab === tab
                    ? 'bg-purple-600/70 backdrop-blur-sm'
                    : 'hover:bg-purple-500/20'
                }`}
              >
                {tab === 'contact' ? 'Messages' : resourceConfigs[tab].label}
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <ShareProfileCard profileUrl={publicUrl} username={user?.username} />

          {error && (
            <div className="mb-4 rounded border border-red-500 bg-red-950/40 backdrop-blur-md p-3 text-red-100">
              {error}
            </div>
          )}

          {activeTab !== 'contact' && config && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 rounded-2xl border border-purple-400/20 bg-black/10 backdrop-blur-md p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold">
                  {config.single
                    ? `Edit ${config.label}`
                    : editingId
                      ? `Edit ${config.label}`
                      : `Add ${config.label}`}
                </h2>

                {!config.single && (
                  <button
                    type="button"
                    onClick={() => resetForm(config)}
                    className="rounded bg-purple-600/60 px-3 py-2 text-sm hover:bg-purple-700"
                  >
                    New
                  </button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">{renderedFields}</div>

              <button
                type="submit"
                disabled={saving}
                className="mt-5 rounded bg-green-600/80 px-4 py-2 font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-100">Loading...</p>
          ) : activeTab === 'contact' ? (
            <section className="space-y-4">
              <h2 className="text-xl font-bold">Contact Messages</h2>

              {items.length === 0 && (
                <p className="text-gray-200">No messages yet.</p>
              )}

              {items.map((message) => (
                <article
                  key={message._id}
                  className="rounded-2xl border border-purple-400/20 bg-black/10 backdrop-blur-md p-4"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-bold">{message.name}</h3>
                      <p className="text-sm text-gray-200">{message.email}</p>
                      <p className="mt-3 whitespace-pre-wrap text-gray-100">
                        {message.message}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {['new', 'read', 'replied'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            handleContactUpdate(message._id, { status })
                          }
                          className={`rounded px-3 py-1 text-sm ${
                            message.status === status
                              ? 'bg-purple-600/80'
                              : 'bg-transparent border border-purple-400/30 hover:bg-purple-500/20'
                          }`}
                        >
                          {status}
                        </button>
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          contactAPI.delete(message._id).then(loadData)
                        }
                        className="rounded bg-red-600/80 px-3 py-1 text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className="space-y-4">
              {!config.single && (
                <h2 className="text-xl font-bold">Existing {config.label}</h2>
              )}

              {!config.single && items.length === 0 && (
                <p className="text-gray-200">No items yet.</p>
              )}

              {!config.single &&
                items.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-2xl border border-purple-400/20 bg-black/10 backdrop-blur-md p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-bold">
                          {item[config.titleField] || 'Untitled'}
                        </h3>

                        {config.subtitleField && (
                          <p className="text-sm text-gray-200">
                            {item[config.subtitleField]}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded bg-purple-600/80 px-3 py-2 text-sm hover:bg-purple-700"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="rounded bg-red-600/80 px-3 py-2 text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
            </section>
          )}
        </main>
      </div>
    </div>

  );
}