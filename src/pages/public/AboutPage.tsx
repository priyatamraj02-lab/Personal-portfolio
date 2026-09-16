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
import { initialProfile } from '../../data/initialProfile';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatsOverview } from '../../components/portfolio/StatsOverview';

export const AboutPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error loading about data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Top Header */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <User className="w-3.5 h-3.5" />
          Background & Philosophy
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          About Priyatam Raj
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Undergraduate researcher, Machine Learning practitioner, and AI engineer passionate about translating raw mathematical formulations into high-impact software systems.
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
              {profile.aboutText?.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                {profile.location}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                {profile.email}
              </div>
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
            <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden border-2 border-primary/40 shadow-xl">
              <img
                src={profile.profileImage}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">{profile.name}</h3>
              <p className="text-xs text-primary font-semibold mt-0.5">{profile.headline}</p>
              <p className="text-xs text-muted-foreground mt-2 font-mono">
                Centurion University (2024–2028)
              </p>
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
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Current Focus
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.currentFocus}
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Learning Frontier
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.learningFocus}
              </p>
            </div>

            <div className="pt-3 border-t border-border space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Career Goal
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {profile.careerGoals}
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Dynamic Statistics Bar */}
      <section className="pt-6">
        <StatsOverview
          stats={
            profile.stats || {
              projectsCompleted: 5,
              skillsMastered: 29,
              certificationsEarned: 4,
              githubRepositories: 12
            }
          }
        />
      </section>
    </div>
  );
};
