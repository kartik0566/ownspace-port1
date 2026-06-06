import { useCallback, useState } from 'react';
import { useFetch } from '../../utils/hooks';
import { projectsAPI } from '../../utils/api';

const Work = ({ username }) => {
  const fetchProjects = useCallback(() => projectsAPI.getAll(username), [username]);
  const { data, loading, error } = useFetch(fetchProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  if (loading) return <div className="text-white text-center py-20">Loading projects...</div>;
  if (error) return <div className="text-red-500 text-center py-20">Error loading projects: {error}</div>;
  if (!data?.length) return null;

  return (
    <section id="work" className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[20vw] font-sans relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">PROJECTS</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          A showcase of the projects I have worked on, highlighting my skills and experience in various technologies
        </p>
      </div>

      <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((project) => (
          <div
            key={project._id}
            onClick={() => handleOpenModal(project)}
            className="border border-white bg-gray-900 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden cursor-pointer hover:shadow-purple-500/50 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="p-4">
              <img
                src={project.image || 'https://via.placeholder.com/500x300?text=Project'}
                alt={project.title}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-gray-500 mb-4 pt-4 line-clamp-3">{project.description}</p>
              <div className="mb-4">
                {project.technologies?.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-[#251f38] text-xs font-semibold text-purple-500 rounded-full px-2 py-1 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="bg-gray-900 rounded-xl shadow-2xl lg:w-full w-[90%] max-w-3xl overflow-hidden relative">
            <div className="flex justify-end p-4">
              <button
                onClick={handleCloseModal}
                className="text-white text-3xl font-bold hover:text-purple-500"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col">
              <div className="w-full flex justify-center bg-gray-900 px-4">
                <img
                  src={selectedProject.image || 'https://via.placeholder.com/600x350?text=Project'}
                  alt={selectedProject.title}
                  className="lg:w-full w-[95%] object-contain rounded-xl shadow-2xl"
                />
              </div>
              <div className="lg:p-8 p-6">
                <h3 className="lg:text-3xl font-bold text-white mb-4 text-md">{selectedProject.title}</h3>
                <p className="text-gray-400 mb-6 lg:text-base text-xs">{selectedProject.description}</p>
                {selectedProject.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.technologies.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-[#251f38] text-xs font-semibold text-purple-500 rounded-full px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  {selectedProject.links?.github && (
                    <a
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      GitHub
                    </a>
                  )}
                  {selectedProject.links?.live && (
                    <a
                      href={selectedProject.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Live Demo
                    </a>
                  )}
                  {selectedProject.links?.npm && (
                    <a
                      href={selectedProject.links.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      NPM
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Work;
