import React, { useState } from 'react';
import type { Project } from '../utils/storage';
import { storage } from '../utils/storage';
import { ShareModal } from './ShareModal';
import '../styles/ProjectManager.css';

interface ProjectManagerProps {
  currentProject: Project | null;
  onProjectChange: (project: Project) => void;
  onCreateProject: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  currentProject,
  onProjectChange,
  onCreateProject,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [shareProject, setShareProject] = useState<Project | null>(null);

  const projects = storage.getAllProjects();

  const handleRename = (project: Project, newProjectName: string) => {
    if (newProjectName.trim()) {
      storage.saveProject({ ...project, name: newProjectName });
      if (currentProject?.id === project.id) {
        onProjectChange({ ...project, name: newProjectName });
      }
    }
    setRenameId(null);
    setNewName('');
  };

  const handleDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      storage.deleteProject(projectId);
      if (currentProject?.id === projectId) {
        const remainingProjects = storage.getAllProjects();
        if (remainingProjects.length > 0) {
          onProjectChange(remainingProjects[0]);
        }
      }
    }
  };

  return (
    <>
      <div className="project-manager">
        <div className="project-header">
          <div className="current-project">
            <span className="label">Project:</span>
            <span className="name">{currentProject?.name || 'No Project'}</span>
          </div>
          <div className="project-actions">
            <button className="btn-icon" onClick={onCreateProject} title="New Project">
              ➕
            </button>
            <button
              className="btn-icon"
              onClick={() => setShareProject(currentProject)}
              title="Share Project"
              disabled={!currentProject}
            >
              🔗
            </button>
            <div className="dropdown">
              <button
                className="btn-icon"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title="More options"
              >
                ⋮
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {projects.map((project) => (
                    <div key={project.id} className="project-item">
                      {renameId === project.id ? (
                        <div className="rename-input">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(project, newName);
                              } else if (e.key === 'Escape') {
                                setRenameId(null);
                              }
                            }}
                            autoFocus
                          />
                          <button onClick={() => handleRename(project, newName)} className="btn-small">
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            onClick={() => {
                              onProjectChange(project);
                              setIsDropdownOpen(false);
                            }}
                            className={currentProject?.id === project.id ? 'active' : ''}
                          >
                            {project.name}
                          </span>
                          <div className="item-actions">
                            <button
                              onClick={() => {
                                setRenameId(project.id);
                                setNewName(project.name);
                              }}
                              className="btn-small"
                              title="Rename"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="btn-small"
                              title="Delete"
                            >
                              🗑
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareModal project={shareProject} onClose={() => setShareProject(null)} />
    </>
  );
};
