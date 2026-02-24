import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../utils/storage';

interface LoadSharedProjectResult {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

export const useLoadSharedProject = (shareId: string | null): LoadSharedProjectResult => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareId) {
      setProject(null);
      setError(null);
      return;
    }

    const loadProject = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get<Project>(`/api/share/${shareId}`);
        setProject(response.data);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.error || err.message
          : 'Failed to load shared project';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [shareId]);

  return { project, loading, error };
};
