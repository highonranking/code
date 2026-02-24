import React, { useState, useEffect, useRef } from 'react';
import { codeSuggestions, type CodeSuggestion } from '../utils/codeSuggestions';
import '../styles/CodeSuggestions.css';

interface CodeSuggestionsProps {
  code: string;
  language: 'javascript' | 'html' | 'css';
  onSelectSuggestion: (suggestion: CodeSuggestion) => void;
  visible: boolean;
  position?: { top: number; left: number };
}

export const CodeSuggestionsDropdown: React.FC<CodeSuggestionsProps> = ({
  code,
  language,
  onSelectSuggestion,
  visible,
  position = { top: 0, left: 0 },
}) => {
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && code) {
      const newSuggestions = codeSuggestions.getSuggestions(code, language);
      setSuggestions(newSuggestions);
      setSelectedIndex(0);
    }
  }, [code, language, visible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!visible || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        onSelectSuggestion(suggestions[selectedIndex]);
        break;
      case 'Escape':
        e.preventDefault();
        break;
    }
  };

  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      ref={listRef}
      className="code-suggestions-dropdown"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="suggestions-list">
        {suggestions.map((suggestion, idx) => (
          <div
            key={`${suggestion.label}-${idx}`}
            className={`suggestion-item ${idx === selectedIndex ? 'active' : ''}`}
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <span className={`suggestion-icon suggestion-kind-${suggestion.kind}`}>
              {suggestion.kind === 'keyword' && '⚡'}
              {suggestion.kind === 'function' && '𝒇'}
              {suggestion.kind === 'variable' && '𝑣'}
              {suggestion.kind === 'tag' && '🏷️'}
              {suggestion.kind === 'attribute' && '📌'}
              {suggestion.kind === 'property' && '🎨'}
            </span>
            <div className="suggestion-content">
              <div className="suggestion-label">{suggestion.label}</div>
              {suggestion.documentation && (
                <div className="suggestion-docs">{suggestion.documentation}</div>
              )}
              {suggestion.detail && (
                <div className="suggestion-detail">{suggestion.detail}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
