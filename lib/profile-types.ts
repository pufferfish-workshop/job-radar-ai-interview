export type SectionId =
  | 'basic'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'application';

export interface BasicInfo {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  location: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  technologies: string;
}

export interface ApplicationQuestions {
  authorizedToWork: 'yes' | 'no' | '';
  requiresSponsorship: 'yes' | 'no' | '';
  workPreference: 'remote' | 'hybrid' | 'onsite' | '';
  willingToRelocate: 'yes' | 'no' | '';
}

export interface ProfileData {
  basic: BasicInfo;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  languages: string[];
  application: ApplicationQuestions;
}
