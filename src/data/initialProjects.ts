import { Project } from '../types/project';

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    slug: "classroom-activity-monitoring-system",
    title: "Classroom Activity Monitoring System",
    tagline: "Real-time AI-powered vision system for automated classroom behavioral analysis",
    category: "Deep Learning",
    description: "YOLO-based computer vision system for detecting classroom activities such as reading, writing, standing, and unauthorized phone usage in real-time video feeds.",
    problemStatement: "Traditional classroom monitoring relies on manual human supervision, which is subjective, prone to fatigue, and incapable of providing structured temporal behavioral metrics across large lecture halls.",
    motivation: "To provide educational institutions with automated, privacy-conscious behavioral analytics that assist educators in identifying student engagement levels, distraction patterns, and classroom dynamics without intrusive surveillance.",
    dataset: "Custom annotated dataset comprising over 4,200 high-resolution classroom frames annotated with 5 activity classes (Reading, Writing, Standing, Phone Usage, Listening) augmented with rotation, brightness variations, and simulated occlusion.",
    technologies: ["Python", "YOLOv8", "OpenCV", "Flask", "PyTorch", "NumPy", "Matplotlib"],
    methodology: "Implemented a multi-stage vision pipeline featuring frame extraction, spatial preprocessing, fine-tuned YOLOv8 bounding box regression and classification, followed by DeepSORT object tracking to maintain student identities across consecutive frames.",
    architecture: {
      overview: "Video Stream Input -> OpenCV Frame Sampling -> YOLOv8 Detection Engine -> DeepSORT Multi-Object Tracking -> Temporal Activity Classifier -> Flask Web Dashboard & Alerting Engine.",
      diagramUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      pipelineSteps: [
        "RTSP Camera Video Feed Acquisition via OpenCV",
        "Frame Normalization and Tensor Batching",
        "YOLOv8 Backbone Feature Extraction & Anchor-Free Head Prediction",
        "Temporal IoU Filtering and Non-Maximum Suppression (NMS)",
        "Flask REST API streaming annotated inference frames and JSON telemetry"
      ]
    },
    implementation: "Trained on custom YOLOv8 model using PyTorch with transfer learning from MS COCO. Exported to ONNX runtime for sub-30ms inference on consumer GPUs. Built a lightweight Flask web dashboard providing real-time bounding box overlays and activity heatmaps.",
    modelDetails: {
      name: "YOLOv8-Classroom Custom",
      type: "Object Detection & Activity Classification",
      framework: "PyTorch / Ultralytics",
      parameters: "11.2M Parameters (YOLOv8s backbone)"
    },
    results: "Achieved 91.4% mAP@0.5 across all 5 classes, maintaining 34 FPS inference speed on an RTX 3060 GPU and 14 FPS on CPU-only edge deployments.",
    evaluationMetrics: [
      { label: "mAP@0.5", value: "91.4%", description: "Mean Average Precision at IoU threshold 0.5" },
      { label: "Precision", value: "92.8%", description: "Accuracy of positive activity predictions" },
      { label: "Recall", value: "89.6%", description: "Ratio of detected activities captured" },
      { label: "Inference Latency", value: "28ms", description: "Average processing time per frame" }
    ],
    challenges: [
      {
        challenge: "Class Imbalance & Phone Occlusion: Handheld smartphones are frequently occluded by desks and hands, leading to false negatives.",
        solution: "Synthetically augmented dataset with cut-out desk overlays and applied focal loss during training to penalize hard misclassifications."
      },
      {
        challenge: "Real-time Video Processing Latency: High resolution RTSP streams caused buffer backlog and dropped frames.",
        solution: "Implemented asynchronous multi-threaded frame queue ingestion and dynamic frame skipping when latency exceeded 50ms."
      }
    ],
    keyLearnings: [
      "Deep understanding of YOLO anchor-free object detection architectures and feature pyramid networks (FPN).",
      "Techniques for edge optimization using ONNX Runtime and TensorRT engine serialization.",
      "Handling real-world noise, illumination fluctuations, and perspective distortion in video streams."
    ],
    futureImprovements: [
      "Incorporate 3D Pose Estimation with MediaPipe for ergonomic posture analysis.",
      "Deploy on edge hardware such as Raspberry Pi 5 with Google Coral TPU.",
      "Integrate an automated weekly engagement summary report sent via email to instructors."
    ],
    codeSnippet: {
      language: "python",
      title: "inference_pipeline.py",
      code: `import cv2\nfrom ultralytics import YOLO\n\n# Load custom trained YOLOv8 model\nmodel = YOLO('models/yolov8_classroom_best.pt')\n\ndef process_frame(frame, conf_threshold=0.65):\n    results = model.predict(source=frame, conf=conf_threshold, verbose=False)\n    activities = {'reading': 0, 'writing': 0, 'phone_usage': 0, 'standing': 0}\n    \n    for box in results[0].boxes:\n        cls_id = int(box.cls[0].item())\n        cls_name = model.names[cls_id]\n        if cls_name in activities:\n            activities[cls_name] += 1\n            \n    annotated_frame = results[0].plot()\n    return annotated_frame, activities`
    },
    thumbnail: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
    ],
    githubUrl: "https://github.com/priyatamraj/classroom-activity-monitoring",
    liveDemoUrl: "https://classroom-monitor-demo.example.com",
    featured: true,
    published: true,
    order: 1,
    createdAt: "2024-11-15"
  },
  {
    id: "proj-2",
    slug: "genai-content-co-pilot",
    title: "GenAI Content Co-Pilot",
    tagline: "Intelligent writing companion for multi-format content drafting & sentiment analysis",
    category: "Generative AI",
    description: "AI-powered application for content drafting, style analysis, readability scoring, and engagement prediction using Gemini LLM and custom NLP pipelines.",
    problemStatement: "Content creators and marketers spend hours drafting, editing, and formatting articles while struggling to quantify tone consistency and audience engagement prior to publishing.",
    motivation: "Create a unified generative copilot that not only creates compelling drafts across diverse formats (articles, tweets, technical docs) but also provides empirical NLP metrics on tone, complexity, and sentiment.",
    dataset: "Curated dataset of 15,000+ top-performing technical articles, social media posts, and academic abstracts for sentiment benchmarking and few-shot prompt synthesis.",
    technologies: ["Python", "FastAPI", "MongoDB", "Gemini API", "Machine Learning", "Scikit-learn", "NLTK", "Tailwind CSS"],
    methodology: "Engineered structured few-shot prompt workflows paired with Gemini Pro API. Combined with a localized Scikit-learn regression model trained on TF-IDF features to forecast viral engagement probabilities and Flesch-Kincaid readability indices.",
    architecture: {
      overview: "Frontend Editor -> FastAPI Gateway -> Prompt Routing & Memory Engine -> Google Gemini 1.5 Pro API -> Local NLP Classifier (Engagement Score) -> MongoDB Storage.",
      diagramUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      pipelineSteps: [
        "Content input and persona selection (Technical, Casual, Executive)",
        "Prompt template expansion with constraint tokens",
        "Asynchronous Gemini streaming response parsing",
        "Token frequency and sentiment polarity evaluation via NLTK",
        "Engagement probability computation and suggestions persistence"
      ]
    },
    implementation: "Constructed with FastAPI backend providing streaming SSE (Server-Sent Events) tokens. Uses MongoDB to store versioned drafts, tone analysis reports, and user interaction metrics.",
    modelDetails: {
      name: "Gemini 1.5 Pro + Custom Gradient Boosting Regressor",
      type: "Generative LLM + NLP Sentiment Estimator",
      framework: "Google GenAI SDK + Scikit-learn",
      parameters: "Multi-billion LLM + 500-feature Gradient Boosting"
    },
    results: "Reduced drafting time by 65% for test users, achieving a 0.84 R² score on engagement prediction across benchmark datasets.",
    evaluationMetrics: [
      { label: "Readability Accuracy", value: "98.2%", description: "Flesch-Kincaid index alignment" },
      { label: "Token Generation Speed", value: "62 tok/s", description: "Average streaming throughput" },
      { label: "Engagement R²", value: "0.84", description: "Regression correlation with social metrics" },
      { label: "Prompt Cache Hit", value: "74%", description: "Reduced API cost via intelligent caching" }
    ],
    challenges: [
      {
        challenge: "LLM Hallucinations & Formatting Drift: The model occasionally deviated from requested markdown schemas.",
        solution: "Enforced JSON Schema response modes via Gemini structured output parameters and added Pydantic runtime validation."
      },
      {
        challenge: "Cold Start Latency: Complex chained prompts resulted in 4+ second delays before the first token.",
        solution: "Switched to asynchronous streaming architecture with server-sent events, rendering tokens within 280ms."
      }
    ],
    keyLearnings: [
      "Advanced Prompt Engineering techniques (Chain-of-Thought, ReAct, Few-Shot In-Context Learning).",
      "Building resilient API rate-limit exponential backoff and caching layers in FastAPI.",
      "Combining rule-based NLP metrics with generative AI outputs for hybrid validation."
    ],
    futureImprovements: [
      "Add fine-tuned LoRA adapter for brand-specific voice guidelines.",
      "Introduce multi-agent debate mode for automated fact-checking.",
      "Direct one-click export integrations to Medium, Dev.to, and LinkedIn APIs."
    ],
    codeSnippet: {
      language: "python",
      title: "copilot_service.py",
      code: `import google.generativeai as genai\nfrom fastapi.responses import StreamingResponse\n\ngenai.configure(api_key=SETTINGS.GEMINI_API_KEY)\nmodel = genai.GenerativeModel('gemini-1.5-pro')\n\nasync def stream_content_generation(prompt: str, tone: str):\n    system_instruction = f"You are an expert AI content strategist. Output tone: {tone}."\n    response = model.generate_content(\n        contents=[system_instruction, prompt],\n        stream=True\n    )\n    for chunk in response:\n        if chunk.text:\n            yield f"data: {chunk.text}\\n\\n"`
    },
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
    ],
    githubUrl: "https://github.com/priyatamraj/genai-content-copilot",
    liveDemoUrl: "https://copilot-demo.example.com",
    featured: true,
    published: true,
    order: 2,
    createdAt: "2025-01-20"
  },
  {
    id: "proj-3",
    slug: "intelligent-document-research-assistant",
    title: "Intelligent Document Research Assistant",
    tagline: "Enterprise RAG assistant for multi-document semantic search & contextual Q&A",
    category: "Generative AI",
    description: "RAG-based AI assistant that allows users to upload PDF/DOCX documents and ask questions with precise source citations using vector embeddings and semantic search.",
    problemStatement: "Searching across multi-hundred page research papers, manuals, and reports is tedious. Standard keyword search fails to understand semantic nuances, while vanilla LLMs hallucinate when queried on private documents.",
    motivation: "Build a production-grade Retrieval-Augmented Generation (RAG) system with hybrid search, re-ranking, and strict citation tracking to enable reliable, verifiable document synthesis.",
    dataset: "Evaluation benchmark of 500 research papers across arXiv and corporate disclosures with 1,200 human-verified ground truth Q&A pairs.",
    technologies: ["Python", "FastAPI", "RAG", "LLM", "Vector Database", "ChromaDB", "LangChain", "Sentence-Transformers"],
    methodology: "Employed recursive text splitting with overlapping chunk boundaries (512 tokens / 64 overlap), vectorized using BAAI/bge-large-en embeddings into ChromaDB. Query retrieval utilizes Reciprocal Rank Fusion (RRF) combining dense vector similarity with sparse BM25 keyword matching.",
    architecture: {
      overview: "Document Ingestion -> Recursive Chunking -> Embeddings Generation -> ChromaDB Vector Store -> Hybrid Retrieval -> Cross-Encoder Re-Ranker -> Context Injection -> LLM Synthesis with Citations.",
      diagramUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      pipelineSteps: [
        "PyMuPDF document text and table extraction",
        "Semantic chunking with contextual parent metadata preservation",
        "Dense vector index construction in ChromaDB",
        "Cross-Encoder Re-Ranking using ms-marco-MiniLM-L-6-v2",
        "Grounded generation with inline [Source X, Page Y] hyperlinked citations"
      ]
    },
    implementation: "Developed modular FastAPI microservice. Integrated ChromaDB as the high-speed local vector database. Utilized modern streaming endpoints to deliver cited answers in real-time with document viewer highlighting.",
    modelDetails: {
      name: "BGE-Large Embeddings + Gemini / Llama-3 + Cross-Encoder",
      type: "Dense Vector Search + Neural Re-ranking + LLM",
      framework: "LangChain / ChromaDB / PyTorch",
      parameters: "335M Embedding params + 8B LLM"
    },
    results: "Achieved 94.2% retrieval accuracy (Top-3 Recall) and reduced factual hallucination rates to less than 1.8% based on automated RAGAS evaluation metrics.",
    evaluationMetrics: [
      { label: "Faithfulness Score", value: "0.96", description: "RAGAS answer grounding metric" },
      { label: "Context Recall", value: "0.93", description: "Proportion of relevant chunks retrieved" },
      { label: "Mean Retrieval Latency", value: "110ms", description: "Vector search + re-ranking duration" },
      { label: "Hallucination Rate", value: "< 1.8%", description: "Verified factual consistency" }
    ],
    challenges: [
      {
        challenge: "Lost Context in Chunking: Splitting tables and bullet points across arbitrary token counts damaged semantic context.",
        solution: "Implemented semantic layout-aware chunking preserving Markdown tables as atomic context units with document-level summaries."
      },
      {
        challenge: "Retrieval Noise: Similar keywords in unrelated sections caused low-relevance chunks to dilute the LLM prompt.",
        solution: "Added a secondary Cross-Encoder re-ranker stage that re-orders candidate chunks prior to context injection."
      }
    ],
    keyLearnings: [
      "Mastery of Advanced RAG architectures: Parent-Document retrieval, Hypothetical Document Embeddings (HyDE), and Hybrid Dense-Sparse search.",
      "Comprehensive evaluation of RAG pipelines using RAGAS and TruLens frameworks.",
      "Vector indexing techniques, cosine vs. dot product distance metrics, and HNSW graphs."
    ],
    futureImprovements: [
      "Implement multi-modal RAG to directly parse embedded charts, graphs, and diagrams.",
      "Add collaborative shared research workspaces with role-based access control.",
      "Deploy vector storage cluster to Qdrant Cloud or Pinecone for horizontal scale."
    ],
    codeSnippet: {
      language: "python",
      title: "rag_retriever.py",
      code: `from chromadb import Client\nfrom sentence_transformers import CrossEncoder\n\nreranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')\n\ndef hybrid_query(query_text: str, top_k: int = 5):\n    # 1. Fetch dense candidates from ChromaDB\n    candidates = vector_collection.query(query_texts=[query_text], n_results=top_k * 3)\n    documents = candidates['documents'][0]\n    \n    # 2. Re-rank pairs using Cross-Encoder\n    pairs = [[query_text, doc] for doc in documents]\n    scores = reranker.predict(pairs)\n    \n    # 3. Sort by re-rank score\n    ranked = sorted(zip(documents, scores), key=lambda x: x[1], reverse=True)\n    return [doc for doc, score in ranked[:top_k]]`
    },
    thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80"
    ],
    githubUrl: "https://github.com/priyatamraj/doc-research-assistant",
    liveDemoUrl: "https://research-assistant.example.com",
    featured: true,
    published: true,
    order: 3,
    createdAt: "2025-02-10"
  },
  {
    id: "proj-4",
    slug: "house-price-prediction",
    title: "House Price Prediction System",
    tagline: "End-to-end regression pipeline for accurate residential real estate valuation",
    category: "Machine Learning",
    description: "Machine Learning application for predicting house prices from property-related features with interactive exploratory data analysis and feature importance visualizations.",
    problemStatement: "Property valuation is subject to volatile market conditions, non-linear feature interactions (location, square footage, amenities), and high skewness, making traditional rule-based appraisal inaccurate.",
    motivation: "Create a transparent, statistically rigorous machine learning pipeline that provides prospective buyers and real estate agents with reliable price estimates and clear feature impact explanations.",
    dataset: "Kaggle Ames Housing Dataset containing 79 explanatory variables describing 2,930 residential property sales in Ames, Iowa.",
    technologies: ["Python", "Pandas", "Scikit-learn", "Streamlit", "XGBoost", "LightGBM", "Matplotlib", "Seaborn"],
    methodology: "Conducted extensive Exploratory Data Analysis (EDA), log-transformation on target variables to correct right-skewness, target encoding for high-cardinality neighborhoods, iterative imputation for missing data, and hyperparameter tuning with Optuna.",
    architecture: {
      overview: "Raw Dataset -> Data Cleaning & Outlier Removal -> Feature Engineering & Transformation -> Stacking Ensemble (XGBoost + LightGBM + Ridge) -> Streamlit Interactive Web App.",
      diagramUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      pipelineSteps: [
        "Box-Cox power transformation on skewed continuous variables",
        "Interaction feature synthesis (TotalSF = GrLivArea + TotalBsmtSF)",
        "5-Fold Cross-Validation with Stratification",
        "Stacking Ensemble blending gradient boosted trees and regularized linear models",
        "Streamlit interactive sliders and SHAP value waterfall visualizer"
      ]
    },
    implementation: "Constructed pipeline using Scikit-learn Pipeline objects and ColumnTransformers to prevent data leakage. Built an intuitive Streamlit interface allowing users to adjust bedrooms, square footage, and neighborhood to see real-time price changes.",
    modelDetails: {
      name: "Stacked Ensemble (XGBoost + LightGBM + CatBoost)",
      type: "Supervised Regression",
      framework: "Scikit-learn / XGBoost",
      parameters: "K-Fold = 5, Learning Rate = 0.03, Max Depth = 6"
    },
    results: "Achieved an RMSE of 0.112 on log(SalePrice), placing in the top 6% of competitive machine learning benchmarks for the Ames dataset.",
    evaluationMetrics: [
      { label: "RMSE (Log Scale)", value: "0.112", description: "Root Mean Squared Error" },
      { label: "R² Score", value: "0.924", description: "Variance explained by model" },
      { label: "MAE", value: "$13,450", description: "Mean Absolute Error in dollar value" },
      { label: "Cross-Val Mean", value: "0.115", description: "5-fold cross validation consistency" }
    ],
    challenges: [
      {
        challenge: "Multicollinearity: Strong correlations between garage area, cars capacity, and basement metrics caused unstable coefficients.",
        solution: "Utilized Variance Inflation Factor (VIF) filtering and tree-based gradient boosters resilient to collinear predictors."
      },
      {
        challenge: "Extreme Outliers: Several expansive luxury properties severely biased standard loss functions.",
        solution: "Identified and pruned multivariate outliers using Cook's Distance and Huber loss objectives."
      }
    ],
    keyLearnings: [
      "Rigorous data preprocessing and leakage prevention using Scikit-Learn Pipelines.",
      "Feature engineering principles: interaction terms, polynomial expansions, and geographic binning.",
      "Model interpretability with SHAP (SHapley Additive exPlanations) for stakeholder trust."
    ],
    futureImprovements: [
      "Integrate geospatial OpenStreetMap distance features (distance to schools, parks, transit).",
      "Deploy model as a serverless REST API using AWS Lambda / Cloud Run.",
      "Add automated quarterly retraining triggers upon new sales data ingestion."
    ],
    codeSnippet: {
      language: "python",
      title: "train_pipeline.py",
      code: `from sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import OneHotEncoder, RobustScaler\nfrom xgboost import XGBRegressor\n\npreprocessor = ColumnTransformer(transformers=[\n    ('num', RobustScaler(), numerical_cols),\n    ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)\n])\n\nmodel_pipeline = Pipeline(steps=[\n    ('preprocessor', preprocessor),\n    ('regressor', XGBRegressor(n_estimators=1000, learning_rate=0.03, max_depth=5, random_state=42))\n])\n\nmodel_pipeline.fit(X_train, y_train_log)`
    },
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1200&q=80"
    ],
    githubUrl: "https://github.com/priyatamraj/house-price-prediction",
    liveDemoUrl: "https://house-prices-ml.streamlit.app",
    featured: false,
    published: true,
    order: 4,
    createdAt: "2024-09-10"
  },
  {
    id: "proj-5",
    slug: "disease-prediction-system",
    title: "Disease Prediction System",
    tagline: "Medical diagnosis decision-support system predicting conditions from clinical symptoms",
    category: "Machine Learning",
    description: "Machine Learning application that predicts possible diseases from user-provided symptoms, providing risk stratification, diagnostic confidence, and specialist recommendations.",
    problemStatement: "Patients in underserved areas often lack immediate access to triage assessments, leading to delayed medical intervention or unnecessary emergency room overcrowding.",
    motivation: "Develop a transparent, privacy-centric diagnostic triage tool that helps users understand possible health conditions based on reported symptoms and guides them toward appropriate medical specialists.",
    dataset: "Prognosis & Symptom medical dataset comprising 4,920 patient records mapping 132 individual symptoms across 41 distinct medical conditions and diseases.",
    technologies: ["Python", "Scikit-learn", "Flask", "Pandas", "Random Forest", "Support Vector Machines", "HTML5", "Bootstrap"],
    methodology: "Implemented binary indicator vectorization across 132 symptom features. Compared Random Forest, Support Vector Classifiers (SVC), and Naive Bayes classifiers with 10-Fold Cross-Validation to assess multiclass calibration.",
    architecture: {
      overview: "Symptom Selection Input -> Vectorizer Encoding -> Multiclass Ensemble Classifier -> Probability Calibration -> Specialist Recommendation Engine -> Flask Response.",
      diagramUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      pipelineSteps: [
        "Dynamic multi-select symptom interface with fuzzy search",
        "Symptom co-occurrence matrix validation",
        "Calibrated Random Forest probability distribution computation",
        "Disease severity ranking and doctor specialization mapping",
        "Exportable medical summary generation"
      ]
    },
    implementation: "Built using Flask REST API and Scikit-learn Random Forest model. Serialized model artifacts with Joblib. Includes disclaimer guardrails and specialist matching dictionary.",
    modelDetails: {
      name: "Random Forest Medical Classifier + SVC",
      type: "Multiclass Supervised Classification",
      framework: "Scikit-learn",
      parameters: "Trees = 200, Criterion = 'entropy', Max Depth = 15"
    },
    results: "Achieved 97.6% accuracy on cross-validation test split across all 41 disease classes with high precision on acute conditions.",
    evaluationMetrics: [
      { label: "Accuracy", value: "97.6%", description: "Overall classification accuracy" },
      { label: "F1-Score (Macro)", value: "0.972", description: "Balanced metric across all 41 classes" },
      { label: "Top-3 Accuracy", value: "99.4%", description: "True condition present in top 3 predictions" },
      { label: "Inference Time", value: "< 5ms", description: "Near-instantaneous prediction" }
    ],
    challenges: [
      {
        challenge: "Symptom Ambiguity: Common non-specific symptoms (fever, fatigue, headache) mapped to over 25 overlapping diseases.",
        solution: "Implemented calibrated output probabilities showing top 3 most likely diagnoses alongside clarifying differential symptom questions."
      },
      {
        challenge: "Spelling & Terminology Discrepancies: Users input colloquial terms rather than formal clinical symptom names.",
        solution: "Engineered a fuzzy matching synonym dictionary mapping colloquial phrases to canonical feature tokens."
      }
    ],
    keyLearnings: [
      "Probability calibration methods (Platt Scaling, Isotonic Regression) for medical decision support.",
      "Handling high-dimensional sparse binary feature matrices efficiently.",
      "Designing ethical AI guardrails, medical disclaimers, and UX safety protocols."
    ],
    futureImprovements: [
      "Integrate biomedical LLM (BioBERT / Med-PaLM) for conversational symptom dialogue.",
      "Add localization support for regional languages across India.",
      "Incorporate temporal symptom progression (duration, intensity change over time)."
    ],
    codeSnippet: {
      language: "python",
      title: "disease_predictor.py",
      code: `import numpy as np\nfrom sklearn.ensemble import RandomForestClassifier\n\nclass MedicalPredictor:\n    def __init__(self, model_path: str, symptom_list: list, disease_map: dict):\n        self.model = joblib.load(model_path)\n        self.symptom_list = symptom_list\n        self.disease_map = disease_map\n\n    def predict_condition(self, selected_symptoms: list):\n        input_vector = np.zeros(len(self.symptom_list))\n        for s in selected_symptoms:\n            if s in self.symptom_list:\n                input_vector[self.symptom_list.index(s)] = 1\n                \n        probs = self.model.predict_proba([input_vector])[0]\n        top_indices = np.argsort(probs)[::-1][:3]\n        return [{\n            'disease': self.disease_map[i],\n            'confidence': round(probs[i] * 100, 2)\n        } for i in top_indices if probs[i] > 0.05]`
    },
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80"
    ],
    githubUrl: "https://github.com/priyatamraj/disease-prediction-system",
    liveDemoUrl: "https://disease-predictor-demo.example.com",
    featured: false,
    published: true,
    order: 5,
    createdAt: "2024-07-28"
  }
];
