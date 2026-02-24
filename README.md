# JS Compiler - Full Stack JavaScript Code Editor

A modern, fully-featured JavaScript compiler built with React and TypeScript. Write, test, and share JavaScript code with an intuitive IDE-like interface. All files are automatically saved to your browser's local storage, so your code is never lost.

## Features

✨ **Code Editing**
- Syntax-highlighted editor for JavaScript, HTML, and CSS
- Real-time code compilation and execution
- Multiple file support with file explorer

💾 **Local Storage**
- Automatic persistence of all code to browser's local storage
- Never lose your work - code survives page refreshes and browser restarts
- Project-based file organization

🔗 **File Sharing**
- Share code with custom URLs (e.g., `localhost:3000/share/my-project`)
- Same-network access for easy collaboration
- Copy shareable links with one click

🎨 **Live Preview**
- Real-time HTML/CSS preview in iframe
- Console output for debugging JavaScript
- Instant feedback on code execution

📁 **Project Management**
- Create multiple projects
- Rename and organize projects
- Quick file operations (create, delete, select)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project:**
```bash
cd /Users/abhinav/Documents/js-compiler
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Editor.tsx      # Code editor component
│   ├── FileExplorer.tsx # File management
│   ├── Preview.tsx     # Live preview & console
│   └── ProjectManager.tsx # Project switcher
├── hooks/              # Custom React hooks
│   ├── useFileSharing.ts # Sharing functionality
│   └── useLoadSharedProject.ts # Load shared projects
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage management
│   └── compiler.ts     # Code execution engine
├── styles/             # Component stylesheets
├── App.tsx             # Main application
├── server.ts           # Express server for sharing
└── main.tsx            # Entry point
```

## Architecture

### Frontend (React + TypeScript)
- **Editor**: Monaco-like textarea editor with syntax highlighting
- **FileExplorer**: Manages multiple code files per project
- **Preview**: Displays live HTML/CSS preview and console output
- **Storage**: LocalStorage hook for persistent file management

### Backend (Express.js)
- RESTful API endpoints for file sharing
- CORS-enabled for same-network access
- In-memory project storage (can be upgraded to database)

### Code Execution
- Sandboxed iframe execution for HTML/CSS/JS
- Console output capturing
- Error handling and logging

## Usage Guide

### Creating a Project
1. Click the **➕** button in the project header
2. Enter a project name
3. Start creating files

### Creating Files
1. Click **JS**, **HTML**, or **CSS** buttons in the file explorer
2. Choose file type to create
3. Edit in the main editor

### Running Code
1. Write your code in the editor
2. Click **▶ Run Code** button
3. View output in the console and preview areas

### Sharing Code
1. Click the **⋮** button in the project header
2. Select the project you want to share
3. Click the **🔗** button
4. Share the generated URL with others on the same network

### Local Storage Features
- All projects and files are auto-saved to `localStorage`
- Data persists across browser sessions
- No backend database required for basic functionality

## API Endpoints

### POST `/api/share`
Share a project with custom name

**Request:**
```json
{
  "projectId": "project-123",
  "project": { /* project data */ },
  "customName": "my-awesome-project"
}
```

**Response:**
```json
{
  "success": true,
  "shareUrl": "http://localhost:3001/share/my-awesome-project",
  "shareId": "my-awesome-project"
}
```

### GET `/api/share/:shareId`
Retrieve a shared project

### GET `/api/share-check/:shareId`
Check if a share ID is available

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save (auto-saved) |
| `Tab` | Insert tab (2 spaces) |
| `Escape` | Cancel dialogs |
| `Enter` (in rename) | Save name |

## Browser Storage Limits

- Chrome/Firefox/Safari: ~5-10MB per origin
- Sufficient for hundreds of code files
- Monitor with browser DevTools → Application → Local Storage

## Troubleshooting

### Code not running?
- Check console output for syntax errors
- Ensure HTML elements exist before JS references them
- Use `console.log()` for debugging

### Files disappearing?
- Check browser DevTools → Application → Storage
- Ensure localStorage is not disabled
- Try clearing cache and restarting browser

### Sharing not working?
- Ensure both devices are on same network
- Check if port 3001 is not blocked by firewall
- Try using IP address instead of localhost

## Future Enhancements

- [ ] Syntax highlighting in editor
- [ ] Code formatting (Prettier)
- [ ] Collaborative editing
- [ ] Database backend for sharing
- [ ] Code templates and snippets
- [ ] Export/import projects
- [ ] Version history/git-like tracking

## Technologies Used

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Express.js, Node.js
- **Storage**: Browser LocalStorage API
- **Styling**: CSS3 with CSS Variables
- **HTTP**: Axios for API calls

## License

MIT
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
