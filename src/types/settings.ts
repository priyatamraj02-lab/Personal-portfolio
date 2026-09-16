export interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  metaKeywords: string[];
  contactEmail: string;
  enableContactForm: boolean;
  enableBlogSection?: boolean;
  githubUsername: string;
  autoSyncGithub: boolean;
  showAvailabilityBadge: boolean;
  availabilityText: string;
  googleAnalyticsId?: string;
  footerQuote: string;
}
