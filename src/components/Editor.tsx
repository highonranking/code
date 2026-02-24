import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { CodeFile } from '../utils/storage';
import { CodeSuggestionsDropdown } from './CodeSuggestions';
import type { CodeSuggestion } from '../utils/codeSuggestions';
import { codeSuggestions } from '../utils/codeSuggestions';
import '../styles/Editor.css';

interface EditorProps {
  file: CodeFile | null;
  onCodeChange: (code: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ file, onCodeChange }) => {
  const [code, setCode] = useState(file?.code || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update code when file changes
  useEffect(() => {
    setCode(file?.code || '');
  }, [file?.id]);

  const handleCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newCode = e.target.value;
      setCode(newCode);
      onCodeChange(newCode);

      // Show suggestions after typing
      const lastChar = newCode[newCode.length - 1];
      if (/[a-zA-Z0-9_]/.test(lastChar)) {
        setShowSuggestions(true);
        calculateSuggestionPosition();
      } else {
        setShowSuggestions(false);
      }
    },
    [onCodeChange],
  );

  const calculateSuggestionPosition = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const lines = code.split('\n');
    const lineCount = lines.length;
    const lineHeight = 19; // Approximate line height

    // Calculate position based on scroll and cursor position
    const top = textarea.scrollTop + lineHeight * lineCount + 20;
    const left = textarea.scrollLeft + 20;

    setSuggestionPos({ top, left });
  };

  const handleSelectSuggestion = useCallback((suggestion: CodeSuggestion) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const lines = code.split('\n');
    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/(\w+)$/);

    if (!match) {
      setShowSuggestions(false);
      return;
    }

    const prefix = match[1];
    const prefixLength = prefix.length;

    // Remove the prefix and insert the suggestion
    const newCode = code.slice(0, -prefixLength) + suggestion.insertText;
    setCode(newCode);
    onCodeChange(newCode);
    setShowSuggestions(false);

    // Focus back on textarea
    textarea.focus();
  }, [code, onCodeChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const char = e.key;

      // Handle Tab for indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        const newCode = code.slice(0, start) + '  ' + code.slice(end);
        setCode(newCode);
        onCodeChange(newCode);

        // Move cursor after the inserted spaces
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
        return;
      }

      // Auto-close brackets, quotes, etc
      const closingChar = codeSuggestions.getAutoClosePair(char);
      if (closingChar && start === end) {
        // Check if we should skip auto-closing
        if (!codeSuggestions.shouldSkipAutoClose(code, start, closingChar)) {
          e.preventDefault();
          const newCode = code.slice(0, start) + char + closingChar + code.slice(start);
          setCode(newCode);
          onCodeChange(newCode);

          // Move cursor between the brackets
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          }, 0);
          return;
        }
      }

      // Auto-indent on Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        const indent = codeSuggestions.getAutoIndent(code);
        const newCode = code.slice(0, start) + '\n' + ' '.repeat(indent) + code.slice(end);
        setCode(newCode);
        onCodeChange(newCode);

        // Move cursor to new line with proper indentation
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent;
        }, 0);
        return;
      }

      // Close suggestions on Escape
      if (e.key === 'Escape') {
        setShowSuggestions(false);
      }

      // Hide suggestions when pressing non-alphanumeric keys
      if (!/[a-zA-Z0-9_]/.test(e.key) && e.key !== 'Backspace') {
        setShowSuggestions(false);
      }
    },
    [code, onCodeChange],
  );

  if (!file) {
    return (
      <div className="editor-container">
        <div className="editor-placeholder">Select or create a file to start editing</div>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h3>{file.name}</h3>
        <span className="file-language">{file.language.toUpperCase()}</span>
      </div>
      <div className="editor-wrapper">
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${file.language} code here...\nPress Ctrl+Space for suggestions`}
          spellCheck={false}
        />
        <CodeSuggestionsDropdown
          code={code}
          language={file.language}
          onSelectSuggestion={handleSelectSuggestion}
          visible={showSuggestions}
          position={suggestionPos}
        />
      </div>
    </div>
  );
};
