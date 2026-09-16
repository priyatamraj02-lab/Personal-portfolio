import { Achievement } from '../types/achievement';

export const initialAchievements: Achievement[] = [
  {
    id: "ach-1",
    title: "1st Place - Smart Odisha Hackathon 2024 (Campus Track)",
    organization: "Centurion University & Tech Fest",
    date: "Nov 2024",
    category: "Hackathon",
    description: "Built the prototype for an automated AI classroom activity & attendance tracking system with real-time video analytics, beating 35+ competing teams.",
    proofUrl: "https://github.com/priyatamraj/classroom-activity-monitoring",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
    order: 1
  },
  {
    id: "ach-2",
    title: "Kaggle 3x Notebooks Expert & Community Contributor",
    organization: "Kaggle",
    date: "Dec 2024",
    category: "Competition",
    description: "Published comprehensive exploratory data analysis notebooks on House Price Regression and Medical Symptom Classification with over 200+ upvotes and bronze/silver medals.",
    proofUrl: "https://kaggle.com/priyatamraj",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    order: 2
  },
  {
    id: "ach-3",
    title: "Academic Excellence Scholarship (Merit List)",
    organization: "Centurion University of Technology and Management",
    date: "Aug 2024",
    category: "Academic",
    description: "Awarded university academic scholarship for top percentile ranking in entrance examination and foundational STEM coursework.",
    proofUrl: "https://cutm.ac.in",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    order: 3
  }
];
