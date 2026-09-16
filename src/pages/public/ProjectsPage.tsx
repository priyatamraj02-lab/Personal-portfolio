import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Search, Sparkles, Filter, Code2, Layers } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Project, ProjectCategory } from '../../types/project';
import { ProjectCard } from '../../components/portfolio/ProjectCard';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects(true);
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = [
    'All',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Data Science',
    'AI Applications',
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Title & Intro */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <FolderGit2 className="w-3.5 h-3.5" />
          Technical Portfolio
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Featured AI & ML Projects
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Comprehensive case studies demonstrating data engineering, model development, computer vision tracking, and production LLM application pipelines.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105'
                  : 'bg-card/80 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Search projects or tech (e.g. YOLO, RAG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card glass className="p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-display font-bold text-lg text-foreground">No matching projects found</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search criteria or category filter.
          </p>
        </Card>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id || project.slug} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
