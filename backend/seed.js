import Skill from './models/Skill.js';
import Experience from './models/Experience.js';
import Education from './models/Education.js';
import Project from './models/Project.js';
import About from './models/About.js';
import User from './models/User.js';
import connectDB from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Project.deleteMany({}),
      About.deleteMany({}),
      User.deleteMany({}),
    ]);

    console.log('Cleared existing data');

    // Seed demo user
    const user = new User({
      username: process.env.ADMIN_USERNAME || 'kartik',
      name: process.env.ADMIN_NAME || 'Kartik',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
    });
    await user.save();
    console.log('Demo user created');

    // Seed Skills
    const skills = [
      {
        category: 'Frontend',
        name: 'React JS',
        proficiency: 'Expert',
        order: 1,
      },
      {
        category: 'Frontend',
        name: 'Tailwind CSS',
        proficiency: 'Expert',
        order: 2,
      },
      {
        category: 'Frontend',
        name: 'JavaScript',
        proficiency: 'Expert',
        order: 3,
      },
      {
        category: 'Frontend',
        name: 'HTML/CSS',
        proficiency: 'Expert',
        order: 4,
      },
      {
        category: 'Backend',
        name: 'Node.js',
        proficiency: 'Advanced',
        order: 1,
      },
      {
        category: 'Backend',
        name: 'Express.js',
        proficiency: 'Advanced',
        order: 2,
      },
      {
        category: 'Backend',
        name: 'MongoDB',
        proficiency: 'Advanced',
        order: 3,
      },
      {
        category: 'Languages',
        name: 'JavaScript',
        proficiency: 'Expert',
        order: 1,
      },
      {
        category: 'Languages',
        name: 'Python',
        proficiency: 'Advanced',
        order: 2,
      },
    ];

    await Skill.insertMany(skills.map((skill) => ({ ...skill, userId: user._id })));
    console.log('Skills seeded');

    // Seed Experience
    const experiences = [
      {
        company: 'Tech Company',
        position: 'Full Stack Developer',
        duration: '2023 - Present',
        description: 'Building responsive web applications using React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB'],
        order: 1,
      },
      {
        company: 'Startup Inc',
        position: 'Frontend Developer',
        duration: '2022 - 2023',
        description: 'Developed user interfaces and implemented features',
        technologies: ['React', 'JavaScript', 'Tailwind CSS'],
        order: 2,
      },
    ];

    await Experience.insertMany(
      experiences.map((experience) => ({ ...experience, userId: user._id }))
    );
    console.log('Experience seeded');

    // Seed Education
    const educations = [
      {
        institution: 'University Name',
        degree: 'Bachelor of Technology',
        field: 'Computer Science',
        duration: '2020 - 2024',
        description: 'Focused on web development and data structures',
        gpa: '3.8',
        order: 1,
      },
    ];

    await Education.insertMany(
      educations.map((education) => ({ ...education, userId: user._id }))
    );
    console.log('Education seeded');

    // Seed Projects
    const projects = [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce application with payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        links: {
          github: 'https://github.com',
          live: 'https://example.com',
        },
        featured: true,
        order: 1,
      },
      {
        title: 'Task Management App',
        description: 'Collaborative task management tool with real-time updates',
        technologies: ['React', 'Firebase', 'Tailwind CSS'],
        links: {
          github: 'https://github.com',
          live: 'https://example.com',
        },
        featured: true,
        order: 2,
      },
    ];

    await Project.insertMany(
      projects.map((project) => ({ ...project, userId: user._id }))
    );
    console.log('Projects seeded');

    // Seed About
    const about = new About({
      userId: user._id,
      name: user.name || user.username,
      title: 'Full Stack Developer',
      bio: 'Passionate about creating beautiful and functional web applications',
      email: user.email,
      phone: '+1234567890',
      location: 'City, Country',
      socialLinks: {
        github: 'https://github.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        twitter: 'https://twitter.com/yourusername',
        instagram: 'https://instagram.com/yourusername',
      },
    });

    await about.save();
    console.log('About section seeded');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
