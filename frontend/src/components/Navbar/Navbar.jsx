import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiGrid, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { aboutAPI } from "../../utils/api";
import { useAuth, useFetch } from "../../utils/hooks";

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const fetchAbout = useCallback(
    () => (username ? aboutAPI.get(username) : Promise.resolve(null)),
    [username]
  );
  const { data: about } = useFetch(fetchAbout);
  const socialLinks = [
    {
      href: about?.socialLinks?.github,
      label: "GitHub",
      icon: <FaGithub size={24} />,
    },
    {
      href: about?.socialLinks?.linkedin,
      label: "LinkedIn",
      icon: <FaLinkedin size={24} />,
    },
  ].filter((item) => item.href);

  // Detect scroll and change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll function
  const handleMenuItemClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuItems = [
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "work", label: "Projects" },
    { id: "education", label: "Education" },
  ];

  const handleDashboard = () => {
    setIsOpen(false);
    navigate("/admin/dashboard");
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/admin/login");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition duration-300 px-[7vw] md:px-[7vw] lg:px-[20vw] ${
        isScrolled ? "bg-[#050414] bg-opacity-50 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="text-white py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-semibold cursor-pointer">

          <span className="text-white">OWN</span>
    
          <span className="text-white">SPACE</span>
         
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-300">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`cursor-pointer hover:text-[#8245ec] ${
                activeSection === item.id ? "text-[#8245ec]" : ""
              }`}
            >
              <button onClick={() => handleMenuItemClick(item.id)}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Social Icons and Account Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#8245ec]"
            >
              {item.icon}
            </a>
          ))}
          {isAuthenticated && (
            <>
              <button
                type="button"
                onClick={handleDashboard}
                className="inline-flex items-center gap-2 rounded-full border border-gray-700 px-3 py-2 text-sm text-gray-300 hover:border-[#8245ec] hover:text-white"
              >
                <FiGrid />
                Dashboard
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[#8245ec] px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          {isOpen ? (
            <FiX
              className="text-3xl text-[#8245ec] cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          ) : (
            <FiMenu
              className="text-3xl text-[#8245ec] cursor-pointer"
              onClick={() => setIsOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#050414] pb-4">
          <ul className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuItemClick(item.id)}
                  className="text-gray-300 hover:text-[#8245ec] text-left w-full py-2"
                >
                  {item.label}
                </button>
              </li>
            ))}
            {isAuthenticated && (
              <>
                <li>
                  <button
                    onClick={handleDashboard}
                    className="flex w-full items-center gap-2 py-2 text-left text-gray-300 hover:text-[#8245ec]"
                    type="button"
                  >
                    <FiGrid />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 py-2 text-left text-gray-300 hover:text-[#8245ec]"
                    type="button"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
