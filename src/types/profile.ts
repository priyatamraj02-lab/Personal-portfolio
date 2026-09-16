export interface Profile {
  id?: string;
  name: string;
  headline: string;
  subheadline?: string;
  bio: string;
  aboutText: string[];
  currentFocus: string;
  learningFocus: string;
  careerGoals: string;
  profileImage: string;
  location: string;
  email: string;
  phone?: string;
  availability: 'Available' | 'Open to Opportunities' | 'Busy';
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl?: string;
  kaggleUrl?: string;
  resumeUrl: string;
  yearsOfExperience: string;
  stats?: {
    projectsCompleted: number;
    skillsMastered: number;
    certificationsEarned: number;
    githubRepositories: number;
  };
}
