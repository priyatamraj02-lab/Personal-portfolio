import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FolderGit2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  ExternalLink, 
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Project, ProjectCategory } from '../../types/project';
import { slugify } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  slug: '',
  tagline: '',
  category: 'Deep Learning',
  description: '',
  problemStatement: '',
  motivation: '',
  dataset: '',
  technologies: [],
  methodology: '',
  architecture: {
    overview: '',
    pipelineSteps: []
  },
  implementation: '',
  modelDetails: {
    name: '',
    type: '',
    framework: '',
    parameters: ''
  },
  results: '',
  evaluationMetrics: [
    { label: 'Metric 1', value: '90%', description: 'Key performance score' }
  ],
  challenges: [
    { challenge: '', solution: '' }
  ],
  keyLearnings: [],
  futureImprovements: [],
  codeSnippet: {
    language: 'python',
    title: 'main.py',
    code: '# Model inference pipeline\nimport torch\n'
  },
  thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  galleryImages: [],
  githubUrl: '',
  liveDemoUrl: '',
  featured: false,
  published: true,
  order: 1,
  createdAt: new Date().toISOString().split('T')[0]
};

export const AdminProjectsPage: React.FC = () => {
  const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
  const { success, error: toastError } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(emptyProject);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete confirm state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProjects(false);
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...emptyProject,
      order: projects.length + 1
    });
    setTechInput('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id || null);
    setFormData({
      ...project,
      evaluationMetrics: project.evaluationMetrics || [],
      challenges: project.challenges || [],
      keyLearnings: project.keyLearnings || [],
      futureImprovements: project.futureImprovements || [],
      architecture: project.architecture || { overview: '', pipelineSteps: [] },
      modelDetails: project.modelDetails || { name: '', type: '', framework: '' },
    });
    setTechInput(project.technologies.join(', '));
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    if (!editingId) {
      setFormData({
        ...formData,
        title: val,
        slug: slugify(val)
      });
    } else {
      setFormData({ ...formData, title: val });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Validation Error', 'Project title is required.');
      return;
    }

    setSaving(true);
    const cleanedTech = techInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const projectPayload = {
      ...formData,
      slug: formData.slug || slugify(formData.title),
      technologies: cleanedTech.length > 0 ? cleanedTech : ['Python', 'Machine Learning'],
    };

    try {
      if (editingId) {
        await apiService.updateProject(editingId, projectPayload);
        success('Project Updated', `${projectPayload.title} has been updated.`);
      } else {
        await apiService.createProject(projectPayload);
        success('Project Created', `${projectPayload.title} has been added.`);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      toastError('Save Error', err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    if (!project.id) return;
    try {
      const updated = await apiService.updateProject(project.id, { published: !project.published });
      success(
        updated.published ? 'Project Published' : 'Project Unpublished',
        `${project.title} status updated.`
      );
      fetchProjects();
    } catch (err: any) {
      toastError('Update Failed', err?.message);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete?.id) return;
    try {
      await apiService.deleteProject(projectToDelete.id);
      success('Project Deleted', `${projectToDelete.title} was removed.`);
      setDeleteConfirmOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (err: any) {
      toastError('Delete Failed', err?.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        onToggleSidebar={toggleSidebar}
        title="Project Management"
        subtitle="Create, edit case studies, publish/unpublish, and order projects"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Project
          </Button>
        }
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Projects List Card */}
        <Card glass className="p-0 overflow-hidden border-border/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/80 text-muted-foreground uppercase font-mono text-[11px] border-b border-border">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Project</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Technologies</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {projects.map((proj) => (
                  <tr key={proj.id || proj.slug} className="hover:bg-muted/30 transition-colors">
                    {/* Title & Slug */}
                    <td className="py-3.5 px-4">
                      <div className="min-w-0">
                        <span className="font-bold text-foreground block truncate">
                          {proj.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono truncate block">
                          /{proj.slug}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <Badge variant="ai" size="sm">{proj.category}</Badge>
                    </td>

                    {/* Tech Badges */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.technologies.slice(0, 3).map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">
                            {t}
                          </span>
                        ))}
                        {proj.technologies.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{proj.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          proj.published
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {proj.published ? (
                          <>
                            <Eye className="w-3 h-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Draft
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProjectToDelete(proj);
                            setDeleteConfirmOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete Project"
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

      {/* Full Case Study Edit / Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Project Case Study' : 'Create New Project'}
        description="Comprehensive case study content rendered directly on the public portfolio"
        maxWidth="4xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              General Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Project Title *"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Real-time Object Tracker"
                required
              />
              <Input
                label="URL Slug *"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                placeholder="e.g. real-time-object-tracker"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Project Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                options={[
                  { label: 'Deep Learning', value: 'Deep Learning' },
                  { label: 'Generative AI', value: 'Generative AI' },
                  { label: 'Machine Learning', value: 'Machine Learning' },
                  { label: 'Data Science', value: 'Data Science' },
                  { label: 'AI Applications', value: 'AI Applications' },
                ]}
              />
              <Input
                label="Tagline / Subheading"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. YOLOv8-powered multi-object surveillance system"
              />
            </div>

            <Input
              label="Technologies (Comma separated)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Python, PyTorch, YOLOv8, OpenCV, Flask"
            />

            <Textarea
              label="Brief Description (Card View) *"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          {/* Links & Repositories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              Links & Repositories
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub Repository URL"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
              <Input
                label="Live Demo URL (Optional)"
                value={formData.liveDemoUrl || ''}
                onChange={(e) => setFormData({ ...formData, liveDemoUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Case Study Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              Deep Case Study Narrative
            </h4>

            <Textarea
              label="Problem Statement"
              rows={3}
              value={formData.problemStatement}
              onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
            />

            <Textarea
              label="Motivation"
              rows={3}
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
            />

            <Textarea
              label="Dataset & Preprocessing"
              rows={3}
              value={formData.dataset}
              onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
            />

            <Textarea
              label="Methodology"
              rows={3}
              value={formData.methodology}
              onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
            />

            <Textarea
              label="Architecture Overview"
              rows={3}
              value={formData.architecture?.overview || ''}
              onChange={(e) => setFormData({
                ...formData,
                architecture: { ...formData.architecture, overview: e.target.value }
              })}
            />

            <Textarea
              label="Implementation & Deployment Details"
              rows={3}
              value={formData.implementation}
              onChange={(e) => setFormData({ ...formData, implementation: e.target.value })}
            />

            <Textarea
              label="Results Summary"
              rows={3}
              value={formData.results}
              onChange={(e) => setFormData({ ...formData, results: e.target.value })}
            />
          </div>

          {/* Code Snippet */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
              Code Snippet Feature
            </h4>

            <Input
              label="Snippet Title"
              value={formData.codeSnippet?.title || ''}
              onChange={(e) => setFormData({
                ...formData,
                codeSnippet: { ...(formData.codeSnippet || { language: 'python', code: '' }), title: e.target.value }
              })}
              placeholder="e.g. inference.py"
            />

            <Textarea
              label="Python / Source Code"
              rows={6}
              value={formData.codeSnippet?.code || ''}
              onChange={(e) => setFormData({
                ...formData,
                codeSnippet: { ...(formData.codeSnippet || { language: 'python', title: 'main.py' }), code: e.target.value }
              })}
              className="font-mono text-xs"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Published (Visible on site)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded text-primary focus:ring-primary"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>
              {editingId ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project?"
        message={`Are you sure you want to delete "${projectToDelete?.title}"? This action cannot be undone.`}
      />
    </div>
  );
};
