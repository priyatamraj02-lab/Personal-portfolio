import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { isValidEmail } from '../../utils/validators';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

export const ContactForm: React.FC = () => {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '', // Spam bot protection
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message or inquiry.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (formData.honeypot) {
      // Silently ignore spam
      setSubmitted(true);
      return;
    }

    if (!validate()) return;

    setLoading(true);
    try {
      await apiService.sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Portfolio Contact Inquiry',
        message: formData.message.trim(),
      });

      setSubmitted(true);
      success('Message sent successfully!', "Thanks for reaching out. I'll get back to you shortly.");

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (err: any) {
      toastError('Failed to send message', err?.message || 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display font-bold text-xl text-foreground">
            Thank you for reaching out!
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your message has been safely delivered. I usually respond within 24 hours.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot hidden input */}
      <input
        type="text"
        name="website"
        value={formData.honeypot}
        onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Name *"
          placeholder="e.g. Alex Morgan"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
          required
        />
        <Input
          label="Email Address *"
          type="email"
          placeholder="alex@example.com"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          error={errors.email}
          required
        />
      </div>

      <Input
        label="Subject (Optional)"
        placeholder="e.g. Machine Learning Project / Collaboration Opportunity"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />

      <Textarea
        label="Message *"
        rows={5}
        placeholder="Hi Priyatam, I came across your portfolio and wanted to discuss..."
        value={formData.message}
        onChange={(e) => {
          setFormData({ ...formData, message: e.target.value });
          if (errors.message) setErrors({ ...errors, message: '' });
        }}
        error={errors.message}
        required
      />

      <Button
        type="submit"
        size="lg"
        variant="primary"
        loading={loading}
        className="w-full sm:w-auto font-semibold"
        icon={<Send className="w-4 h-4" />}
      >
        Send Message
      </Button>
    </form>
  );
};
