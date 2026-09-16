import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, BrainCircuit } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl">
          <BrainCircuit className="w-10 h-10 animate-pulse" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase">
            Error 404: Loss Exceeded Tolerance
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-foreground tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The neural weights you were searching for could not be converged. This page does not exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/">
            <Button variant="primary" icon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
              Explore Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
