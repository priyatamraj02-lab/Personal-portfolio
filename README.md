# Priyatam Raj - Data Science & AI Portfolio Website & CMS

A production-style, fully functional, and customizable personal portfolio website with a built-in protected **Admin CMS Portal** tailored for **Priyatam Raj** (Data Science / Machine Learning / Deep Learning / Generative AI student at Centurion University of Technology and Management, 2024–2028).

---

## 🌟 Key Highlights & Features

### 🌐 Public Experience
- **Futuristic AI/Tech Design**: Dark / Light / System theme support, neural network canvas background animation, custom glowing borders, glassmorphism, smooth typography (Inter, Outfit, JetBrains Mono).
- **Sticky Glass Navbar**: Scroll-aware transparency, active page indicators, social links (GitHub, LinkedIn), theme switcher, and direct Resume CTA.
- **Dynamic Stats Bar**: Real-time counters for projects completed, skills mastered, certifications earned, and GitHub repositories.
- **Projects Showcase & In-Depth Case Studies**:
  - Filter by category (*All*, *Machine Learning*, *Deep Learning*, *Generative AI*, *Data Science*, *AI Applications*) and instant text search.
  - Dedicated `/projects/:slug` case study pages detailing: Problem Statement, Motivation, Dataset, Methodology, Architecture & Pipeline Steps, Model Specs, Empirical Benchmark Metrics, Challenges & Solutions, Interactive Code Snippets, and Fullscreen Screenshot Lightbox.
  - Pre-seeded with 5 comprehensive case studies:
    1. *Classroom Activity Monitoring System* (Deep Learning / YOLOv8 / OpenCV / Flask)
    2. *GenAI Content Co-Pilot* (Generative AI / FastAPI / Gemini API / ML)
    3. *Intelligent Document Research Assistant* (Generative AI / RAG / Vector DB / LLM)
    4. *House Price Prediction System* (Machine Learning / Scikit-learn / Streamlit)
    5. *Disease Prediction System* (Machine Learning / Scikit-learn / Flask)
- **Skills Catalog**: 29 technical skills across 6 distinct categories with proficiency tiers (no fake percentages) and Lucide icon badges.
- **Education & Experience Timelines**: Centurion University B.Tech CSE (2024-2028), coursework tags, research leadership, and open-source contributions.
- **Interactive Resume Viewer**: Embedded digital resume with print optimizations and direct PDF download.
- **Contact Form**: Form validation, honeypot spam protection, submission confetti animation, and direct Firestore message persistence.

### 🛡️ Protected Admin CMS Portal (`/admin/*`)
- **Route Protection**: Protected with Firebase Authentication & session guard.
- **Dual Mode Database**: Works out-of-the-box in **Local Sandbox Mode** if Firebase is not yet configured, and connects seamlessly to **Firebase Firestore & Storage** once `.env` credentials are provided.
- **One-Click Cloud Seeder**: In `/admin/settings` or Dashboard, push the entire portfolio dataset (Profile, 5 Case Studies, 29 Skills, Education, Certifications, Achievements) into a clean Firestore database with a single click!
- **Full CRUD Management**:
  - **Profile Details**: Name, Headline, Bio, About story, Photo upload, Coordinates, Socials.
  - **Projects**: Rich form with problem/solution, architecture, code snippets, metrics, and image uploads.
  - **Skills & Tech**: Category assignment, proficiency tier, icon name, and enable/disable toggle.
  - **Experience & Education**: Coursework tags, dates, and organization credentials.
  - **Certifications & Achievements**: Credential IDs, proof URLs, and badge images.
  - **GitHub Repos**: Manual repository manager + public GitHub API sync button.
  - **Resume File**: Upload new PDF directly to Firebase Storage or customize the download URL.
  - **Contact Messages**: Inbox with unread indicators, text search, and deletion.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite (TypeScript) |
