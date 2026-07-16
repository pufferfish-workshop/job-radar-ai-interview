import type { ProfileData } from '@/lib/profile-types';

export const demoProfile: ProfileData = {
  basic: {
    firstName: 'Alex',
    lastName: 'Morgan',
    headline: 'Product Manager focused on user-centered SaaS products',
    email: 'alex.morgan@example.com',
    location: 'Toronto, ON, Canada',
    summary:
      'Product manager with 6+ years of experience building and launching user-centered SaaS products. Skilled in product strategy, roadmapping, stakeholder alignment, and data-informed decision making.',
  },
  experience: [
    {
      id: 'experience-1',
      company: 'Northstar Labs',
      role: 'Senior Product Manager',
      location: 'Toronto, ON',
      startDate: '2022-04',
      endDate: 'Present',
      description:
        'Led discovery and roadmap delivery for a workflow platform used by 40,000+ teams. Partnered with design and engineering to improve activation by 28%.',
    },
    {
      id: 'experience-2',
      company: 'Harbor Systems',
      role: 'Product Manager',
      location: 'Remote',
      startDate: '2019-08',
      endDate: '2022-03',
      description:
        'Owned the analytics product line from customer research through launch, building a repeatable feedback loop with sales and support.',
    },
  ],
  education: [
    {
      id: 'education-1',
      school: 'University of Waterloo',
      degree: 'Bachelor of Mathematics',
      field: 'Business Administration',
      startYear: '2013',
      endYear: '2017',
    },
  ],
  projects: [
    {
      id: 'project-1',
      name: 'Customer feedback hub',
      description: 'A lightweight internal tool for clustering product feedback and tracking follow-up.',
      url: 'https://example.com/feedback-hub',
      technologies: 'Next.js, TypeScript, PostgreSQL',
    },
  ],
  skills: ['Product strategy', 'Roadmapping', 'User research', 'SQL', 'A/B testing'],
  languages: ['English — Native', 'French — Conversational'],
  application: {
    authorizedToWork: 'yes',
    requiresSponsorship: 'no',
    workPreference: 'hybrid',
    willingToRelocate: 'no',
  },
};
