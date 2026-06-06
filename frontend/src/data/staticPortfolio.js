import profileImage from '../assets/profile2.png';
import {
  SkillsInfo,
  education as educationItems,
  experiences,
  projects,
} from '../constants';

export const staticPortfolioUsername =
  import.meta.env.VITE_PORTFOLIO_USERNAME || 'kartik';

export const staticPortfolio = {
  username: staticPortfolioUsername,
  about: {
    _id: 'static-about',
    name: 'Kartik Srivastav',
    title: 'Full Stack Developer',
    bio: 'I build responsive, practical web applications with React, Node.js, Express, and MongoDB, with a focus on clean interfaces and useful product experiences.',
    email: 'kartiksrivastav2004@gmail.com',
    profileImage,
    socialLinks: {
      github: 'https://github.com/kartik0566',
    },
  },
  skills: SkillsInfo.flatMap((group, groupIndex) =>
    group.skills.map((skill, skillIndex) => ({
      _id: `static-skill-${groupIndex}-${skillIndex}`,
      category: group.title,
      name: skill.name,
      logo: skill.logo,
      order: skillIndex + 1,
    }))
  ),
  experience: experiences.map((experience) => ({
    _id: `static-experience-${experience.id}`,
    company: experience.company,
    position: experience.role,
    duration: experience.date,
    description: experience.desc,
    logo: experience.img,
    technologies: experience.skills,
    order: experience.id + 1,
  })),
  education: educationItems.map((education) => ({
    _id: `static-education-${education.id}`,
    institution: education.school,
    degree: education.degree,
    duration: education.date,
    description: education.desc,
    logo: education.img,
    gpa: education.grade,
    order: education.id + 1,
  })),
  projects: projects.map((project) => ({
    _id: `static-project-${project.id}`,
    title: project.title,
    description: project.description,
    image: project.image,
    technologies: project.tags,
    links: {
      github: project.github,
      live: project.webapp,
    },
    featured: true,
    order: project.id + 1,
  })),
};

export const getStaticPortfolio = (username = staticPortfolioUsername) => {
  if (username !== staticPortfolioUsername) return null;
  return staticPortfolio;
};
