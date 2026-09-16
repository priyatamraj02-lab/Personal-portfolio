export type ProjectCategory = 
  | 'Machine Learning'
  | 'Deep Learning'
  | 'Generative AI'
  | 'Data Science'
  | 'AI Applications';

export interface ProjectMetric {
  label: string;
  value: string;
  description?: string;
}

export interface ProjectChallenge {
  challenge: string;
  solution: string;
}

export interface Project {
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  category: ProjectCategory;
  description: string;
  problemStatement: string;
  motivation: string;
  dataset: string;
  technologies: string[];
  methodology: string;
  architecture: {
    overview: string;
    diagramUrl?: string;
    pipelineSteps?: string[];
  };
  implementation: string;
  modelDetails: {
    name: string;
    type: string;
    framework: string;
    parameters?: string;
  };
  results: string;
  evaluationMetrics: ProjectMetric[];
  challenges: ProjectChallenge[];
  keyLearnings: string[];
  futureImprovements: string[];
  codeSnippet?: {
    language: string;
    code: string;
    title: string;
  };
  thumbnail: string;
  galleryImages: string[];
  githubUrl: string;
  liveDemoUrl?: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}
