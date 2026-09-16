import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, isFirebaseConfigured, user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  if (user) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await login(email.trim(), password);
      success('Authentication Successful', 'Welcome to your portfolio CMS.');
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate. Check your credentials.');
      toastError('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoCreds = () => {
    setEmail('admin@priyatamraj.dev');
    setPassword('admin123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Public Portfolio
        </Link>

        {/* Card */}
        <Card glass className="p-8 space-y-6 shadow-2xl border-border/80">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-cyan-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display font-black text-2xl text-foreground">
              Admin CMS Portal
            </h1>
            <p className="text-xs text-muted-foreground">
              Protected portfolio content management system
            </p>
          </div>

          {/* Database Mode Badge */}
          <div className="p-3 rounded-xl bg-muted/60 border border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Auth Mode:</span>
            {isFirebaseConfigured ? (
              <Badge variant="success" size="sm">Firebase Authentication</Badge>
            ) : (
              <Badge variant="warning" size="sm">Local Sandbox Mode</Badge>
            )}
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@priyatamraj.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={loading}
              className="w-full font-semibold"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to CMS
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div className="pt-2 border-t border-border text-center space-y-2">
            <p className="text-[11px] text-muted-foreground">
              Testing locally without Firebase configured?
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemoCreds}
              className="w-full text-xs"
              icon={<Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            >
              Fill Demo Credentials (admin@priyatamraj.dev)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
