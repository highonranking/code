// Code suggestions and completion for JavaScript, HTML, and CSS

export interface CodeSuggestion {
  label: string;
  kind: 'keyword' | 'function' | 'variable' | 'tag' | 'attribute' | 'property';
  insertText: string;
  documentation?: string;
  detail?: string;
}

// Auto-completion pairs for brackets, quotes, etc
const AUTO_COMPLETE_PAIRS: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  '"': '"',
  "'": "'",
  '`': '`',
  '<': '>',
};

const JS_KEYWORDS = [
  'const', 'let', 'var', 'function', 'class', 'extends', 'async', 'await',
  'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue',
  'try', 'catch', 'finally', 'throw', 'return', 'new', 'this', 'super',
  'import', 'export', 'default', 'from', 'typeof', 'instanceof', 'delete',
  'void', 'null', 'undefined', 'true', 'false', 'NaN', 'Infinity'
];

const JS_FUNCTIONS = [
  { label: 'console.log', insertText: 'console.log($0)', doc: 'Log to console' },
  { label: 'console.error', insertText: 'console.error($0)', doc: 'Log error' },
  { label: 'console.warn', insertText: 'console.warn($0)', doc: 'Log warning' },
  { label: 'console.table', insertText: 'console.table($0)', doc: 'Log as table' },
  { label: 'document.getElementById', insertText: 'document.getElementById("$0")', doc: 'Get element by ID' },
  { label: 'document.querySelector', insertText: 'document.querySelector("$0")', doc: 'Query selector' },
  { label: 'document.querySelectorAll', insertText: 'document.querySelectorAll("$0")', doc: 'Query all matching' },
  { label: 'addEventListener', insertText: 'addEventListener("$0", function() { })', doc: 'Add event listener' },
  { label: 'fetch', insertText: 'fetch("$0")', doc: 'Fetch API' },
  { label: 'JSON.stringify', insertText: 'JSON.stringify($0)', doc: 'Convert to JSON' },
  { label: 'JSON.parse', insertText: 'JSON.parse($0)', doc: 'Parse JSON' },
  { label: 'Array.map', insertText: 'map(item => $0)', doc: 'Map array' },
  { label: 'Array.filter', insertText: 'filter(item => $0)', doc: 'Filter array' },
  { label: 'Array.reduce', insertText: 'reduce((acc, item) => $0, 0)', doc: 'Reduce array' },
  { label: 'Array.forEach', insertText: 'forEach(item => { })', doc: 'For each item' },
  { label: 'parseInt', insertText: 'parseInt($0)', doc: 'Parse integer' },
  { label: 'parseFloat', insertText: 'parseFloat($0)', doc: 'Parse float' },
  { label: 'isNaN', insertText: 'isNaN($0)', doc: 'Is not a number' },
];

const HTML_TAGS = [
  { label: 'div', insertText: '<div>$0</div>', doc: 'Division' },
  { label: 'p', insertText: '<p>$0</p>', doc: 'Paragraph' },
  { label: 'h1', insertText: '<h1>$0</h1>', doc: 'Heading 1' },
  { label: 'h2', insertText: '<h2>$0</h2>', doc: 'Heading 2' },
  { label: 'h3', insertText: '<h3>$0</h3>', doc: 'Heading 3' },
  { label: 'span', insertText: '<span>$0</span>', doc: 'Inline container' },
  { label: 'button', insertText: '<button>$0</button>', doc: 'Button' },
  { label: 'input', insertText: '<input type="$0" />', doc: 'Input field' },
  { label: 'textarea', insertText: '<textarea>$0</textarea>', doc: 'Text area' },
  { label: 'a', insertText: '<a href="$0">Link</a>', doc: 'Hyperlink' },
  { label: 'ul', insertText: '<ul>\n  <li>$0</li>\n</ul>', doc: 'Unordered list' },
  { label: 'ol', insertText: '<ol>\n  <li>$0</li>\n</ol>', doc: 'Ordered list' },
  { label: 'li', insertText: '<li>$0</li>', doc: 'List item' },
  { label: 'form', insertText: '<form>\n  $0\n</form>', doc: 'Form' },
  { label: 'img', insertText: '<img src="$0" alt="" />', doc: 'Image' },
  { label: 'table', insertText: '<table>\n  <tr><td>$0</td></tr>\n</table>', doc: 'Table' },
  { label: 'header', insertText: '<header>$0</header>', doc: 'Header section' },
  { label: 'footer', insertText: '<footer>$0</footer>', doc: 'Footer section' },
  { label: 'section', insertText: '<section>$0</section>', doc: 'Section' },
  { label: 'nav', insertText: '<nav>$0</nav>', doc: 'Navigation' },
];

