import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  FileDown, 
  Sparkles, 
  BrainCircuit, 
  Terminal, 
  Database,
  Cpu
} from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';
import { Profile } from '../../types/profile';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';

interface HeroSectionProps {
  profile: Profile | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  if (!profile) {
    return (
      <section className="relative min-h-[85vh] flex items-center justify-center pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-8 w-44 rounded-full" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-12 w-36 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <Skeleton className="w-80 h-96 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const username = profile.name ? profile.name.toLowerCase().replace(/\s+/g, '') : 'priyatam';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Status Pill */}
            {profile.availability && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 -ml-4" />
                <span className="text-xs font-semibold text-primary dark:text-indigo-300">
                  {profile.availability}
                </span>
              </div>
            )}

            {/* Main Headings */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-5xl xl:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                Hi, I'm{' '}
                <span className="gradient-text-ai">
                  {profile.name}
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground/80 tracking-tight flex items-center justify-center lg:justify-start gap-2">
                <BrainCircuit className="w-5 h-5 text-primary shrink-0" />
                {profile.headline}
              </h2>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {profile.bio}
            </p>

            {/* Key Skill Highlights Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <Badge variant="ai" size="md">
                <Cpu className="w-3 h-3 text-primary" />
                Deep Learning & YOLO
              </Badge>
              <Badge variant="cyan" size="md">
                <Sparkles className="w-3 h-3 text-cyan-500" />
                Generative AI & RAG
              </Badge>
              <Badge variant="primary" size="md">
                <Terminal className="w-3 h-3 text-indigo-500" />
                Machine Learning Pipelines
              </Badge>
              <Badge variant="secondary" size="md">
                <Database className="w-3 h-3 text-muted-foreground" />
                Data Science & Analytics
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/projects">
                <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                  View My Projects
                </Button>
              </Link>
              <Link to="/resume">
                <Button size="lg" variant="outline" icon={<FileDown className="w-4 h-4" />}>
                  Download Resume
                </Button>
              </Link>
            </div>

            {/* Social Links & Trust */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-muted-foreground">
              <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground/80">Connect:</span>
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border bg-card/60 hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-sm"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-border bg-card/60 hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 transition-all shadow-sm"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Hero Visual / Profile Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Outer decorative gradient frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary via-purple-600 to-cyan-400 rounded-3xl blur-md opacity-40 group-hover:opacity-100 transition duration-1000 animate-pulse-subtle" />
              
              <div className="relative rounded-3xl border border-border bg-card/90 backdrop-blur-xl p-5 shadow-2xl space-y-4">
                {/* Profile Image */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-muted border border-border/80">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <BrainCircuit className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
                    <span className="text-xs font-mono font-bold tracking-widest text-cyan-300 uppercase">
                      {profile.yearsOfExperience || profile.location || 'Data Science & AI'}
                    </span>
                    <span className="text-sm font-semibold">
                      {profile.headline || profile.name}
                    </span>
                  </div>
                </div>

                {/* Mini Live Terminal Card */}
                <div className="p-3 rounded-xl bg-[#090d16] border border-border/40 font-mono text-xs text-slate-300 space-y-1 shadow-inner">
                  <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-1.5 mb-1.5">
                    <span className="flex items-center gap-1.5 text-primary text-[11px] font-bold">
                      <Terminal className="w-3 h-3" />
                      {username}@ai-core:~$
                    </span>
                    <span className="text-[10px] text-emerald-400">● LIVE</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    <span className="text-purple-400">$</span> python -m model.evaluate
                  </p>
                  <p className="text-emerald-400 text-[11px]">
                    ✓ AI & ML Pipelines: Active
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
