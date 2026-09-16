export interface Education {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  gradeOrCgpa?: string;
  description: string;
  relevantCoursework: string[];
  activitiesAndHonors?: string[];
  order: number;
}
