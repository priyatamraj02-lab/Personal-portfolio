import { Certification } from '../types/certification';

export const initialCertifications: Certification[] = [
  {
    id: "cert-1",
    name: "Machine Learning Specialization",
    issuingOrganization: "DeepLearning.AI / Coursera",
    issueDate: "Dec 2024",
    credentialId: "DL-AI-ML-893472",
    credentialUrl: "https://coursera.org/verify/specialization/sample",
    certificateImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    skillsCovered: ["Supervised Learning", "Neural Networks", "Decision Trees", "Unsupervised Learning", "Recommender Systems"],
    order: 1
  },
  {
    id: "cert-2",
    name: "Generative AI with Large Language Models",
    issuingOrganization: "AWS & DeepLearning.AI",
    issueDate: "Jan 2025",
    credentialId: "AWS-GENAI-LLM-2025",
    credentialUrl: "https://coursera.org/verify/sample-genai",
    certificateImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    skillsCovered: ["Transformer Architecture", "PEFT / LoRA", "RLHF", "LLM Evaluation", "RAG Deployment"],
    order: 2
  },
  {
    id: "cert-3",
    name: "Python for Data Science and Machine Learning Bootcamp",
    issuingOrganization: "Udemy",
    issueDate: "Oct 2024",
    credentialId: "UC-PYTHON-ML-9921",
    credentialUrl: "https://udemy.com/certificate/sample",
    certificateImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    skillsCovered: ["Python 3", "NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-Learn"],
    order: 3
  },
  {
    id: "cert-4",
    name: "Deep Learning Fundamentals & Computer Vision",
    issuingOrganization: "Cognitive Class / IBM",
    issueDate: "Nov 2024",
    credentialId: "IBM-DL-CV-4421",
    credentialUrl: "https://cognitiveclass.ai/certificates/sample",
    certificateImage: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
    skillsCovered: ["Convolutional Neural Networks", "Object Detection", "TensorFlow", "PyTorch"],
    order: 4
  }
];