| **Styling** | Tailwind CSS + CSS Variables Design System |
| **Icons** | Lucide React + Custom SVG Brand Icons |
| **Animations** | Framer Motion + HTML5 Canvas Particle Mesh |
| **Backend & Cloud** | Firebase (Auth, Firestore, Cloud Storage) |
| **Interactive UX** | Canvas Confetti, Lightbox Modal, Custom Toasts |

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg               # Futuristic PR monogram favicon
│   ├── robots.txt                # Search engine crawler config
│   ├── sitemap.xml               # Complete XML sitemap
│   └── sample-resume.pdf         # Default resume file
├── src/
│   ├── types/                    # TypeScript interfaces for all data entities
│   ├── data/                     # Initial seed datasets (Profile, Projects, Skills, Edu, etc.)
│   ├── firebase/                 # Firebase SDK initialization & fallback detection
│   ├── services/                 # Unified data layer (Firestore CRUD + Local Sandbox + Seeder)
│   ├── context/                  # ThemeContext, AuthContext, ToastContext
│   ├── hooks/                    # useTheme, useAuth, useToast, useScrollProgress
│   ├── components/
│   │   ├── ui/                   # Reusable UI tokens (Button, Card, Badge, Modal, Lightbox, etc.)
│   │   ├── layout/               # Navbar, Footer, PublicLayout, AdminLayout, ProtectedRoute
│   │   ├── portfolio/            # HeroSection, ProjectCard, SkillCategoryCard, ContactForm, etc.
│   │   └── admin/                # AdminSidebar, AdminHeader, ImageUpload, etc.
│   ├── pages/
│   │   ├── public/               # Home, About, Skills, Projects, ProjectDetail, Resume, Contact, etc.
│   │   └── admin/                # Dashboard, Profile, Projects, Skills, Resume, Messages, Settings
│   ├── App.tsx                   # Central router configuration
│   └── main.tsx                  # Application entry point
├── firestore.rules               # Production Firestore security rules
├── storage.rules                 # Production Firebase Storage security rules
├── firebase.json                 # Firebase deployment configuration
├── tailwind.config.js            # Tailwind theme tokens & color variables
├── vite.config.ts                # Vite config with manual chunk splitting
└── .env.example                  # Environment variable template
```

---

## 🚀 Quick Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!NOTE]
> **No Firebase setup is required to run and test immediately!**
> The application will run in **Local Sandbox Mode** with the complete dataset preloaded.
> To log into the Admin panel in Sandbox Mode:
> - **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
> - **Email**: `admin@priyatamraj.dev`
> - **Password**: `admin123` (or click "Fill Demo Credentials")

---

## 🔥 Step-by-Step Firebase Setup Guide

When you are ready to connect the website to your live Firebase Cloud project:

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
2. Name your project (e.g., `priyatam-raj-portfolio`) and complete setup.

### Step 2: Enable Firebase Authentication
1. In the Firebase sidebar, navigate to **Build** -> **Authentication**.
2. Click **Get Started**, then select **Email/Password** from the Sign-in methods.
3. Enable **Email/Password** and click **Save**.
4. Go to the **Users** tab and click **Add User** to create your admin account (e.g., `admin@priyatamraj.dev` with a strong password).

### Step 3: Create Firestore Database
1. Navigate to **Build** -> **Firestore Database** and click **Create Database**.
2. Choose a nearby region (e.g., `asia-south1` or `us-central1`).
3. Select **Start in production mode** and click **Create**.

### Step 4: Create Cloud Storage Bucket
1. Navigate to **Build** -> **Storage** and click **Get Started**.
2. Select **Start in production mode** and create the default bucket.

### Step 5: Configure Environment Variables
1. In Firebase Console, go to **Project Settings** (gear icon) -> **General**.
2. Scroll to **Your apps**, click the **Web (`</>`)** icon, and register your app.
3. Copy the `firebaseConfig` keys into a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=priyatam-raj-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=priyatam-raj-portfolio
VITE_FIREBASE_STORAGE_BUCKET=priyatam-raj-portfolio.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
```

### Step 6: Apply Security Rules
Deploy or paste the provided security rules files directly in your Firebase Console:
- **Firestore Rules**: Copy content from `firestore.rules` into Firestore **Rules** tab.
- **Storage Rules**: Copy content from `storage.rules` into Storage **Rules** tab.

### Step 7: Seed Initial Data with 1 Click!
1. Restart your dev server (`npm run dev`).
2. Log in to `/admin/login` using your Firebase admin email and password.
3. Go to **Dashboard** or **System Settings** and click **"Seed Initial Dataset"**.
4. All initial projects, skills, education, and profile data will be instantly created in Firestore!

---

## 📦 Production Build

To test and create the production-optimized build:

```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🚢 Deployment Notes (For Your Deployment)

You can deploy the resulting `dist/` bundle to any modern host:
- **Firebase Hosting**: Run `firebase init hosting` followed by `firebase deploy`.
- **Vercel**: Push your repository to GitHub, import it in Vercel, and add your `.env` variables under Project Settings.
- **Netlify**: Connect your GitHub repository, set build command to `npm run build`, publish directory to `dist`, and configure redirects for SPA.
