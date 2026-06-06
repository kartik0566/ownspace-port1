import { useCallback } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import Tilt from 'react-parallax-tilt';
import { useFetch } from '../../utils/hooks';
import { aboutAPI } from '../../utils/api';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const About = ({ username }) => {
  const fetchAbout = useCallback(
    () => (username ? aboutAPI.get(username) : Promise.resolve(null)),
    [username]
  );
  const { data, loading, error } = useFetch(fetchAbout);
  const about = data || {};
  const typingText = [about.title].filter(Boolean);
  const hasValidEmail = emailPattern.test(about.email || '');

  const handleContactClick = () => {
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <div className="text-white text-center py-20">Loading about section...</div>;
  if (error) return <div className="text-red-500 text-center py-20">Error loading about section: {error}</div>;
  if (!data) return null;

  return (
    <section id="about" className="py-4 px-[7vw] md:px-[7vw] lg:px-[20vw] font-sans mt-16 md:mt-24 lg:mt-32">
      <div className="flex flex-col-reverse md:flex-row justify-between items-center">
        <div className={`${about.profileImage ? 'md:w-1/2' : 'w-full'} text-center md:text-left mt-8 md:mt-0`}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">Hi, I am</h1>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">{about.name}</h2>
          {typingText.length > 0 && (
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-[#8245ec] leading-tight">
              <span className="text-white">I am a </span>
              <ReactTypingEffect
                text={typingText}
                speed={100}
                eraseSpeed={50}
                typingDelay={500}
                eraseDelay={2000}
                cursorRenderer={(cursor) => <span className="text-[#8245ec]">{cursor}</span>}
              />
            </h3>
          )}
          <p className="text-base sm:text-lg md:text-lg text-gray-400 mb-10 mt-8 leading-relaxed">
            {about.bio}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {hasValidEmail ? (
              <a
                href={`mailto:${about.email}?subject=${encodeURIComponent(`Portfolio inquiry for ${about.name || username}`)}`}
                className="inline-block text-white py-3 px-8 rounded-full text-lg font-bold transition duration-300 transform hover:scale-105"
                style={{ background: 'linear-gradient(90deg, #8245ec, #a855f7)', boxShadow: '0 0 2px #8245ec, 0 0 2px #8245ec, 0 0 40px #8245ec' }}
              >
                Email Me
              </a>
            ) : (
              <button
                type="button"
                onClick={handleContactClick}
                className="inline-block text-white py-3 px-8 rounded-full text-lg font-bold transition duration-300 transform hover:scale-105"
                style={{ background: 'linear-gradient(90deg, #8245ec, #a855f7)', boxShadow: '0 0 2px #8245ec, 0 0 2px #8245ec, 0 0 40px #8245ec' }}
              >
                Contact Me
              </button>
            )}
            {about.phone && (
              <span className="text-gray-300">{about.phone}</span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            {about.socialLinks?.github && (
              <a href={about.socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                GitHub
              </a>
            )}
            {about.socialLinks?.linkedin && (
              <a href={about.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                LinkedIn
              </a>
            )}
            {about.socialLinks?.twitter && (
              <a href={about.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                Twitter
              </a>
            )}
            {about.socialLinks?.instagram && (
              <a href={about.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                Instagram
              </a>
            )}
          </div>
        </div>

        {about.profileImage && (
          <div className="md:w-1/2 flex justify-center md:justify-end">
            <Tilt
              className="w-48 h-48 sm:w-64 sm:h-64 md:w-[30rem] md:h-[30rem] border-4 border-purple-700 rounded-full"
              tiltMaxAngleX={20}
              tiltMaxAngleY={20}
              perspective={1000}
              scale={1.05}
              transitionSpeed={1000}
              gyroscope={true}
            >
              <img
                src={about.profileImage}
                alt={about.name || 'Profile Image'}
                className="w-full h-full rounded-full object-cover drop-shadow-[0_10px_20px_rgba(130,69,236,0.5)]"
              />
            </Tilt>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
