import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Filter, Code2, Database, Brain, Cpu, Terminal, Layers } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Skill, SkillCategory } from '../../types/skill';
import { SkillCategoryCard } from '../../components/portfolio/SkillCategoryCard';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await apiService.getSkills(true);
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories: string[] = [
    'All',
    'Programming',
    'Data Science',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Tools'
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const uniqueCategories = Array.from(new Set(filteredSkills.map((s) => s.category))) as SkillCategory[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="ai" size="md">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          Technical Expertise
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Skills & Technologies
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Comprehensive breakdown of programming languages, machine learning frameworks, data science libraries, and generative AI tools I actively utilize.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Tabs */}
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

          {/* Search Box */}
          <div className="w-full md:w-72">
            <Input
              placeholder="Search skill (e.g. YOLO, Python)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
            />
          </div>
        </div>
      </div>

      {/* Skills Content Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : filteredSkills.length === 0 ? (
        <Card glass className="p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="font-display font-bold text-lg text-foreground">No matching skills found</h3>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query or switching the category filter.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {uniqueCategories.map((cat) => {
            const catSkills = filteredSkills.filter((s) => s.category === cat);
            return (
              <SkillCategoryCard
                key={cat}
                category={cat}
                skills={catSkills}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
