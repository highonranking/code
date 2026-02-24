import React from 'react';
import type { CodeFile, Project } from '../utils/storage';
import '../styles/FileExplorer.css';

interface FileExplorerProps {
  project: Project | null;
  selectedFile: CodeFile | null;
  onSelectFile: (file: CodeFile) => void;
  onCreateFile: (language: 'javascript' | 'html' | 'css') => void;
  onDeleteFile: (fileId: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  project,
  selectedFile,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
}) => {
  return (
    <div className="file-explorer-container">
      <div className="explorer-header">
        <h2>Files</h2>
        <div className="explorer-actions">
          <button className="btn-small" onClick={() => onCreateFile('javascript')} title="New JS file">
            JS
          </button>
          <button className="btn-small" onClick={() => onCreateFile('html')} title="New HTML file">
            HTML
          </button>
          <button className="btn-small" onClick={() => onCreateFile('css')} title="New CSS file">
            CSS
          </button>
        </div>
      </div>

      <div className="file-list">
        {!project || project.files.length === 0 ? (
          <div className="empty-state">No files yet. Create one to get started!</div>
        ) : (
          project.files.map((file) => (
            <div
              key={file.id}
              className={`file-item ${selectedFile?.id === file.id ? 'active' : ''}`}
              onClick={() => onSelectFile(file)}
            >
              <div className="file-info">
                <span className="file-icon">
                  {file.language === 'javascript' && '📄'}
                  {file.language === 'html' && '🔷'}
                  {file.language === 'css' && '🎨'}
                </span>
                <span className="file-name">{file.name}</span>
              </div>
              <button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.id);
                }}
                title="Delete file"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
