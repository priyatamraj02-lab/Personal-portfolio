import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  MessageSquare, 
  Trash2, 
  Mail, 
  MailCheck, 
  MailOpen, 
  Calendar, 
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { ContactMessage } from '../../types/message';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

export const AdminMessagesPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    if (!msg.id) return;
    try {
      await apiService.markMessageRead(msg.id, !msg.read);
      fetchMessages();
      success(msg.read ? 'Marked as unread' : 'Marked as read');
    } catch (err: any) {
      toastError('Update Failed', err?.message);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await apiService.deleteMessage(itemToDelete.id);
      success('Message Deleted', 'Inquiry was removed.');
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchMessages();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesFilter = filterMode === 'all' || !m.read;
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Contact Inquiries Inbox"
        subtitle="Review, reply, and manage messages submitted via the public contact form"
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterMode === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              All Messages ({messages.length})
            </button>
            <button
              onClick={() => setFilterMode('unread')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filterMode === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
            >
              Unread ({messages.filter(m => !m.read).length})
            </button>
          </div>

          <div className="w-full sm:w-72">
            <Input
              placeholder="Search sender, email, text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Message Cards */}
        {filtered.length === 0 ? (
          <Card glass className="p-12 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="font-display font-bold text-base text-foreground">No messages found</h3>
            <p className="text-xs text-muted-foreground">
              {filterMode === 'unread' ? 'You have zero unread messages.' : 'Your inbox is currently empty.'}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((msg) => (
              <Card
                key={msg.id}
                glass
                className={`p-6 space-y-4 transition-all border ${
                  !msg.read ? 'border-primary/40 bg-primary/5 shadow-md shadow-primary/5' : 'border-border/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground">{msg.name}</h4>
                        {!msg.read && <Badge variant="warning" size="sm">New</Badge>}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-primary font-mono hover:underline flex items-center gap-1"
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Subject & Message */}
                <div className="space-y-1.5">
                  {msg.subject && (
                    <span className="font-bold text-xs text-foreground block">
                      Subject: {msg.subject}
                    </span>
                  )}
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/40 p-3 rounded-xl border border-border/50">
                    {msg.message}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleToggleRead(msg)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                  >
                    {msg.read ? (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        Mark Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="w-3.5 h-3.5 text-primary" />
                        Mark as Read
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}>
                      <Button size="sm" variant="outline" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                        Reply via Email
                      </Button>
                    </a>
                    <button
                      onClick={() => {
                        setItemToDelete(msg);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Message?"
        message={`Are you sure you want to remove the message from ${itemToDelete?.name}?`}
      />
    </div>
  );
};
