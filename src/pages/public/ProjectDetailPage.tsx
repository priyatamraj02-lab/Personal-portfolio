import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Target, 
  Compass, 
  Database, 
  Cpu, 
  BarChart3, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Images, 
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { apiService } from '../../services/apiService';
import { Project } from '../../types/project';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CodeBlock } from '../../components/ui/CodeBlock';
import { Lightbox } from '../../components/ui/Lightbox';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) return;
      try {
        const found = await apiService.getProjectBySlug(slug);
        setProject(found);
      } catch (err) {
        console.error('Error fetching project detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-foreground">Project Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested project case study could not be found or may have been removed.
        </p>
        <Link to="/projects">
          <Button variant="primary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const allImages = [
    project.thumbnail,
    ...(project.galleryImages || [])
  ].filter(Boolean);

  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors p-2 rounded-xl hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>

        <Badge variant="ai" size="md">
          {project.category}
        </Badge>
      </div>

      {/* Main Title & Tagline */}
      <div className="space-y-3">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-primary font-medium">
          {project.tagline}
        </p>
      </div>

      {/* Hero Thumbnail Banner & Action Buttons */}
      <div className="space-y-6">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-muted group cursor-pointer" onClick={() => openLightbox(0)}>
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-mono font-semibold flex items-center gap-2">
              <Images className="w-4 h-4" />
              Click to Open Fullscreen Gallery
            </span>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 border border-border/60">
          {/* Tech Badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90 font-mono text-xs font-medium border border-border/60"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" icon={<Github className="w-4 h-4" />}>
                  View Repository
                </Button>
              </a>
            )}
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                  Live Demo
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Key Evaluation Metrics Grid */}
      {project.evaluationMetrics && project.evaluationMetrics.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Empirical Results & Benchmarks
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {project.evaluationMetrics.map((m) => (
              <Card key={m.label} glass className="p-4 text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block truncate">
                  {m.label}
                </span>
                <span className="font-display font-black text-2xl sm:text-3xl text-primary block">
                  {m.value}
                </span>
                {m.description && (
                  <span className="text-[10px] text-muted-foreground/80 block truncate">
                    {m.description}
                  </span>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Case Study Grid Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problem Statement */}
        <Card glass className="p-6 space-y-3 border-border/80">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Target className="w-5 h-5 text-red-500" />
            <h3>Problem Statement</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.problemStatement}
          </p>
        </Card>

        {/* Motivation */}
        <Card glass className="p-6 space-y-3 border-border/80">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Compass className="w-5 h-5 text-indigo-500" />
            <h3>Motivation & Purpose</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.motivation}
          </p>
        </Card>
      </div>

      {/* Dataset & Methodology */}
      <div className="space-y-6">
        <Card glass className="p-6 space-y-3 border-border/80">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Database className="w-5 h-5 text-cyan-500" />
            <h3>Dataset & Preprocessing</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.dataset}
          </p>
        </Card>

        <Card glass className="p-6 space-y-3 border-border/80">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Workflow className="w-5 h-5 text-purple-500" />
            <h3>Methodology & Workflow</h3>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.methodology}
          </p>
        </Card>
      </div>

      {/* Architecture Section */}
      <section className="space-y-4">
        <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          System Architecture & Pipeline
        </h2>
        <Card glass className="p-6 space-y-5">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-mono bg-muted/40 p-4 rounded-xl border border-border/60">
            {project.architecture.overview}
          </p>

          {project.architecture.pipelineSteps && project.architecture.pipelineSteps.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                Pipeline Execution Stages:
              </span>
              <div className="space-y-2">
                {project.architecture.pipelineSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Model Specifications & Implementation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card glass className="p-6 space-y-3 lg:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            Model Specifications
          </span>
          <div className="space-y-2 font-mono text-xs text-muted-foreground pt-1">
            <div>
              <span className="text-foreground font-semibold block">Model:</span>
              {project.modelDetails.name}
            </div>
            <div>
              <span className="text-foreground font-semibold block">Type:</span>
              {project.modelDetails.type}
            </div>
            <div>
              <span className="text-foreground font-semibold block">Framework:</span>
              {project.modelDetails.framework}
            </div>
            {project.modelDetails.parameters && (
              <div>
                <span className="text-foreground font-semibold block">Parameters:</span>
                {project.modelDetails.parameters}
              </div>
            )}
          </div>
        </Card>

        <Card glass className="p-6 space-y-3 lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Implementation & Deployment
          </span>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {project.implementation}
          </p>
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground block mb-1">
              Results Summary:
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {project.results}
            </p>
          </div>
        </Card>
      </div>

      {/* Code Snippet Highlight */}
      {project.codeSnippet && (
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Core Implementation Code
          </h2>
          <CodeBlock
            code={project.codeSnippet.code}
            language={project.codeSnippet.language}
            title={project.codeSnippet.title}
          />
        </section>
      )}

      {/* Image Gallery */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
              <Images className="w-5 h-5 text-primary" />
              Screenshots & Visuals
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              {project.galleryImages.length} Screenshots
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.galleryImages.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => openLightbox(idx + 1)}
                className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted border border-border/60 group cursor-pointer"
              >
                <img
                  src={imgUrl}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-mono font-semibold">View</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Challenges & Solutions */}
      {project.challenges && project.challenges.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Engineering Challenges & Solutions
          </h2>
          <div className="space-y-3">
            {project.challenges.map((c, idx) => (
              <Card key={idx} glass className="p-5 space-y-3 border-border/80">
                <div>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
                    Challenge {idx + 1}:
                  </span>
                  <p className="text-xs sm:text-sm text-foreground/90 font-medium mt-0.5">
                    {c.challenge}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/60">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">
                    Solution Implemented:
                  </span>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {c.solution}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Key Learnings & Future Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card glass className="p-6 space-y-3 border-border/80">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3>Key Learnings</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            {project.keyLearnings?.map((k, idx) => (
              <li key={idx}>{k}</li>
            ))}
          </ul>
        </Card>

        <Card glass className="p-6 space-y-3 border-border/80">
          <div className="flex items-center gap-2 text-foreground font-bold text-base">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3>Future Roadmap</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground list-disc list-inside leading-relaxed">
            {project.futureImprovements?.map((f, idx) => (
              <li key={idx}>{f}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Bottom Back Button */}
      <div className="pt-8 border-t border-border/60 flex items-center justify-between">
        <Link to="/projects">
          <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
            All Projects
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="primary" size="sm">
            Discuss This Project
          </Button>
        </Link>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        images={allImages}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setActiveImageIndex(newIdx)}
      />
    </div>
  );
};
