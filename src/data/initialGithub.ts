import { GithubRepo } from '../types/github';

export const initialGithubRepos: GithubRepo[] = [
  {
    id: "repo-1",
    name: "classroom-activity-monitoring",
    fullName: "priyatamraj/classroom-activity-monitoring",
    description: "Real-time YOLOv8 and DeepSORT video analytics pipeline for student activity detection in classroom environments.",
    htmlUrl: "https://github.com/priyatamraj/classroom-activity-monitoring",
    language: "Python",
    starsCount: 38,
    forksCount: 12,
    topics: ["computer-vision", "yolov8", "deepsort", "pytorch", "flask"],
    isFeatured: true,
    order: 1,
    updatedAt: "2025-02-14"
  },
  {
    id: "repo-2",
    name: "genai-content-copilot",
    fullName: "priyatamraj/genai-content-copilot",
    description: "FastAPI & Gemini-powered intelligent assistant for multi-tone drafting, sentiment analysis, and social engagement forecasting.",
    htmlUrl: "https://github.com/priyatamraj/genai-content-copilot",
    language: "Python",
    starsCount: 45,
    forksCount: 14,
    topics: ["generative-ai", "gemini-api", "fastapi", "prompt-engineering", "nlp"],
    isFeatured: true,
    order: 2,
    updatedAt: "2025-02-18"
  },
  {
    id: "repo-3",
    name: "doc-research-assistant",
    fullName: "priyatamraj/doc-research-assistant",
    description: "Production RAG assistant featuring ChromaDB vector storage, cross-encoder re-ranking, and grounded PDF citations.",
    htmlUrl: "https://github.com/priyatamraj/doc-research-assistant",
    language: "Python",
    starsCount: 52,
    forksCount: 19,
    topics: ["rag", "chromadb", "langchain", "vector-search", "llm"],
    isFeatured: true,
    order: 3,
    updatedAt: "2025-02-22"
  },
  {
    id: "repo-4",
    name: "house-price-prediction",
    fullName: "priyatamraj/house-price-prediction",
    description: "Stacking ensemble regression pipeline with XGBoost, LightGBM, and interactive Streamlit web dashboard.",
    htmlUrl: "https://github.com/priyatamraj/house-price-prediction",
    language: "Python",
    starsCount: 29,
    forksCount: 8,
    topics: ["machine-learning", "xgboost", "scikit-learn", "streamlit", "eda"],
    isFeatured: false,
    order: 4,
    updatedAt: "2024-11-30"
  },
  {
    id: "repo-5",
    name: "disease-prediction-system",
    fullName: "priyatamraj/disease-prediction-system",
    description: "Medical symptom classification decision support app with Random Forest and Flask REST endpoints.",
    htmlUrl: "https://github.com/priyatamraj/disease-prediction-system",
    language: "Python",
    starsCount: 34,
    forksCount: 11,
    topics: ["healthcare-ai", "random-forest", "flask", "classification"],
    isFeatured: false,
    order: 5,
    updatedAt: "2024-10-15"
  }
];