const CSS_PROPERTIES = [
  { label: 'color', insertText: 'color: $0;', doc: 'Text color' },
  { label: 'background-color', insertText: 'background-color: $0;', doc: 'Background color' },
  { label: 'padding', insertText: 'padding: $0px;', doc: 'Padding' },
  { label: 'margin', insertText: 'margin: $0px;', doc: 'Margin' },
  { label: 'font-size', insertText: 'font-size: $0px;', doc: 'Font size' },
  { label: 'font-weight', insertText: 'font-weight: $0;', doc: 'Font weight' },
  { label: 'text-align', insertText: 'text-align: $0;', doc: 'Text alignment' },
  { label: 'display', insertText: 'display: $0;', doc: 'Display type' },
  { label: 'flex', insertText: 'display: flex;', doc: 'Flexbox' },
  { label: 'grid', insertText: 'display: grid;', doc: 'CSS Grid' },
  { label: 'width', insertText: 'width: $0%;', doc: 'Width' },
  { label: 'height', insertText: 'height: $0px;', doc: 'Height' },
  { label: 'border', insertText: 'border: 1px solid $0;', doc: 'Border' },
  { label: 'border-radius', insertText: 'border-radius: $0px;', doc: 'Border radius' },
  { label: 'cursor', insertText: 'cursor: $0;', doc: 'Cursor style' },
  { label: 'transition', insertText: 'transition: $0 0.3s ease;', doc: 'Transition' },
  { label: 'opacity', insertText: 'opacity: $0;', doc: 'Opacity' },
  { label: 'transform', insertText: 'transform: $0;', doc: 'Transform' },
  { label: 'box-shadow', insertText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1);', doc: 'Box shadow' },
];

const CSS_VALUES = {
  display: ['flex', 'grid', 'block', 'inline', 'inline-block', 'none'],
  'font-weight': ['100', '300', '400', '600', '700', '900', 'bold', 'normal'],
  'text-align': ['left', 'right', 'center', 'justify'],
  cursor: ['pointer', 'default', 'text', 'move', 'wait', 'help'],
  position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
};

export const codeSuggestions = {
  getJavaScriptSuggestions: (prefix: string): CodeSuggestion[] => {
    const suggestions: CodeSuggestion[] = [];

    // Keywords
    JS_KEYWORDS.filter(k => k.startsWith(prefix)).forEach(keyword => {
      suggestions.push({
        label: keyword,
        kind: 'keyword',
        insertText: keyword,
        detail: 'JavaScript keyword',
      });
    });

    // Functions and methods
    JS_FUNCTIONS.filter(f => f.label.includes(prefix)).forEach(func => {
      suggestions.push({
        label: func.label,
        kind: 'function',
        insertText: func.insertText,
        documentation: func.doc,
      });
    });

    return suggestions.slice(0, 10); // Return top 10
  },

  getHTMLSuggestions: (prefix: string): CodeSuggestion[] => {
    const suggestions: CodeSuggestion[] = [];

    HTML_TAGS.filter(t => t.label.startsWith(prefix)).forEach(tag => {
      suggestions.push({
        label: tag.label,
        kind: 'tag',
        insertText: tag.insertText,
        documentation: tag.doc,
      });
    });

    return suggestions.slice(0, 10);
  },

  getCSSSuggestions: (prefix: string): CodeSuggestion[] => {
    const suggestions: CodeSuggestion[] = [];

    CSS_PROPERTIES.filter(p => p.label.startsWith(prefix)).forEach(prop => {
      suggestions.push({
        label: prop.label,
        kind: 'property',
        insertText: prop.insertText,
        documentation: prop.doc,
      });
    });

    // Check for property values
    Object.entries(CSS_VALUES).forEach(([prop, values]) => {
      values.filter(v => v.startsWith(prefix)).forEach(value => {
        suggestions.push({
          label: value,
          kind: 'property',
          insertText: value,
          detail: `Value for ${prop}`,
        });
      });
    });

    return suggestions.slice(0, 10);
  },

  // Get suggestions based on language and current word
  getSuggestions: (code: string, language: 'javascript' | 'html' | 'css'): CodeSuggestion[] => {
    // Extract the word being typed (last word before cursor)
    const lines = code.split('\n');
    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/(\w+)$/);
    const prefix = match ? match[1] : '';

    if (!prefix || prefix.length < 2) return [];

    switch (language) {
      case 'javascript':
        return codeSuggestions.getJavaScriptSuggestions(prefix);
      case 'html':
        return codeSuggestions.getHTMLSuggestions(prefix);
      case 'css':
        return codeSuggestions.getCSSSuggestions(prefix);
      default:
        return [];
    }
  },

  // Autocomplete: complete the word based on context
  autocomplete: (code: string, language: 'javascript' | 'html' | 'css'): string | null => {
    const suggestions = codeSuggestions.getSuggestions(code, language);
    if (suggestions.length === 0) return null;

    // Return the first suggestion's insert text
    let insertText = suggestions[0].insertText;

    // Replace $0 placeholder with cursor position
    insertText = insertText.replace(/\$0/g, '');

    return insertText;
  },

  // Auto-complete pairs like brackets, quotes, etc
  getAutoClosePair: (character: string): string | null => {
    return AUTO_COMPLETE_PAIRS[character] || null;
  },

  // Check if we should skip auto-closing (if next char is already the closing char)
  shouldSkipAutoClose: (code: string, cursorPos: number, closingChar: string): boolean => {
    if (cursorPos >= code.length) return false;
    return code[cursorPos] === closingChar;
  },

  // Auto-indent based on language
  getAutoIndent: (code: string): number => {
    const lines = code.split('\n');
    const lastLine = lines[lines.length - 1];
    const match = lastLine.match(/^\s*/);
    const currentIndent = match ? match[0].length : 0;

    // Check if we need to increase indent
    if (/[{([`]$/.test(lastLine.trim())) {
      return currentIndent + 2;
    }

    return currentIndent;
  },
};
