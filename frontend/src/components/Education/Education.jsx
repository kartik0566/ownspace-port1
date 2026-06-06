import { useCallback } from 'react';
import { useFetch } from '../../utils/hooks';
import { educationAPI } from '../../utils/api';

const Education = ({ username }) => {
  const fetchEducation = useCallback(
    () => educationAPI.getAll(username),
    [username]
  );
  const { data, loading, error } = useFetch(fetchEducation);

  if (loading) return <div className="text-white text-center py-20">Loading education...</div>;
  if (error) return <div className="text-red-500 text-center py-20">Error loading education: {error}</div>;
  if (!data?.length) return null;

  return (
    <section id="education" className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[16vw] font-sans bg-skills-gradient clip-path-custom-3">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">EDUCATION</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          My education has been a journey of learning and development. Here are the details of my academic background
        </p>
      </div>

      <div className="relative">
        <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 sm:-translate-x-0 w-1 bg-white h-full"></div>

        {data.map((edu, index) => (
          <div
            key={edu._id}
            className={`flex flex-col sm:flex-row items-center mb-16 ${
              index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'
            }`}
          >
            <div className="absolute sm:left-1/2 left-0 transform -translate-x-1/2 bg-gray-400 border-4 border-[#8245ec] w-12 h-12 sm:w-16 sm:h-16 rounded-full flex justify-center items-center z-10">
              {edu.logo ? (
                <img
                  src={edu.logo}
                  alt={edu.institution}
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
                <div className="w-24 h-16 bg-white rounded-md overflow-hidden">
                  {edu.logo ? (
                    <img
                      src={edu.logo}
                      alt={edu.institution}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-purple-600"></div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-xl font-semibold text-white">{edu.degree}</h3>
                    <h4 className="text-md sm:text-sm text-gray-300">{edu.institution}</h4>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{edu.duration}</p>
                </div>
              </div>

              {edu.gpa && <p className="mt-4 text-gray-400 font-bold">Grade: {edu.gpa}</p>}
              {edu.description && <p className="mt-4 text-gray-400">{edu.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
