import { Experience } from '../types/experience';

export const initialExperience: Experience[] = [
  {
    id: "exp-1",
    organization: "AI & Innovation Labs (Campus / Academic)",
    role: "Machine Learning & AI Research Lead",
    location: "Centurion University, India",
    type: "Research",
    startDate: "Aug 2024",
    endDate: "Present",
    current: true,
    description: [
      "Leading research initiatives on lightweight Computer Vision models for edge inference on resource-constrained devices.",
      "Developing end-to-end RAG pipelines for academic curriculum retrieval with sub-second response times.",
      "Mentoring peer students in Python fundamentals, Scikit-learn data pipelines, and Git collaborative workflows."
    ],
    technologies: ["Python", "PyTorch", "YOLOv8", "LangChain", "FastAPI", "Git"],
    proofUrl: "https://cutm.ac.in",
    order: 1
  },
  {
    id: "exp-2",
    organization: "Open Source AI Projects",
    role: "Open Source Contributor & Model Evaluator",
    location: "Remote",
    type: "Open Source",
    startDate: "Sep 2024",
    endDate: "Present",
    current: true,
    description: [
      "Contributed model benchmarking scripts and documentation for open-source LLM evaluation tools.",
      "Designed synthetic dataset generation workflows using prompt chaining and automated quality scoring.",
      "Reported and patched edge-case bugs in Streamlit-based exploratory data visualization widgets."
    ],
    technologies: ["Python", "Transformers", "Streamlit", "Scikit-learn", "GitHub Actions"],
    proofUrl: "https://github.com/priyatamraj",
    order: 2
  }
];
