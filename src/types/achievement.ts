export interface Achievement {
  id?: string;
  title: string;
  organization: string;
  date: string;
  category: 'Hackathon' | 'Competition' | 'Academic' | 'Open Source' | 'Certification';
  description: string;
  proofUrl?: string;
  imageUrl?: string;
  order: number;
}
