import { useCallback } from 'react';
import { useFetch } from '../../utils/hooks';
import { experienceAPI } from '../../utils/api';

const Experience = ({ username }) => {
  const fetchExperience = useCallback(
    () => experienceAPI.getAll(username),
    [username]
  );
  const { data, loading, error } = useFetch(fetchExperience);

  if (loading) return <div className="text-white text-center py-20">Loading experience...</div>;
  if (error) return <div className="text-red-500 text-center py-20">Error loading experience: {error}</div>;
  if (!data?.length) return null;

  return (
    <section id="experience" className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-2">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">EXPERIENCE</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          A collection of my work experience and the roles I have taken in various organizations
        </p>
      </div>

      <div className="relative">
        <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

        {data.map((experience, index) => (
          <div
            key={experience._id}
            className={`flex flex-col sm:flex-row items-center mb-16 ${
              index % 2 === 0 ? 'sm:justify-end' : 'sm:justify-start'
            }`}
          >
            <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 bg-gray-400 border-4 border-[#8245ec] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10">
              {experience.logo ? (
                <img
                  src={experience.logo}
                  alt={experience.company}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-purple-600 rounded-full"></div>
              )}
            </div>

            <div
              className={`w-full sm:max-w-md p-4 sm:p-8 rounded-2xl shadow-2xl border border-white bg-gray-900 backdrop-blur-md shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] ${
                index % 2 === 0 ? 'sm:ml-0' : 'sm:mr-0'
              } sm:ml-44 sm:mr-44 ml-8 transform transition-transform duration-300 hover:scale-105`}
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white rounded-md overflow-hidden">
                  {experience.logo ? (
                    <img
                      src={experience.logo}
                      alt={experience.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600"></div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white">{experience.position}</h3>
                    <h4 className="text-md sm:text-sm text-gray-300">{experience.company}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{experience.duration}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-400">{experience.description}</p>
              {experience.technologies?.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-white">Technologies:</h5>
                  <ul className="flex flex-wrap mt-2">
                    {experience.technologies.map((tech, idx) => (
                      <li
                        key={idx}
                        className="bg-[#8245ec] text-gray-300 px-4 py-1 text-xs sm:text-sm rounded-lg mr-2 mb-2 border border-gray-400"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
