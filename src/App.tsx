import { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { FileExplorer } from './components/FileExplorer';
import { Preview } from './components/Preview';
import { ProjectManager } from './components/ProjectManager';
import { storage, type Project, type CodeFile } from './utils/storage';
import './App.css';

function App() {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    // Check if this is a shared URL (e.g., /s/abhinav)
    const pathMatch = window.location.pathname.match(/^\/s\/([a-zA-Z0-9_-]+)$/);
    
    if (pathMatch) {
      // Load the shared project
      const shareName = pathMatch[1];
      setIsSharedView(true);
      fetch(`/api/s/${shareName}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            console.error('Shared project not found:', data.error);
            alert('Shared project not found');
            return;
          }
          setCurrentProject(data);
          // Don't save to localStorage - this is read-only mode
        })
        .catch(err => {
          console.error('Failed to load shared project:', err);
          alert('Failed to load shared project');
        });
      return;
    }

    // Load or create initial project
    let project = storage.getCurrentProject();
    if (!project) {
      const projects = storage.getAllProjects();
      if (projects.length === 0) {
        // Create a default project
        project = {
          id: `project-${Date.now()}`,
          name: 'My First Project',
          files: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        storage.saveProject(project);
      } else {
        project = projects[0];
      }
    }
    setCurrentProject(project);
    storage.setCurrentProject(project);
  }, []);

  const handleCreateProject = () => {
    const projectName = prompt('Enter project name:', 'New Project');
    if (projectName) {
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: projectName,
        files: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      storage.saveProject(newProject);
      setCurrentProject(newProject);
      storage.setCurrentProject(newProject);
      setSelectedFile(null);
    }
  };

  const handleProjectChange = (project: Project) => {
    setCurrentProject(project);
    storage.setCurrentProject(project);
    setSelectedFile(null);
  };

  const handleSelectFile = (file: CodeFile) => {
    setSelectedFile(file);
  };

  const handleCreateFile = (language: 'javascript' | 'html' | 'css') => {
    if (!currentProject) return;

    const fileNames = {
      javascript: 'script.js',
      html: 'index.html',
      css: 'style.css',
    };

    const baseName = fileNames[language];
    const existingCount = currentProject.files.filter(
      (f) => f.language === language,
    ).length;

    const fileName = existingCount > 0
      ? baseName.replace(/(.+?)(\.\w+)$/, `$1_${existingCount}$2`)
      : baseName;

    try {
      const newFile = storage.addFile(currentProject.id, {
        name: fileName,
        code: '',
        language,
      });

      const updatedProject = storage.getProjectById(currentProject.id);
      if (updatedProject) {
        setCurrentProject(updatedProject);
        storage.setCurrentProject(updatedProject);
        setSelectedFile(newFile);
      }
    } catch (error) {
      console.error('Failed to create file:', error);
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (!currentProject) return;

    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        storage.deleteFile(currentProject.id, fileId);
        const updatedProject = storage.getProjectById(currentProject.id);
        if (updatedProject) {
          setCurrentProject(updatedProject);
          storage.setCurrentProject(updatedProject);
          if (selectedFile?.id === fileId) {
            setSelectedFile(updatedProject.files[0] || null);
          }
        }
      } catch (error) {
        console.error('Failed to delete file:', error);
      }
    }
  };

  const handleCodeChange = (code: string) => {
    if (!currentProject || !selectedFile) return;

    try {
      storage.updateFile(currentProject.id, selectedFile.id, { code });
      const updatedProject = storage.getProjectById(currentProject.id);
      if (updatedProject) {
        setCurrentProject(updatedProject);
        storage.setCurrentProject(updatedProject);

        const updatedFile = updatedProject.files.find((f) => f.id === selectedFile.id);
        if (updatedFile) {
          setSelectedFile(updatedFile);
        }
      }
    } catch (error) {
      console.error('Failed to update file:', error);
    }
  };

  if (!currentProject) {
    return (
      <div className="app">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Loading JS Compiler...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {isSharedView && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 1000,
          fontWeight: 'bold'
        }}>
          📋 READ-ONLY SHARED VIEW
        </div>
      )}
      <ProjectManager
        currentProject={currentProject}
        onProjectChange={handleProjectChange}
        onCreateProject={handleCreateProject}
      />
      <div className="main-container">
        <FileExplorer
          project={currentProject}
          selectedFile={selectedFile}
          onSelectFile={handleSelectFile}
          onCreateFile={handleCreateFile}
          onDeleteFile={handleDeleteFile}
        />
        <div className="editor-preview">
          <Editor
            file={selectedFile}
            onCodeChange={handleCodeChange}
          />
          <Preview project={currentProject} />
        </div>
      </div>
    </div>
  );
}

export default App;
