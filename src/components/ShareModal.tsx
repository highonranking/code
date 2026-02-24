import React, { useState } from 'react';
import axios from 'axios';
import type { Project } from '../utils/storage';
import '../styles/ShareModal.css';

interface ShareModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ project, onClose }) => {
  const [shareName, setShareName] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!project) return null;

  const handleShare = async () => {
    if (!shareName.trim()) {
      setError('Please enter a share name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(`/api/share?shareName=${shareName}`, {
        project,
      });

      setShareUrl(response.data.shareUrl);
      setSuccess(true);
      setShareName('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to share project');
      } else {
        setError('An error occurred while sharing');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Your Code</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!success ? (
            <>
              <p className="share-intro">
                Share your code with a simple URL. Others on the same network can access it instantly.
              </p>

              <div className="share-form">
                <div className="form-group">
                  <label htmlFor="shareName">Choose a name for your share:</label>
                  <div className="input-wrapper">
                    <span className="base-url">
                      {window.location.origin.replace('http://', '').replace('https://', '')}/s/
                    </span>
                    <input
                      id="shareName"
                      type="text"
                      value={shareName}
                      onChange={(e) => {
                        setShareName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
                        setError('');
                      }}
                      placeholder="e.g., abhinav"
                      disabled={loading}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleShare();
                        }
                      }}
                    />
                  </div>
                  <p className="input-hint">
                    Use lowercase letters, numbers, underscores, or hyphens
                  </p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                  className="btn-share"
                  onClick={handleShare}
                  disabled={loading || !shareName.trim()}
                >
                  {loading ? 'Sharing...' : 'Share Now'}
                </button>
              </div>
            </>
          ) : (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h3>Code Shared Successfully!</h3>

              <div className="share-url-box">
                <p className="share-url-label">Share this URL with others:</p>
                <div className="share-url-display">
                  <code>{shareUrl}</code>
                  <button className="btn-copy" onClick={copyToClipboard}>
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="share-info">
                <p>
                  <strong>✓ Instantly accessible</strong> - No registration needed
                </p>
                <p>
                  <strong>✓ Same network only</strong> - Secure sharing
                </p>
                <p>
                  <strong>✓ Live code</strong> - Changes appear in real-time
                </p>
              </div>

              <button className="btn-new-share" onClick={() => {
                setSuccess(false);
                setShareUrl('');
                setShareName('');
                setError('');
              }}>
                Share Another Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
