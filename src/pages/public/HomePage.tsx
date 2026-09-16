import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  BrainCircuit, 
  FolderGit2, 
  Layers, 
  Mail, 
  Check, 
  Copy,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Profile } from '../../types/profile';
import { Project } from '../../types/project';
import { Skill, SkillCategory } from '../../types/skill';
import { initialProfile } from '../../data/initialProfile';
import { HeroSection } from '../../components/portfolio/HeroSection';
import { StatsOverview } from '../../components/portfolio/StatsOverview';
import { ProjectCard } from '../../components/portfolio/ProjectCard';
import { SkillCategoryCard } from '../../components/portfolio/SkillCategoryCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, projData, skillData] = await Promise.all([
          apiService.getProfile(),
          apiService.getProjects(true),
          apiService.getSkills(true)
        ]);
        setProfile(profData);
        setProjects(projData);
        setSkills(skillData);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    success('Email copied to clipboard!', profile.email);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const featuredProjects = projects.filter(p => p.featured).slice(0, 3);
  if (featuredProjects.length === 0 && projects.length > 0) {
    featuredProjects.push(...projects.slice(0, 3));
  }

  const skillCategories: SkillCategory[] = [
    'Generative AI',
    'Deep Learning',
    'Machine Learning',
    'Data Science'
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <HeroSection profile={profile} />

      {/* 2. Dynamic Live Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsOverview
          stats={
            profile.stats || {
              projectsCompleted: projects.length || 5,
              skillsMastered: skills.length || 29,
              certificationsEarned: 4,
              githubRepositories: 12
            }
          }
        />
      </section>

      {/* 3. Featured Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold font-mono tracking-widest uppercase">
              <FolderGit2 className="w-3.5 h-3.5" />
              Featured Work
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Selected AI & Machine Learning Projects
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              End-to-end architectures spanning real-time computer vision, Retrieval-Augmented Generation (RAG), and predictive analytics.
            </p>
          </div>

          <Link to="/projects">
            <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Explore All {projects.length} Projects
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Core Skills & Tech Ecosystem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Core Competencies
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Technical Skill Ecosystem
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
              From foundational mathematics and algorithms to cutting-edge LLM prompt engineering and computer vision pipelines.
            </p>
          </div>

          <Link to="/skills">
            <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              View Full Skills Catalog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCategories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;
            return (
              <SkillCategoryCard
                key={cat}
                category={cat}
                skills={catSkills.slice(0, 6)}
              />
            );
          })}
        </div>
      </section>

      {/* 5. Education & Philosophy Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card glass className="p-8 sm:p-10 border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <Badge variant="ai" size="md">
                <BrainCircuit className="w-3.5 h-3.5 text-primary" />
                Undergraduate Journey (2024–2028)
              </Badge>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Centurion University of Technology and Management
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Pursuing B.Tech in Computer Science & Engineering with a focused specialization in Data Science and Artificial Intelligence. Bridging mathematical rigor with hands-on systems programming and cloud-native model deployment.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/education">
                  <Button variant="primary" size="sm">
                    View Coursework & Milestones
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="sm">
                    Read My Story
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-5 rounded-2xl bg-card/80 border border-border/80 space-y-3 shadow-lg">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                Quick Highlights
              </span>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>1st Place Smart Odisha Hackathon 2024</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Kaggle 3x Notebooks Medalist</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>DeepLearning.AI Machine Learning Certified</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </section>

      {/* 6. Call to Action / Get in Touch */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-gradient-to-tr from-primary/10 via-card to-cyan-500/10 p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold font-mono tracking-widest text-primary uppercase">
              Let's Collaborate
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
              Interested in Building Something Intelligent Together?
            </h2>
            <p className="text-sm text-muted-foreground">
              I am currently open to Data Science, Machine Learning, Deep Learning, and AI Engineering internships, full-time roles, and research opportunities.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/contact">
              <Button size="lg" variant="primary" icon={<Mail className="w-4 h-4" />}>
                Get in Touch
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={handleCopyEmail}
              icon={copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            >
              {copiedEmail ? 'Email Copied!' : 'Copy Email Address'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
