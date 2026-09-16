import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Trophy, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink,
  X
} from 'lucide-react';
import { Github } from '../ui/BrandIcons';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const { logout, isFirebaseConfigured, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile Details', path: '/admin/profile', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills & Stack', path: '/admin/skills', icon: Sparkles },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
    { name: 'GitHub Repos', path: '/admin/github', icon: Github },
    { name: 'Resume File', path: '/admin/resume', icon: FileText },
    { name: 'Contact Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 h-full bg-card border-r border-border flex flex-col justify-between shrink-0 select-none">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-display font-black flex items-center justify-center text-sm shadow-sm">
              PR
            </div>
            <div>
              <span className="font-bold text-sm text-foreground block leading-none">
                Admin Panel
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {isFirebaseConfigured ? 'Firebase Live' : 'Local Sandbox'}
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Database Status Tag */}
        <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Database Mode:</span>
          {isFirebaseConfigured ? (
            <Badge variant="success" size="sm">Firestore Live</Badge>
          ) : (
            <Badge variant="warning" size="sm">Local Fallback</Badge>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Site
          </span>
          <span className="text-[10px] uppercase font-mono">Live</span>
        </Link>

        <button
          onClick={() => logout()}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out ({user?.email?.split('@')[0] || 'Admin'})</span>
        </button>
      </div>
    </aside>
  );
};
