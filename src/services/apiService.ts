import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  addDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

import { Profile } from '../types/profile';
import { Project } from '../types/project';
import { Skill } from '../types/skill';
import { Experience } from '../types/experience';
import { Education } from '../types/education';
import { Certification } from '../types/certification';
import { Achievement } from '../types/achievement';
import { GithubRepo } from '../types/github';
import { ContactMessage } from '../types/message';
import { SiteSettings } from '../types/settings';

// Initial data for seeding & local fallback
import { initialProfile } from '../data/initialProfile';
import { initialProjects } from '../data/initialProjects';
import { initialSkills } from '../data/initialSkills';
import { initialExperience } from '../data/initialExperience';
import { initialEducation } from '../data/initialEducation';
import { initialCertifications } from '../data/initialCertifications';
import { initialAchievements } from '../data/initialAchievements';
import { initialGithubRepos } from '../data/initialGithub';
import { initialSettings } from '../data/initialSettings';

// Local storage keys
const LS_KEYS = {
  PROFILE: 'priyatam_portfolio_profile',
  PROJECTS: 'priyatam_portfolio_projects',
  SKILLS: 'priyatam_portfolio_skills',
  EXPERIENCE: 'priyatam_portfolio_experience',
  EDUCATION: 'priyatam_portfolio_education',
  CERTIFICATIONS: 'priyatam_portfolio_certifications',
  ACHIEVEMENTS: 'priyatam_portfolio_achievements',
  GITHUB: 'priyatam_portfolio_github',
  MESSAGES: 'priyatam_portfolio_messages',
  SETTINGS: 'priyatam_portfolio_settings',
};

// Local storage helper
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Error writing to local storage', err);
  }
}

