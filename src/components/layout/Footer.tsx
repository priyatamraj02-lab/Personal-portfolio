import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { Github, Linkedin } from '../ui/BrandIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border bg-card/60 backdrop-blur-md pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary via-purple-600 to-cyan-400 flex items-center justify-center font-display font-black text-white text-base">
                PR
              </div>
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                Priyatam Raj
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Data Science, Machine Learning, Deep Learning & Generative AI student at Centurion University of Technology and Management (2024–2028). Building scalable intelligence from raw data.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/priyatamraj"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/priyatamraj"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:priyatamraj@example.com"
                className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Story</Link></li>
              <li><Link to="/skills" className="hover:text-primary transition-colors">Skills & Tech Stack</Link></li>
              <li><Link to="/projects" className="hover:text-primary transition-colors">Project Portfolio</Link></li>
              <li><Link to="/experience" className="hover:text-primary transition-colors">Experience Timeline</Link></li>
              <li><Link to="/education" className="hover:text-primary transition-colors">Education & Coursework</Link></li>
            </ul>
          </div>

          {/* Key Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Direct Access
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/resume" className="hover:text-primary transition-colors flex items-center gap-1">Download Resume <ArrowUpRight className="w-3.5 h-3.5" /></Link></li>
              <li><Link to="/certifications" className="hover:text-primary transition-colors">Certifications</Link></li>
              <li><Link to="/achievements" className="hover:text-primary transition-colors">Hackathons & Awards</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Get In Touch</Link></li>
              <li><Link to="/admin/login" className="hover:text-primary text-xs opacity-60">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Priyatam Raj. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Designed & Engineered with React, TypeScript & Tailwind</span>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </div>
    </footer>
  );
};
