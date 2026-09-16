import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw, Star, GitFork, ExternalLink } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { apiService } from '../../services/apiService';
import { GithubRepo } from '../../types/github';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const emptyRepo: Omit<GithubRepo, 'id'> = {
  name: '',
  fullName: '',
  description: '',
  htmlUrl: '',
  language: 'Python',
  starsCount: 0,
  forksCount: 0,
  topics: [],
  isFeatured: true,
  order: 1
};

export const AdminGithubPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [githubUser, setGithubUser] = useState('priyatamraj');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<GithubRepo, 'id'>>(emptyRepo);
  const [topicsInput, setTopicsInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GithubRepo | null>(null);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const data = await apiService.getGithubRepos();
      setRepos(data);
    } catch (err) {
      console.error('Error fetching repos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleSyncFromGitHub = async () => {
    if (!githubUser.trim()) return;
    setSyncing(true);
    try {
      const fetched = await apiService.fetchGithubApiRepos(githubUser.trim());
      if (fetched && fetched.length > 0) {
        // Save to store
        for (const r of fetched) {
          await apiService.createGithubRepo(r);
        }
        success('GitHub Synced', `Fetched ${fetched.length} public repositories.`);
        fetchRepos();
      } else {
        toastError('Sync Notice', 'No public repositories found for this username.');
      }
    } catch (err: any) {
      toastError('Sync Failed', err?.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyRepo,
      order: repos.length + 1
    });
    setTopicsInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (repo: GithubRepo) => {
    setEditingId(repo.id || null);
    setFormData({ ...repo });
    setTopicsInput(repo.topics?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.htmlUrl.trim()) {
      toastError('Validation Error', 'Repository Name and URL are required.');
      return;
    }

    setSaving(true);
    const cleanedTopics = topicsInput.split(',').map(t => t.trim()).filter(Boolean);

    const payload = {
      ...formData,
      topics: cleanedTopics
    };

    try {
      if (editingId) {
        await apiService.updateGithubRepo(editingId, payload);
        success('Repository Updated', `${payload.name} was updated.`);
      } else {
        await apiService.createGithubRepo(payload);
        success('Repository Created', `${payload.name} was added.`);
      }
      setIsModalOpen(false);
      fetchRepos();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete?.id) return;
    try {
      await apiService.deleteGithubRepo(itemToDelete.id);
      success('Repository Removed', `${itemToDelete.name} was deleted.`);
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchRepos();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="GitHub Repositories Management"
        subtitle="Manage featured repositories with automated GitHub public API sync option"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Repository
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* GitHub API Sync Bar */}
        <Card glass className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-border/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Github className="w-6 h-6 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="font-bold text-xs text-foreground block">
                Sync from Public GitHub API
              </span>
              <span className="text-[11px] text-muted-foreground">
                Fetch public repositories automatically without exposing API keys
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              placeholder="GitHub username"
              className="w-full sm:w-44 text-xs"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncFromGitHub}
              loading={syncing}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Sync
            </Button>
          </div>
        </Card>

        {/* Repos Table */}
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Repository</th>
                  <th className="py-3.5 px-4 font-semibold">Language</th>
                  <th className="py-3.5 px-4 font-semibold">Stars / Forks</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {repos.map((repo) => (
                  <tr key={repo.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-foreground">{repo.name}</div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-xs">{repo.description}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-primary">{repo.language}</td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      ★ {repo.starsCount} | ⑂ {repo.forksCount}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={repo.isFeatured ? 'ai' : 'outline'} size="sm">
                        {repo.isFeatured ? 'Featured' : 'Standard'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(repo)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(repo);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Repository' : 'Add Repository'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Repository Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. classroom-activity-monitoring"
            required
          />

          <Input
            label="GitHub Repository URL *"
            value={formData.htmlUrl}
            onChange={(e) => setFormData({ ...formData, htmlUrl: e.target.value })}
            placeholder="https://github.com/priyatamraj/..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Primary Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              placeholder="Python"
            />
            <Input
              label="Stars Count"
              type="number"
              value={formData.starsCount}
              onChange={(e) => setFormData({ ...formData, starsCount: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Forks Count"
              type="number"
              value={formData.forksCount}
              onChange={(e) => setFormData({ ...formData, forksCount: parseInt(e.target.value) || 0 })}
            />
          </div>

          <Textarea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="YOLOv8 computer vision system..."
          />

          <Input
            label="Topics / Tags (Comma separated)"
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            placeholder="yolov8, computer-vision, deep-learning, python"
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Featured Repository</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Save Changes' : 'Create Repo'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Repository?"
        message={`Are you sure you want to remove "${itemToDelete?.name}"?`}
      />
    </div>
  );
};
