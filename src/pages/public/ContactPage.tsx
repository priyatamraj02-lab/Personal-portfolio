import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  Sparkles, 
  Send 
} from 'lucide-react';
import { Github, Linkedin, Twitter } from '../../components/ui/BrandIcons';
import { apiService } from '../../services/apiService';
import { Profile } from '../../types/profile';
import { initialProfile } from '../../data/initialProfile';
import { ContactForm } from '../../components/portfolio/ContactForm';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

export const ContactPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile for contact', err);
      }
    };
    fetchProfile();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    success('Email copied!', profile.email);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <Badge variant="primary" size="md">
          <Mail className="w-3.5 h-3.5" />
          Get in Touch
        </Badge>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
          Let's Start a Conversation
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Whether you have questions about my machine learning projects, want to discuss research collaborations, or have an open role, I'd love to hear from you.
        </p>
      </div>

      {/* Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <Card glass className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-foreground">
                Send a Direct Message
              </h2>
              <p className="text-xs text-muted-foreground">
                Fill out the form below. Messages are saved securely and delivered directly.
              </p>
            </div>

            <ContactForm />
          </Card>
        </div>

        {/* Contact Details & Socials Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Availability Card */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                Current Status
              </span>
            </div>
            <h3 className="font-display font-bold text-lg text-foreground">
              {profile.availability}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Actively seeking Data Science, Machine Learning, Deep Learning, and Generative AI internship & entry-level engineering roles.
            </p>
          </Card>

          {/* Direct Coordinates */}
          <Card glass className="p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-foreground">
              Direct Contact Channels
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-card/60 border border-border/60">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block">Email</span>
                    <span className="text-muted-foreground font-mono">{profile.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/60">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Location</span>
                  <span className="text-muted-foreground">{profile.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-card/60 border border-border/60">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Response Time</span>
                  <span className="text-muted-foreground">Within 24 hours (IST Timezone)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Social Profiles */}
          <Card glass className="p-6 space-y-4">
            <h3 className="font-display font-bold text-base text-foreground">
              Social Profiles & Platforms
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-card/60 border border-border/60 hover:border-primary/40 hover:text-primary transition-all text-xs font-semibold"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl bg-card/60 border border-border/60 hover:border-primary/40 hover:text-primary transition-all text-xs font-semibold"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
