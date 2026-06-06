import { useCallback } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { aboutAPI } from "../../utils/api";
import { useFetch } from "../../utils/hooks";

const Footer = ({ username }) => {
  const fetchAbout = useCallback(
    () => (username ? aboutAPI.get(username) : Promise.resolve(null)),
    [username]
  );
  const { data: about } = useFetch(fetchAbout);
  const displayName = about?.name || "OWN SPACE";
  const year = new Date().getFullYear();
  const socialLinks = [
    {
      icon: <FaGithub />,
      label: "GitHub",
      href: about?.socialLinks?.github,
    },
    {
      icon: <FaTwitter />,
      label: "Twitter",
      href: about?.socialLinks?.twitter,
    },
    {
      icon: <FaLinkedin />,
      label: "LinkedIn",
      href: about?.socialLinks?.linkedin,
    },
    {
      icon: <FaInstagram />,
      label: "Instagram",
      href: about?.socialLinks?.instagram,
    },
  ].filter((item) => item.href);

  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="text-white py-8 px-[12vw] md:px-[7vw] lg:px-[20vw]">
      <div className="container mx-auto text-center">
        <h2 className="text-xl font-semibold text-white-500">{displayName}</h2>

        <nav className="flex flex-wrap justify-center space-x-4 sm:space-x-6 mt-4">
          {[
            { name: "About", id: "about" },
            { name: "Skills", id: "skills" },
            { name: "Experience", id: "experience" },
            { name: "Projects", id: "work" },
            { name: "Education", id: "education" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleScroll(item.id)}
              className="hover:text-white text-sm sm:text-base my-1"
            >
              {item.name}
            </button>
          ))}
        </nav>

        {socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center space-x-4 mt-6">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl hover:text-white-500 transition-transform transform hover:scale-110"
              >
                {item.icon}
              </a>
            ))}
          </div>
        )}

        <p className="text-sm text-gray-400 mt-6">
          &copy; {year} {displayName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
