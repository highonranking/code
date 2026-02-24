import React, { useEffect, useState } from 'react';
import type { Project } from '../utils/storage';
import { compiler } from '../utils/compiler';
import '../styles/Preview.css';

interface PreviewProps {
  project: Project | null;
}

export const Preview: React.FC<PreviewProps> = ({ project }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    executeCode();
  }, [project]);

  const executeCode = async () => {
    if (!project) {
      setLogs([]);
      setError(null);
      return;
    }

    const jsFile = project.files.find((f) => f.language === 'javascript');
    const htmlFile = project.files.find((f) => f.language === 'html');
    const cssFile = project.files.find((f) => f.language === 'css');

    const result = await compiler.executeCode(jsFile?.code || '', htmlFile?.code || '', cssFile?.code || '');

    setLogs(result.logs);
    setError(result.error);
    setIframeKey((prev) => prev + 1);
  };

  const handleExecute = () => {
    setLogs([]);
    setError(null);
    executeCode();
  };

  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2>Output</h2>
        <button className="btn-primary" onClick={handleExecute}>
          ▶ Run Code
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="preview-output">
        <div className="logs-section">
          <h3>Console Output</h3>
          <div className="logs-content">
            {logs.length === 0 ? (
              <div className="empty-logs">No output yet. Run your code to see output here.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="log-line">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="preview-iframe">
          <h3>Live Preview</h3>
          <iframe key={iframeKey} className="preview-frame" title="Code Preview" sandbox="allow-scripts" />
        </div>
      </div>
    </div>
  );
};
