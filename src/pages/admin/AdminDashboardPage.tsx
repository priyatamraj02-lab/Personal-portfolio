import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Sparkles, 
  Award, 
  MessageSquare, 
  User, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Plus,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { apiService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const AdminDashboardPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { isFirebaseConfigured } = useAuth();
  const { success, error: toastError } = useToast();

  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    totalSkills: 0,
    totalCertifications: 0,
    totalMessages: 0,
    unreadMessages: 0,
    githubRepos: 0
  });

  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [projects, skills, certs, messages, repos] = await Promise.all([
        apiService.getProjects(false),
        apiService.getSkills(false),
        apiService.getCertifications(),
        apiService.getMessages(),
        apiService.getGithubRepos()
      ]);

      setStats({
        totalProjects: projects.length,
        publishedProjects: projects.filter(p => p.published).length,
        totalSkills: skills.length,
        totalCertifications: certs.length,
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => !m.read).length,
        githubRepos: repos.length
      });

      setRecentMessages(messages.slice(0, 4));
    } catch (err) {
      console.error('Error fetching dashboard metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await apiService.seedInitialDataToFirestore();
      if (res.success) {
        success('Database Seeded!', res.message);
        fetchDashboardData();
      } else {
        toastError('Seeding Failed', res.message);
      }
    } catch (err: any) {
      toastError('Seed Error', err?.message);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      subtext: `${stats.publishedProjects} Published`,
      icon: FolderGit2,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      link: '/admin/projects'
    },
    {
      title: 'Skills & Stack',
      value: stats.totalSkills,
      subtext: 'Across 6 Categories',
      icon: Sparkles,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      link: '/admin/skills'
    },
    {
      title: 'Certifications',
      value: stats.totalCertifications,
      subtext: 'Industry Credentials',
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      link: '/admin/certifications'
    },
    {
      title: 'Contact Messages',
      value: stats.totalMessages,
      subtext: `${stats.unreadMessages} Unread Inquiries`,
      icon: MessageSquare,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      link: '/admin/messages'
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Portfolio CMS Dashboard"
        subtitle="Manage Priyatam Raj's projects, skills, credentials, and inquiries"
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={fetchDashboardData}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
        {/* Database Status Banner & Seeder */}
        <Card glass className="p-6 border-primary/40 bg-gradient-to-r from-primary/5 via-card to-cyan-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-base text-foreground">
                Database Engine: {isFirebaseConfigured ? 'Connected to Firebase Firestore' : 'Operating in Local Storage Sandbox'}
              </h2>
              {isFirebaseConfigured ? (
                <Badge variant="success" size="sm">Cloud Live</Badge>
              ) : (
                <Badge variant="warning" size="sm">Local Sandbox</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              {isFirebaseConfigured
                ? 'Your website is communicating directly with Firebase Firestore and Firebase Storage. Click "Seed Initial Data" anytime you want to re-populate standard showcase entries.'
                : 'Firebase credentials are not yet configured in .env. The CMS is safely saving edits to local storage so you can build and test locally!'}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSeedDatabase}
            loading={seeding}
            icon={<Sparkles className="w-4 h-4" />}
          >
            Seed Initial Dataset
          </Button>
        </Card>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.title} to={card.link} className="block group">
                <Card glass hoverEffect className="p-5 flex items-center justify-between border-border/80">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                      {card.title}
                    </span>
                    <span className="font-display font-black text-3xl text-foreground block">
                      {card.value}
                    </span>
                    <span className="text-xs text-primary block group-hover:underline">
                      {card.subtext} →
                    </span>
                  </div>
                  <div className={`p-3 rounded-2xl ${card.bg} ${card.color} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions & Recent Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-display font-bold text-base text-foreground">
              Quick Content Management
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link to="/admin/projects" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-auto py-3">
                  <Plus className="w-4 h-4 text-primary" />
                  <div className="text-left">
                    <div className="font-bold text-xs">Add New Project</div>
                    <div className="text-[10px] text-muted-foreground">Case study & metrics</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/skills" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-auto py-3">
                  <Plus className="w-4 h-4 text-cyan-500" />
                  <div className="text-left">
                    <div className="font-bold text-xs">Add Skill Entry</div>
                    <div className="text-[10px] text-muted-foreground">Categorized badge</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/profile" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-auto py-3">
                  <User className="w-4 h-4 text-indigo-500" />
                  <div className="text-left">
                    <div className="font-bold text-xs">Edit Profile</div>
                    <div className="text-[10px] text-muted-foreground">Bio, photo & links</div>
                  </div>
                </Button>
              </Link>

              <Link to="/admin/resume" className="block">
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 h-auto py-3">
                  <Award className="w-4 h-4 text-purple-500" />
                  <div className="text-left">
                    <div className="font-bold text-xs">Update Resume</div>
                    <div className="text-[10px] text-muted-foreground">Upload latest PDF</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Inquiries Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-foreground">
                Recent Contact Messages
              </h3>
              <Link to="/admin/messages" className="text-xs font-semibold text-primary hover:underline">
                View All Messages ({stats.totalMessages})
              </Link>
            </div>

            {recentMessages.length === 0 ? (
              <Card glass className="p-8 text-center text-xs text-muted-foreground">
                No inquiries submitted yet.
              </Card>
            ) : (
              <div className="space-y-2.5">
                {recentMessages.map((msg) => (
                  <Card key={msg.id} glass className="p-4 flex items-center justify-between gap-4 border-border/80">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-foreground">{msg.name}</span>
                        {!msg.read && <Badge variant="warning" size="sm">Unread</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
