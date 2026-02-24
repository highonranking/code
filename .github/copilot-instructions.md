<!-- JS Compiler Project Instructions -->

## Project Overview
JS Compiler is a full-stack JavaScript IDE built with React and TypeScript. Features:
- Browser-based code editor for JS, HTML, CSS
- Automatic local storage persistence
- Same-network file sharing with custom URLs
- Live preview with console output
- Express backend for file sharing

## Key Files & Components

### Frontend Components
- `src/components/Editor.tsx` - Code editor textarea
- `src/components/FileExplorer.tsx` - File management UI
- `src/components/Preview.tsx` - Live preview & console
- `src/components/ProjectManager.tsx` - Project switcher

### Utilities & Hooks
- `src/utils/storage.ts` - LocalStorage management
- `src/utils/compiler.ts` - Code execution engine
- `src/hooks/useFileSharing.ts` - Sharing API hook
- `src/hooks/useLoadSharedProject.ts` - Load shared projects

### Styling
- `src/styles/Editor.css`
- `src/styles/FileExplorer.css`
- `src/styles/Preview.css`
- `src/styles/ProjectManager.css`

### Backend
- `src/server.ts` - Express server for sharing

### Configuration
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript settings
- `package.json` - Dependencies and scripts

## Development Workflow

### Start Development
```bash
npm run dev
```
Opens Vite dev server at http://localhost:5173

### For Full-Stack Development
```bash
npm run dev:all
```
Runs both Vite frontend and Express backend concurrently

### Build Production
```bash
npm run build
npm run preview
```

### Run Production Server
```bash
npm run start
```

## Architecture Notes

### Storage Strategy
- Uses browser `localStorage` API
- Key: `js-compiler-projects`
- Each project contains multiple files
- Auto-saves on every change

### Code Execution
- Creates sandboxed iframes for HTML/CSS/JS
- Captures console output with proxy
- Prevents global scope pollution

### Sharing Mechanism
- Express API stores projects in memory
- `/api/share` - POST to create share
- `/api/share/:shareId` - GET to retrieve
- Custom names for easy sharing

## Dependencies

### Core
- `react@^19.2.0`
- `react-dom@^19.2.0`

### Build Tools
- `vite@^7.3.1`
- `typescript@~5.9.3`
- `@vitejs/plugin-react@^5.1.1`

### Backend
- `express@^4.18.2`
- `cors@^2.8.5`
- `axios@^1.6.5`

### Dev Tools
- `@types/express`
- `@types/cors`
- `concurrently`
- `ts-node`

## Common Tasks

### Add New Component
1. Create file in `src/components/ComponentName.tsx`
2. Import in `App.tsx`
3. Add TypeScript interfaces
4. Create corresponding CSS in `src/styles/`

### Add New Utility
1. Create in `src/utils/`
2. Export functions/interfaces
3. Import in components as needed

### Add New Hook
1. Create in `src/hooks/hookName.ts`
2. Use `useState`, `useEffect` as needed
3. Return state and handlers

### Extend Storage
- Modify `storage.ts` functions
- Add new localStorage keys
- Update type definitions

### Extend Compiler
- Modify `compiler.ts` execution logic
- Add new language support
- Improve error handling

## Debugging Tips

### Browser DevTools
- F12 to open
- Elements tab - inspect UI structure
- Console tab - JavaScript errors/logs
- Application tab - localStorage contents

### React DevTools
- Install React Developer Tools extension
- Inspect component state/props
- Track re-renders

### Network Tab
- Monitor API calls to backend
- Check file sharing requests
- Debug CORS issues

## Performance Considerations

### Local Storage
- 5-10MB per domain limit
- Monitor with DevTools
- Delete old projects if needed

### DOM Rendering
- Multiple files trigger app re-renders
- useCallback prevents unnecessary renders
- Consider memoization for large projects

### Compiler
- Each run creates new iframe
- Old iframes cleaned up after 100ms
- Console output captured in memory array

## Testing Strategy

### Manual Testing
1. Create project with multiple files
2. Edit code and verify auto-save
3. Run code and check output
4. Share and test on different device
5. Verify localStorage persistence

### Test Scenarios
- Create, rename, delete projects
- Create, edit, delete files
- Execute JS/HTML/CSS code
- Share code and access from same network
- Refresh browser and verify data persists

## Deployment

### Prerequisites
- Node.js v16+ installed
- Port 3001 available for sharing

### Steps
1. Build: `npm run build`
2. Create production server (modify `server.ts` for database)
3. Deploy to server
4. Run: `node dist/server.js`

### Environment Considerations
- Use environment variables for API URLs
- Add CORS whitelist for production
- Implement proper authentication for sharing
- Consider database instead of in-memory storage

## Future Enhancements

Priority improvements:
1. Syntax highlighting (Prism.js or Monaco)
2. Code formatting (Prettier integration)
3. Database for persistent sharing
4. User accounts and auth
5. Real-time collaboration
6. Code templates/snippets
7. Export/import projects
8. Version history

## Browser Storage Structure

```javascript
// Stored as: localStorage.getItem('js-compiler-projects')
[
  {
    id: "project-xxx",
    name: "My Project",
    files: [
      {
        id: "file-yyy",
        name: "index.html",
        language: "html",
        code: "...",
        createdAt: 1234567890,
        updatedAt: 1234567890
      }
    ],
    createdAt: 1234567890,
    updatedAt: 1234567890
  }
]
```

## Notes
- All component state managed with React hooks
- TypeScript for type safety
- CSS Grid/Flexbox for layout
- localStorage key: 'js-compiler-projects'
- Current project key: 'js-compiler-current-project'
- Express server runs on port 3001
- Vite dev server on port 5173
