import { SkillsInfo, experiences, projects } from '../constants';

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
    profileImage: 'https://picsum.photos/seed/test-profile-photo/800/800',
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
  education: [
    {
      _id: 'static-education-test-1',
      institution: 'Test University',
      degree: 'Master of Computer Applications - Test Degree',
      duration: '2022 - 2024',
      description:
        'This is test education content for checking the portfolio education layout on the live GitHub Pages site.',
      logo: 'https://picsum.photos/seed/test-university-photo/300/200',
      gpa: '8.5 CGPA',
      order: 1,
    },
    {
      _id: 'static-education-test-2',
      institution: 'Test College',
      degree: 'Bachelor of Science - Test Degree',
      duration: '2019 - 2022',
      description:
        'This test college entry is temporary sample data and can be replaced with final education details later.',
      logo: 'https://picsum.photos/seed/test-college-photo/300/200',
      gpa: '75%',
      order: 2,
    },
    {
      _id: 'static-education-test-3',
      institution: 'Test Public School',
      degree: 'Class XII - Test Details',
      duration: '2017 - 2018',
      description:
        'Temporary school details used to preview spacing, images, and text in the education section.',
      logo: 'https://picsum.photos/seed/test-school-photo/300/200',
      gpa: '80%',
      order: 3,
    },
  ],
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
