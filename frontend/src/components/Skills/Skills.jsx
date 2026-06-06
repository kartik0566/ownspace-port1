import { useCallback, useEffect, useState } from 'react';
import { useFetch } from '../../utils/hooks';
import { skillsAPI } from '../../utils/api';

const Skills = ({ username }) => {
  const fetchSkills = useCallback(() => skillsAPI.getAll(username), [username]);
  const { data, loading, error } = useFetch(fetchSkills);
  const [groupedSkills, setGroupedSkills] = useState([]);

  useEffect(() => {
    if (!data) {
      setGroupedSkills([]);
      return;
    }

    const grouped = {};
    data.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });

    const formatted = Object.keys(grouped).map((category) => ({
      title: category,
      skills: grouped[category],
    }));

    setGroupedSkills(formatted);
  }, [data]);

  if (loading) return <div className="text-white text-center py-20">Loading skills...</div>;
  if (error) return <div className="text-red-500 text-center py-20">Error loading skills: {error}</div>;
  if (groupedSkills.length === 0) return null;

  return (
    <section id="skills" className="py-24 pb-24 px-[12vw] md:px-[7vw] lg:px-[20vw] font-sans">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">SKILLS</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          A showcase of the technologies and tools I have mastered
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {groupedSkills.map((skillGroup, index) => (
          <div key={index} className="border border-white bg-gray-900 backdrop-blur-md rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">{skillGroup.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {skillGroup.skills.map((skill) => (
                <div
                  key={skill._id}
                  className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-purple-600/20 transition"
                >
                  {skill.logo && (
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="w-12 h-12 object-contain mb-2"
                    />
                  )}
                  <p className="text-sm text-gray-300 text-center">{skill.name}</p>
                  {skill.proficiency && (
                    <span className="text-xs text-gray-400 mt-2">{skill.proficiency}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
