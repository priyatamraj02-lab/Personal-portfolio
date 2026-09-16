import { Skill } from '../types/skill';

export const initialSkills: Skill[] = [
  // Programming
  { id: 'sk-1', name: 'Python', category: 'Programming', level: 'Advanced', icon: 'Code', order: 1, enabled: true, featured: true, description: 'Core language for ML, Data Science & AI engineering' },
  { id: 'sk-2', name: 'SQL', category: 'Programming', level: 'Intermediate', icon: 'Database', order: 2, enabled: true, featured: true, description: 'Relational database querying, joins, aggregation, optimization' },
  { id: 'sk-3', name: 'C / C++', category: 'Programming', level: 'Intermediate', icon: 'Terminal', order: 3, enabled: true, featured: false, description: 'Data structures, algorithms, memory management' },

  // Data Science
  { id: 'sk-4', name: 'NumPy', category: 'Data Science', level: 'Advanced', icon: 'Binary', order: 4, enabled: true, featured: true, description: 'Multidimensional array operations, linear algebra, vectorization' },
  { id: 'sk-5', name: 'Pandas', category: 'Data Science', level: 'Advanced', icon: 'Table', order: 5, enabled: true, featured: true, description: 'Dataframe manipulation, time series, grouping, aggregation' },
  { id: 'sk-6', name: 'Matplotlib & Seaborn', category: 'Data Science', level: 'Advanced', icon: 'BarChart3', order: 6, enabled: true, featured: true, description: 'Statistical visualizations, heatmaps, interactive charts' },
  { id: 'sk-7', name: 'Data Cleaning', category: 'Data Science', level: 'Advanced', icon: 'Sparkles', order: 7, enabled: true, featured: false, description: 'Missing value imputation, outlier detection, data standardization' },
  { id: 'sk-8', name: 'EDA (Exploratory Data Analysis)', category: 'Data Science', level: 'Advanced', icon: 'Search', order: 8, enabled: true, featured: true, description: 'Hypothesis generation, correlation analysis, distribution profiling' },
  { id: 'sk-9', name: 'Feature Engineering', category: 'Data Science', level: 'Advanced', icon: 'Layers', order: 9, enabled: true, featured: true, description: 'Feature scaling, one-hot/target encoding, interaction variables' },

  // Machine Learning
  { id: 'sk-10', name: 'Linear & Logistic Regression', category: 'Machine Learning', level: 'Advanced', icon: 'TrendingUp', order: 10, enabled: true, featured: false, description: 'Predictive modeling, odds estimation, regularization (Lasso/Ridge)' },
  { id: 'sk-11', name: 'Decision Trees', category: 'Machine Learning', level: 'Advanced', icon: 'GitFork', order: 11, enabled: true, featured: false, description: 'Information gain, Gini impurity, tree pruning' },
  { id: 'sk-12', name: 'Random Forest & Ensembles', category: 'Machine Learning', level: 'Advanced', icon: 'Boxes', order: 12, enabled: true, featured: true, description: 'Bagging, boosting (XGBoost, LightGBM), feature importance' },
  { id: 'sk-13', name: 'Support Vector Machines (SVM)', category: 'Machine Learning', level: 'Intermediate', icon: 'Compass', order: 13, enabled: true, featured: false, description: 'Kernel trick, hyperplanes, margin maximization' },
  { id: 'sk-14', name: 'Model Evaluation & Validation', category: 'Machine Learning', level: 'Advanced', icon: 'CheckCircle2', order: 14, enabled: true, featured: true, description: 'K-fold CV, ROC-AUC, Precision-Recall, Confusion matrices' },

  // Deep Learning
  { id: 'sk-15', name: 'Neural Networks (ANN)', category: 'Deep Learning', level: 'Intermediate', icon: 'Network', order: 15, enabled: true, featured: true, description: 'Backpropagation, loss functions, activation functions, optimizers' },
  { id: 'sk-16', name: 'CNN (Convolutional Neural Networks)', category: 'Deep Learning', level: 'Intermediate', icon: 'ScanFace', order: 16, enabled: true, featured: true, description: 'Spatial convolutions, pooling, image feature extraction' },
  { id: 'sk-17', name: 'Transfer Learning', category: 'Deep Learning', level: 'Advanced', icon: 'RefreshCw', order: 17, enabled: true, featured: true, description: 'Fine-tuning pre-trained backbones (ResNet, MobileNet, VGG)' },
  { id: 'sk-18', name: 'YOLO (Computer Vision)', category: 'Deep Learning', level: 'Advanced', icon: 'Eye', order: 18, enabled: true, featured: true, description: 'Real-time object detection, bounding box regression, tracking' },

  // Generative AI
  { id: 'sk-19', name: 'Large Language Models (LLMs)', category: 'Generative AI', level: 'Advanced', icon: 'Cpu', order: 19, enabled: true, featured: true, description: 'Transformer architectures, tokenization, fine-tuning, embeddings' },
  { id: 'sk-20', name: 'Prompt Engineering', category: 'Generative AI', level: 'Advanced', icon: 'Wand2', order: 20, enabled: true, featured: true, description: 'Few-shot, Chain-of-Thought, ReAct framing, system instructions' },
  { id: 'sk-21', name: 'RAG (Retrieval-Augmented Gen)', category: 'Generative AI', level: 'Advanced', icon: 'BookOpen', order: 21, enabled: true, featured: true, description: 'Vector stores, hybrid retrieval, chunking strategies, re-ranking' },
  { id: 'sk-22', name: 'Gemini API & OpenAI SDK', category: 'Generative AI', level: 'Advanced', icon: 'Bot', order: 22, enabled: true, featured: true, description: 'Multimodal prompts, structured JSON outputs, streaming responses' },
  { id: 'sk-23', name: 'AI Applications & Agents', category: 'Generative AI', level: 'Advanced', icon: 'Workflow', order: 23, enabled: true, featured: true, description: 'End-to-end autonomous workflows, tool calling, memory management' },

  // Tools & Frameworks
  { id: 'sk-24', name: 'Git & GitHub', category: 'Tools', level: 'Advanced', icon: 'GitBranch', order: 24, enabled: true, featured: true, description: 'Version control, branching, PRs, collaborative workflows' },
  { id: 'sk-25', name: 'VS Code', category: 'Tools', level: 'Advanced', icon: 'Code2', order: 25, enabled: true, featured: false, description: 'Debugging, extension ecosystem, virtual environments' },
  { id: 'sk-26', name: 'Streamlit', category: 'Tools', level: 'Advanced', icon: 'MonitorPlay', order: 26, enabled: true, featured: true, description: 'Rapid ML prototyping, dashboards, interactive data apps' },
  { id: 'sk-27', name: 'Flask', category: 'Tools', level: 'Advanced', icon: 'Server', order: 27, enabled: true, featured: true, description: 'Micro-web framework for ML model APIs and streaming' },
  { id: 'sk-28', name: 'FastAPI', category: 'Tools', level: 'Advanced', icon: 'Zap', order: 28, enabled: true, featured: true, description: 'High-performance async REST APIs, Swagger docs, Pydantic' },
  { id: 'sk-29', name: 'Firebase', category: 'Tools', level: 'Intermediate', icon: 'Flame', order: 29, enabled: true, featured: true, description: 'Authentication, Firestore NoSQL, Cloud Storage, Security Rules' }
];
