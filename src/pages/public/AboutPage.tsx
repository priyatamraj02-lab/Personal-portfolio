import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  BrainCircuit, 
  GraduationCap, 
  Compass, 
  Sparkles, 
  Terminal, 
  Code2, 
  Target, 
  BookOpen,
  MapPin,
  Mail,
  FileDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { Profile } from '../../types/profile';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatsOverview } from '../../components/portfolio/StatsOverview';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectCount, setProjectCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [repoCount, setRepoCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profData, projs, sks, certs, repos] = await Promise.all([
          apiService.getProfile(),
          apiService.getProjects(true),
          apiService.getSkills(true),
          apiService.getCertifications(),
          apiService.getGithubRepos()
        ]);
        setProfile(profData);
        setProjectCount(projs.length);
        setSkillCount(sks.length);
        setCertCount(certs.length);
        setRepoCount(repos.length);
      } catch (err) {
        console.error('Error loading about data from Firestore', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-8 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <Card glass className="p-12 max-w-md mx-auto space-y-4">
          <User className="w-12 h-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Profile Unavailable</h2>
          <p className="text-xs text-muted-foreground">
            No profile information found in Firestore. Please configure your profile from the Admin Panel.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Top Header */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <User className="w-3.5 h-3.5" />
          Background & Philosophy
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          About {profile.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          {profile.headline} — passionate about translating raw mathematical formulations into high-impact software systems.
        </p>
      </div>

      {/* Main Grid: Story & Bio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Biography & Pillars */}
        <div className="lg:col-span-8 space-y-8">
          <Card glass className="p-8 space-y-6">
            <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-2.5">
              <BrainCircuit className="w-6 h-6 text-primary" />
              Introduction & My Journey
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              {profile.aboutText && profile.aboutText.length > 0 ? (
                profile.aboutText.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>

            <div className="pt-4 border-t border-border flex flex-wrap gap-4 items-center">
              {profile.location && (
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  {profile.location}
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  {profile.email}
                </div>
              )}
            </div>
          </Card>

          {/* Core Areas of Interest */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              Primary Areas of Interest
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card glass hoverEffect className="p-5 space-y-2 border-border/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <h3 className="font-bold text-sm text-foreground">Computer Vision & YOLO</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Real-time object detection, multi-camera tracking, spatial temporal activity recognition, and edge hardware deployment.
                </p>
              </Card>

              <Card glass hoverEffect className="p-5 space-y-2 border-border/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <h3 className="font-bold text-sm text-foreground">Generative AI & RAG</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Retrieval-Augmented Generation architectures, vector databases, neural re-ranking, and structured LLM tool synthesis.
                </p>
              </Card>

              <Card glass hoverEffect className="p-5 space-y-2 border-border/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <h3 className="font-bold text-sm text-foreground">Predictive Machine Learning</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Gradient boosting ensembles, feature engineering pipelines, cross-validation, and calibrated risk estimation.
                </p>
              </Card>

              <Card glass hoverEffect className="p-5 space-y-2 border-border/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="font-bold text-sm text-foreground">Data Engineering & Analytics</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Exploratory data analysis, outlier mitigation, high-performance Pandas/NumPy vectorization, and data visualizers.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Right Column: Focus & Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Card */}
          <Card glass className="p-6 text-center space-y-5">
            <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-primary/40 shadow-xl bg-muted">
              <img
                src="/assets/profile.jpg"
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">{profile.name}</h3>
              <p className="text-xs text-primary font-semibold mt-0.5">{profile.headline}</p>
              {profile.yearsOfExperience && (
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  {profile.yearsOfExperience}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-border flex justify-center gap-3">
              <Link to="/resume" className="w-full">
                <Button size="sm" variant="primary" className="w-full" icon={<FileDown className="w-4 h-4" />}>
                  View Full Resume
                </Button>
              </Link>
            </div>
          </Card>

          {/* Current Learning & Career Goals */}
          <Card glass className="p-6 space-y-4">
            {profile.currentFocus && (
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Current Focus
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {profile.currentFocus}
                </p>
              </div>
            )}

            {profile.learningFocus && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Learning Frontier
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {profile.learningFocus}
                </p>
              </div>
            )}

            {profile.careerGoals && (
              <div className="pt-3 border-t border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Career Goal
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {profile.careerGoals}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Dynamic Statistics Bar */}
      <section className="pt-6">
        <StatsOverview
          stats={
            profile.stats || {
              projectsCompleted: projectCount,
              skillsMastered: skillCount,
              certificationsEarned: certCount,
              githubRepositories: repoCount
            }
          }
        />
      </section>
    </div>
  );
};