export const apiService = {
  // -------------------------------------------------------------
  // PROFILE
  // -------------------------------------------------------------
  async getProfile(): Promise<Profile> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'profiles', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...(docSnap.data() as Profile) };
        }
      } catch (err) {
        console.warn('Firestore getProfile failed, fallback to local', err);
      }
    }
    return getLocal<Profile>(LS_KEYS.PROFILE, initialProfile);
  },

  async updateProfile(profile: Profile): Promise<Profile> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'profiles', 'main');
      await setDoc(docRef, profile, { merge: true });
    }
    setLocal(LS_KEYS.PROFILE, profile);
    return profile;
  },

  // -------------------------------------------------------------
  // PROJECTS
  // -------------------------------------------------------------
  async getProjects(onlyPublished: boolean = false): Promise<Project[]> {
    if (isFirebaseConfigured && db) {
      try {
        const projectsRef = collection(db, 'projects');
        const q = onlyPublished 
          ? query(projectsRef, where('published', '==', true), orderBy('order', 'asc'))
          : query(projectsRef, orderBy('order', 'asc'));
        
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: Project[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Project) });
          });
          return list;
        }
      } catch (err) {
        console.warn('Firestore getProjects failed, fallback to local', err);
      }
    }
    const local = getLocal<Project[]>(LS_KEYS.PROJECTS, initialProjects);
    const sorted = [...local].sort((a, b) => a.order - b.order);
    return onlyPublished ? sorted.filter(p => p.published) : sorted;
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const all = await this.getProjects(false);
    return all.find(p => p.slug === slug) || null;
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newId = `proj-${Date.now()}`;
    const newProject: Project = { ...project, id: newId };

    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'projects', newId);
      await setDoc(docRef, newProject);
    }
    
    const list = getLocal<Project[]>(LS_KEYS.PROJECTS, initialProjects);
    list.push(newProject);
    setLocal(LS_KEYS.PROJECTS, list);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, updates);
    }

    const list = getLocal<Project[]>(LS_KEYS.PROJECTS, initialProjects);
    const index = list.findIndex(p => p.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.PROJECTS, list);
      return list[index];
    }
    throw new Error('Project not found');
  },

  async deleteProject(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    }

    const list = getLocal<Project[]>(LS_KEYS.PROJECTS, initialProjects);
    const filtered = list.filter(p => p.id !== id);
    setLocal(LS_KEYS.PROJECTS, filtered);
  },

  // -------------------------------------------------------------
  // SKILLS
  // -------------------------------------------------------------
  async getSkills(onlyEnabled: boolean = false): Promise<Skill[]> {
    if (isFirebaseConfigured && db) {
      try {
        const skillsRef = collection(db, 'skills');
        const q = onlyEnabled 
          ? query(skillsRef, where('enabled', '==', true), orderBy('order', 'asc'))
          : query(skillsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: Skill[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...(doc.data() as Skill) });
          });
          return list;
        }
      } catch (err) {
        console.warn('Firestore getSkills failed, fallback to local', err);
      }
    }
    const local = getLocal<Skill[]>(LS_KEYS.SKILLS, initialSkills);
    const sorted = [...local].sort((a, b) => a.order - b.order);
    return onlyEnabled ? sorted.filter(s => s.enabled) : sorted;
  },

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const newId = `sk-${Date.now()}`;
    const newSkill: Skill = { ...skill, id: newId };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'skills', newId), newSkill);
    }
    const list = getLocal<Skill[]>(LS_KEYS.SKILLS, initialSkills);
    list.push(newSkill);
    setLocal(LS_KEYS.SKILLS, list);
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'skills', id), updates);
    }
    const list = getLocal<Skill[]>(LS_KEYS.SKILLS, initialSkills);
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.SKILLS, list);
      return list[index];
    }
    throw new Error('Skill not found');
  },

  async deleteSkill(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'skills', id));
    }
    const list = getLocal<Skill[]>(LS_KEYS.SKILLS, initialSkills);
    setLocal(LS_KEYS.SKILLS, list.filter(s => s.id !== id));
  },

  // -------------------------------------------------------------
  // EXPERIENCE
  // -------------------------------------------------------------
  async getExperience(): Promise<Experience[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'experience'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: Experience[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as Experience) }));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getExperience failed, fallback to local', err);
      }
    }
    return getLocal<Experience[]>(LS_KEYS.EXPERIENCE, initialExperience).sort((a, b) => a.order - b.order);
  },

  async createExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
    const newId = `exp-${Date.now()}`;
    const newExp: Experience = { ...exp, id: newId };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'experience', newId), newExp);
    }
    const list = getLocal<Experience[]>(LS_KEYS.EXPERIENCE, initialExperience);
    list.push(newExp);
    setLocal(LS_KEYS.EXPERIENCE, list);
    return newExp;
  },

  async updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'experience', id), updates);
    }
    const list = getLocal<Experience[]>(LS_KEYS.EXPERIENCE, initialExperience);
    const index = list.findIndex(e => e.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.EXPERIENCE, list);
      return list[index];
    }
    throw new Error('Experience entry not found');
  },

  async deleteExperience(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'experience', id));
    }
    const list = getLocal<Experience[]>(LS_KEYS.EXPERIENCE, initialExperience);
    setLocal(LS_KEYS.EXPERIENCE, list.filter(e => e.id !== id));
  },

  // -------------------------------------------------------------
  // EDUCATION
  // -------------------------------------------------------------
  async getEducation(): Promise<Education[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'education'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: Education[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as Education) }));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getEducation failed, fallback to local', err);
      }
    }
    return getLocal<Education[]>(LS_KEYS.EDUCATION, initialEducation).sort((a, b) => a.order - b.order);
  },

  async createEducation(edu: Omit<Education, 'id'>): Promise<Education> {
    const newId = `edu-${Date.now()}`;
    const newEdu: Education = { ...edu, id: newId };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'education', newId), newEdu);
    }
    const list = getLocal<Education[]>(LS_KEYS.EDUCATION, initialEducation);
    list.push(newEdu);
    setLocal(LS_KEYS.EDUCATION, list);
    return newEdu;
  },

  async updateEducation(id: string, updates: Partial<Education>): Promise<Education> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'education', id), updates);
    }
    const list = getLocal<Education[]>(LS_KEYS.EDUCATION, initialEducation);
    const index = list.findIndex(e => e.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.EDUCATION, list);
      return list[index];
    }
    throw new Error('Education entry not found');
  },

  async deleteEducation(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'education', id));
    }
    const list = getLocal<Education[]>(LS_KEYS.EDUCATION, initialEducation);
    setLocal(LS_KEYS.EDUCATION, list.filter(e => e.id !== id));
  },

  // -------------------------------------------------------------
  // CERTIFICATIONS
  // -------------------------------------------------------------
  async getCertifications(): Promise<Certification[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'certifications'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: Certification[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as Certification) }));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getCertifications failed, fallback to local', err);
      }
    }
    return getLocal<Certification[]>(LS_KEYS.CERTIFICATIONS, initialCertifications).sort((a, b) => a.order - b.order);
  },

  async createCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
    const newId = `cert-${Date.now()}`;
    const newCert: Certification = { ...cert, id: newId };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'certifications', newId), newCert);
    }
    const list = getLocal<Certification[]>(LS_KEYS.CERTIFICATIONS, initialCertifications);
    list.push(newCert);
    setLocal(LS_KEYS.CERTIFICATIONS, list);
    return newCert;
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'certifications', id), updates);
    }
    const list = getLocal<Certification[]>(LS_KEYS.CERTIFICATIONS, initialCertifications);
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.CERTIFICATIONS, list);
      return list[index];
    }
    throw new Error('Certification entry not found');
  },

  async deleteCertification(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'certifications', id));
    }
    const list = getLocal<Certification[]>(LS_KEYS.CERTIFICATIONS, initialCertifications);
    setLocal(LS_KEYS.CERTIFICATIONS, list.filter(c => c.id !== id));
  },

  // -------------------------------------------------------------
  // ACHIEVEMENTS
  // -------------------------------------------------------------
  async getAchievements(): Promise<Achievement[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'achievements'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: Achievement[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as Achievement) }));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getAchievements failed, fallback to local', err);
      }
    }
    return getLocal<Achievement[]>(LS_KEYS.ACHIEVEMENTS, initialAchievements).sort((a, b) => a.order - b.order);
  },

  async createAchievement(ach: Omit<Achievement, 'id'>): Promise<Achievement> {
    const newId = `ach-${Date.now()}`;
    const newAch: Achievement = { ...ach, id: newId };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'achievements', newId), newAch);
    }
    const list = getLocal<Achievement[]>(LS_KEYS.ACHIEVEMENTS, initialAchievements);
    list.push(newAch);
    setLocal(LS_KEYS.ACHIEVEMENTS, list);
    return newAch;
  },

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'achievements', id), updates);
    }
    const list = getLocal<Achievement[]>(LS_KEYS.ACHIEVEMENTS, initialAchievements);
    const index = list.findIndex(a => a.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.ACHIEVEMENTS, list);
      return list[index];
    }
    throw new Error('Achievement entry not found');
  },

  async deleteAchievement(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'achievements', id));
    }
    const list = getLocal<Achievement[]>(LS_KEYS.ACHIEVEMENTS, initialAchievements);
    setLocal(LS_KEYS.ACHIEVEMENTS, list.filter(a => a.id !== id));
  },

  // -------------------------------------------------------------
  // GITHUB REPOSITORIES
  // -------------------------------------------------------------
  async getGithubRepos(): Promise<GithubRepo[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'githubRepositories'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: GithubRepo[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as GithubRepo) }));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getGithubRepos failed, fallback to local', err);
      }
    }
    return getLocal<GithubRepo[]>(LS_KEYS.GITHUB, initialGithubRepos).sort((a, b) => a.order - b.order);
  },

  async createGithubRepo(repo: Omit<GithubRepo, 'id'>): Promise<GithubRepo> {
    const newId = `repo-${Date.now()}`;
    const newRepo: GithubRepo = { ...repo, id: newId };
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'githubRepositories', newId), newRepo);
    }
    const list = getLocal<GithubRepo[]>(LS_KEYS.GITHUB, initialGithubRepos);
    list.push(newRepo);
    setLocal(LS_KEYS.GITHUB, list);
    return newRepo;
  },

  async updateGithubRepo(id: string, updates: Partial<GithubRepo>): Promise<GithubRepo> {
    if (isFirebaseConfigured && db) {
      await updateDoc(doc(db, 'githubRepositories', id), updates);
    }
    const list = getLocal<GithubRepo[]>(LS_KEYS.GITHUB, initialGithubRepos);
    const index = list.findIndex(r => r.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      setLocal(LS_KEYS.GITHUB, list);
      return list[index];
    }
    throw new Error('Repository entry not found');
  },

  async deleteGithubRepo(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      await deleteDoc(doc(db, 'githubRepositories', id));
    }
    const list = getLocal<GithubRepo[]>(LS_KEYS.GITHUB, initialGithubRepos);
    setLocal(LS_KEYS.GITHUB, list.filter(r => r.id !== id));
  },

  async fetchGithubApiRepos(username: string): Promise<GithubRepo[]> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
      if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`);
      const data = await response.json();
      return data.map((item: any, index: number) => ({
        id: `gh-${item.id}`,
        name: item.name,
        fullName: item.full_name,
        description: item.description || 'No description provided.',
        htmlUrl: item.html_url,
        language: item.language || 'Code',
        starsCount: item.stargazers_count,
        forksCount: item.forks_count,
        topics: item.topics || [],
        isFeatured: index < 3,
        order: index + 1,
        updatedAt: item.updated_at
      }));
    } catch (err) {
      console.warn('Failed to fetch from GitHub public API, returning current repos', err);
      return this.getGithubRepos();
    }
  },

  // -------------------------------------------------------------
  // CONTACT MESSAGES
  // -------------------------------------------------------------
  async getMessages(): Promise<ContactMessage[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const list: ContactMessage[] = [];
          querySnapshot.forEach((doc) => list.push({ id: doc.id, ...(doc.data() as ContactMessage) }));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getMessages failed, fallback to local', err);
      }
    }
    return getLocal<ContactMessage[]>(LS_KEYS.MESSAGES, []);
  },

  async sendMessage(message: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
    const newMessage: ContactMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'messages'), {
          ...newMessage,
          timestamp: new Date()
        });
        newMessage.id = docRef.id;
      } catch (err) {
        console.warn('Failed to post message to Firestore, storing in local fallback', err);
      }
    }

    const list = getLocal<ContactMessage[]>(LS_KEYS.MESSAGES, []);
    list.unshift(newMessage);
    setLocal(LS_KEYS.MESSAGES, list);
    return newMessage;
  },

  async markMessageRead(id: string, read: boolean = true): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'messages', id), { read });
      } catch (err) {
        console.warn('Firestore update message status failed', err);
      }
    }
    const list = getLocal<ContactMessage[]>(LS_KEYS.MESSAGES, []);
    const item = list.find(m => m.id === id);
    if (item) {
      item.read = read;
      setLocal(LS_KEYS.MESSAGES, list);
    }
  },

  async deleteMessage(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (err) {
        console.warn('Firestore delete message failed', err);
      }
    }
    const list = getLocal<ContactMessage[]>(LS_KEYS.MESSAGES, []);
    setLocal(LS_KEYS.MESSAGES, list.filter(m => m.id !== id));
  },

  // -------------------------------------------------------------
  // SETTINGS
  // -------------------------------------------------------------
  async getSettings(): Promise<SiteSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'site'));
        if (docSnap.exists()) {
          return docSnap.data() as SiteSettings;
        }
      } catch (err) {
        console.warn('Firestore getSettings failed, fallback to local', err);
      }
    }
    return getLocal<SiteSettings>(LS_KEYS.SETTINGS, initialSettings);
  },

  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, 'settings', 'site'), settings, { merge: true });
    }
    setLocal(LS_KEYS.SETTINGS, settings);
    return settings;
  },

  // -------------------------------------------------------------
  // ONE-CLICK FIRESTORE SEEDER
  // -------------------------------------------------------------
  async seedInitialDataToFirestore(): Promise<{ success: boolean; message: string }> {
    if (!isFirebaseConfigured || !db) {
      // Re-seed local storage
      setLocal(LS_KEYS.PROFILE, initialProfile);
      setLocal(LS_KEYS.PROJECTS, initialProjects);
      setLocal(LS_KEYS.SKILLS, initialSkills);
      setLocal(LS_KEYS.EXPERIENCE, initialExperience);
      setLocal(LS_KEYS.EDUCATION, initialEducation);
      setLocal(LS_KEYS.CERTIFICATIONS, initialCertifications);
      setLocal(LS_KEYS.ACHIEVEMENTS, initialAchievements);
      setLocal(LS_KEYS.GITHUB, initialGithubRepos);
      setLocal(LS_KEYS.SETTINGS, initialSettings);
      return { 
        success: true, 
        message: 'Local store successfully seeded with comprehensive portfolio data! (Configure Firebase in .env to sync directly to cloud)' 
      };
    }

    try {
      // 1. Profile
      await setDoc(doc(db, 'profiles', 'main'), initialProfile);

      // 2. Projects
      for (const proj of initialProjects) {
        const id = proj.id || `proj-${proj.slug}`;
        await setDoc(doc(db, 'projects', id), proj);
      }

      // 3. Skills
      for (const skill of initialSkills) {
        const id = skill.id || `sk-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        await setDoc(doc(db, 'skills', id), skill);
      }

      // 4. Experience
      for (const exp of initialExperience) {
        const id = exp.id || `exp-${Date.now()}`;
        await setDoc(doc(db, 'experience', id), exp);
      }

      // 5. Education
      for (const edu of initialEducation) {
        const id = edu.id || `edu-${Date.now()}`;
        await setDoc(doc(db, 'education', id), edu);
      }

      // 6. Certifications
      for (const cert of initialCertifications) {
        const id = cert.id || `cert-${Date.now()}`;
        await setDoc(doc(db, 'certifications', id), cert);
      }

      // 7. Achievements
      for (const ach of initialAchievements) {
        const id = ach.id || `ach-${Date.now()}`;
        await setDoc(doc(db, 'achievements', id), ach);
      }

      // 8. GitHub
      for (const repo of initialGithubRepos) {
        const id = repo.id || `repo-${repo.name}`;
        await setDoc(doc(db, 'githubRepositories', id), repo);
      }

      // 9. Settings
      await setDoc(doc(db, 'settings', 'site'), initialSettings);

      return {
        success: true,
        message: 'Successfully seeded all portfolio data (Profile, 5 Case Studies, 29 Skills, Education, Certifications, Achievements, Settings) into Firebase Firestore!'
      };
    } catch (err: any) {
      console.error('Error seeding to Firestore:', err);
      return {
        success: false,
        message: `Failed to seed to Firestore: ${err?.message || 'Check Firestore rules and authentication'}`
      };
    }
  }
};
