import React, { useState, useEffect } from 'react';
import { 
  FileDown, 
  Printer, 
  ExternalLink, 
  User, 
  BrainCircuit, 
  GraduationCap, 
  Award, 
  FolderGit2, 
  Mail, 
  MapPin, 
  Sparkles
} from 'lucide-react';
import { Github, Linkedin } from '../../components/ui/BrandIcons';
import { apiService } from '../../services/apiService';
import { Profile } from '../../types/profile';
import { Project } from '../../types/project';
import { Skill } from '../../types/skill';
import { Education } from '../../types/education';
import { Experience } from '../../types/experience';
import { initialProfile } from '../../data/initialProfile';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';

export const ResumePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, proj, sk, edu, exp] = await Promise.all([
          apiService.getProfile(),
          apiService.getProjects(true),
          apiService.getSkills(true),
          apiService.getEducation(),
          apiService.getExperience()
        ]);
        setProfile(prof);
        setProjects(proj);
        setSkills(sk);
        setEducation(edu);
        setExperience(exp);
      } catch (err) {
        console.error('Error fetching resume data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Controls Bar (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <Badge variant="primary" size="md">
            <FileDown className="w-3.5 h-3.5" />
            Curriculum Vitae
          </Badge>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-foreground mt-1">
            Official Resume
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Interactive digital format & printable document.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
            Print / Save PDF
          </Button>
          <a
            href={profile.resumeUrl || '/sample-resume.pdf'}
            download={`${profile.name.replace(/\s+/g, '_')}_Resume.pdf`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="primary" size="sm" icon={<FileDown className="w-4 h-4" />}>
              Download PDF
            </Button>
          </a>
        </div>
      </div>

      {/* Printable Sheet View */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border/80 p-8 sm:p-12 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none">
        
        {/* Resume Header */}
        <div className="border-b border-border pb-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-3xl font-black text-foreground tracking-tight">
                {profile.name}
              </h2>
              <p className="text-base font-semibold text-primary mt-0.5">
                {profile.headline}
              </p>
            </div>
            <div className="flex flex-col sm:items-end text-xs text-muted-foreground font-mono space-y-1">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> {profile.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground font-mono">
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline flex items-center gap-1">
              <Github className="w-3.5 h-3.5" /> github.com/priyatamraj
            </a>
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5" /> linkedin.com/in/priyatamraj
            </a>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-2">
          <h3 className="font-display text-xs font-black uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            Executive Summary
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Technical Skills Matrix */}
        <div className="space-y-3">
          <h3 className="font-display text-xs font-black uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            Technical Competencies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="font-bold text-foreground block">Languages & Programming:</span>
              <span className="text-muted-foreground">Python (Advanced), SQL, C/C++</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Machine Learning:</span>
              <span className="text-muted-foreground">Scikit-learn, XGBoost, LightGBM, Regression, Trees, SVM</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Deep Learning & Vision:</span>
              <span className="text-muted-foreground">PyTorch, YOLOv8, OpenCV, CNNs, Transfer Learning</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Generative AI & LLMs:</span>
              <span className="text-muted-foreground">RAG, Gemini API, ChromaDB, LangChain, Prompt Engineering</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Data Analysis & EDA:</span>
              <span className="text-muted-foreground">Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Tools & Frameworks:</span>
              <span className="text-muted-foreground">FastAPI, Flask, Streamlit, Git, GitHub, VS Code, Firebase</span>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h3 className="font-display text-xs font-black uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            Education
          </h3>
          {education.map((edu) => (
            <div key={edu.id} className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                <span className="font-bold text-foreground text-sm">{edu.degree}</span>
                <span className="font-mono text-muted-foreground">{edu.startYear} – {edu.endYear}</span>
              </div>
              <p className="text-xs font-semibold text-primary">{edu.institution} | {edu.location}</p>
              <p className="text-xs text-muted-foreground mt-1">{edu.description}</p>
              <p className="text-xs text-muted-foreground pt-1">
                <span className="font-semibold text-foreground">Relevant Coursework: </span>
                {edu.relevantCoursework.join(', ')}
              </p>
            </div>
          ))}
        </div>

        {/* Key Featured Projects */}
        <div className="space-y-4">
          <h3 className="font-display text-xs font-black uppercase tracking-wider text-primary border-b border-border/60 pb-1">
            Selected Technical Projects
          </h3>
          <div className="space-y-4">
            {projects.slice(0, 4).map((proj) => (
              <div key={proj.id || proj.slug} className="space-y-1 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{proj.title}</span>
                  <span className="font-mono text-primary">{proj.category}</span>
                </div>
                <p className="text-muted-foreground">{proj.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="font-semibold text-foreground">Tech Stack: </span>
                  <span className="text-muted-foreground">{proj.technologies.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience & Leadership */}
        {experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              Experience & Leadership
            </h3>
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <span className="font-bold text-foreground text-sm">{exp.role}</span>
                  <span className="font-mono text-muted-foreground">{exp.startDate} – {exp.endDate}</span>
                </div>
                <p className="font-semibold text-primary">{exp.organization} | {exp.location}</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-0.5 pt-0.5">
                  {exp.description.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
