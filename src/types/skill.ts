export type SkillCategory = 
  | 'Programming'
  | 'Data Science'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Generative AI'
  | 'Tools';

export interface Skill {
  id?: string;
  name: string;
  category: SkillCategory;
  level: 'Fundamental' | 'Intermediate' | 'Advanced' | 'Expert';
  icon?: string; // Lucide icon name or image url
  order: number;
  enabled: boolean;
  featured: boolean;
  description?: string;
  tags?: string[];
}
