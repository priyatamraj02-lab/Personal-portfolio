export interface GithubRepo {
  id?: string;
  name: string;
  fullName?: string;
  description: string;
  htmlUrl: string;
  language: string;
  starsCount: number;
  forksCount: number;
  topics: string[];
  isFeatured: boolean;
  order: number;
  updatedAt?: string;
}
