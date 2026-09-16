import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, Plus, Edit, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Skill, SkillCategory } from '../../types/skill';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const emptySkill: Omit<Skill, 'id'> = {
  name: '',
  category: 'Programming',
  level: 'Intermediate',
  icon: 'Code',
  order: 1,
  enabled: true,
  featured: false,
  description: ''
};

export const AdminSkillsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // Form / Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>(emptySkill);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSkills(false);
      setSkills(data);
    } catch (err) {
      console.error('Error fetching skills', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptySkill,
      order: skills.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingId(skill.id || null);
    setFormData({ ...skill });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError('Validation Error', 'Skill name is required.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await apiService.updateSkill(editingId, formData);
        success('Skill Updated', `${formData.name} was updated.`);
      } else {
        await apiService.createSkill(formData);
        success('Skill Created', `${formData.name} was added.`);
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (skill: Skill) => {
    if (!skill.id) return;
    try {
      await apiService.updateSkill(skill.id, { enabled: !skill.enabled });
      success('Skill Status Toggled', `${skill.name} updated.`);
      fetchSkills();
    } catch (err: any) {
      toastError('Failed to toggle', err?.message);
    }
  };

  const handleDelete = async () => {
    if (!skillToDelete?.id) return;
    try {
      await apiService.deleteSkill(skillToDelete.id);
      success('Skill Deleted', `${skillToDelete.name} was removed.`);
      setDeleteConfirmOpen(false);
      setSkillToDelete(null);
      fetchSkills();
    } catch (err: any) {
      toastError('Delete Error', err?.message);
    }
  };

  const categories = ['All', 'Programming', 'Data Science', 'Machine Learning', 'Deep Learning', 'Generative AI', 'Tools'];

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCat === 'All' || s.category === selectedCat;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Skills Management"
        subtitle="Manage technical competencies, categories, and proficiency tiers"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Skill
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:bg-muted border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Skills Table */}
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Skill Name</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Level</th>
                  <th className="py-3.5 px-4 font-semibold">Icon</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id || skill.name} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {skill.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="primary" size="sm">{skill.category}</Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {skill.level}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {skill.icon || 'Code'}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleEnabled(skill)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          skill.enabled ? 'bg-emerald-500/15 text-emerald-500' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {skill.enabled ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSkillToDelete(skill);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete"
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

      {/* Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Skill Entry' : 'Add New Skill'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Skill Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. YOLO, PyTorch, Pandas"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Skill Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as SkillCategory })}
              options={[
                { label: 'Programming', value: 'Programming' },
                { label: 'Data Science', value: 'Data Science' },
                { label: 'Machine Learning', value: 'Machine Learning' },
                { label: 'Deep Learning', value: 'Deep Learning' },
                { label: 'Generative AI', value: 'Generative AI' },
                { label: 'Tools', value: 'Tools' },
              ]}
            />
            <Select
              label="Proficiency Level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
              options={[
                { label: 'Fundamental', value: 'Fundamental' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Advanced', value: 'Advanced' },
                { label: 'Expert', value: 'Expert' },
              ]}
            />
          </div>

          <Input
            label="Lucide Icon Name"
            value={formData.icon || ''}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Code, Database, Eye, Terminal, Sparkles, etc."
          />

          <Input
            label="Short Description / Use Case"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g. Real-time vision detection and tracking"
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Enabled (Visible on public pages)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Save Changes' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Skill?"
        message={`Are you sure you want to remove "${skillToDelete?.name}"?`}
      />
    </div>
  );
};
