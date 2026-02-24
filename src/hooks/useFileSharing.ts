import { useState, useCallback } from 'react';
import axios from 'axios';
import type { Project } from '../utils/storage';

interface ShareResponse {
  success: boolean;
  shareUrl: string;
  shareId: string;
}

export const useFileSharing = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const shareProject = useCallback(
    async (project: Project, customName?: string) => {
      setIsSharing(true);
      setShareError(null);
      setShareUrl(null);

      try {
        // Check if custom name is available
        if (customName) {
          const checkResponse = await axios.get(`/api/share-check/${customName}`);
          if (!checkResponse.data.available) {
            setShareError('This share name is already taken. Please choose another.');
            setIsSharing(false);
            return;
          }
        }

        // Share the project
        const response = await axios.post<ShareResponse>('/api/share', {
          projectId: project.id,
          project,
          customName,
        });

        setShareUrl(response.data.shareUrl);
      } catch (error) {
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : 'Failed to share project';
        setShareError(errorMessage);
      } finally {
        setIsSharing(false);
      }
    },
    [],
  );

  const copyToClipboard = useCallback(() => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
    }
  }, [shareUrl]);

  return {
    isSharing,
    shareError,
    shareUrl,
    shareProject,
    copyToClipboard,
  };
};
