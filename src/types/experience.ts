export interface Experience {
  id?: string;
  organization: string;
  role: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Research' | 'Open Source';
  startDate: string;
  endDate: string | 'Present';
  current: boolean;
  description: string[];
  technologies: string[];
  proofUrl?: string;
  order: number;
}
