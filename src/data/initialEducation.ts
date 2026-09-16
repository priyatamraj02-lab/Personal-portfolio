import { Education } from '../types/education';

export const initialEducation: Education[] = [
  {
    id: "edu-1",
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Centurion University of Technology and Management",
    location: "Odisha, India",
    startYear: "2024",
    endYear: "2028",
    gradeOrCgpa: "Current Student (1st Year)",
    description: "Pursuing rigorous undergraduate coursework focused on Data Science, Machine Learning, Mathematical Foundations of Computing, Data Structures, and Software Engineering.",
    relevantCoursework: [
      "Data Structures & Algorithms",
      "Object Oriented Programming (Python / C++)",
      "Linear Algebra & Matrix Computation",
      "Probability & Mathematical Statistics",
      "Discrete Mathematics",
      "Database Management Systems (SQL)",
      "Operating Systems & Linux Essentials"
    ],
    activitiesAndHonors: [
      "Active Member, AI & Robotics Club",
      "Lead Developer for Campus Hackathon Prototype",
      "Participated in National Level AI Code Sprints"
    ],
    order: 1
  }
];
