# JS Compiler - Technical Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      JS COMPILER ARCHITECTURE                │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         BROWSER (Frontend)                           │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    React Application                           │  │
│  │                                                                │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │  │
│  │  │ ProjectMgr   │  │  FileExplorer│  │   Editor (Code)  │    │  │
│  │  │   Component  │  │  Component   │  │   Component      │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘    │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────┐                       │  │
│  │  │    Preview Component                │                       │  │
│  │  │  ┌──────────────┐ ┌──────────────┐ │                       │  │
│  │  │  │ Live Preview │ │ Console Logs │ │                       │  │
│  │  │  │   (iframe)   │ │   (output)   │ │                       │  │
│  │  │  └──────────────┘ └──────────────┘ │                       │  │
│  │  └────────────────────────────────────┘                       │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │              Utility Layers                              │ │  │
│  │  │                                                          │ │  │
│  │  │  Storage.ts: Project & File Management                 │ │  │
│  │  │  ├─ getAllProjects()                                   │ │  │
│  │  │  ├─ saveProject()                                      │ │  │
│  │  │  ├─ addFile()                                          │ │  │
│  │  │  ├─ updateFile()                                       │ │  │
│  │  │  └─ deleteFile()                                       │ │  │
│  │  │                                                          │ │  │
│  │  │  Compiler.ts: Code Execution                           │ │  │
│  │  │  ├─ executeCode() - HTML/CSS/JS sandbox                │ │  │
│  │  │  └─ executeJavaScript() - JS only                      │ │  │
│  │  │                                                          │ │  │
│  │  │  Hooks:                                                 │ │  │
│  │  │  ├─ useFileSharing() - Share projects                  │ │  │
│  │  │  └─ useLoadSharedProject() - Load shared code          │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │             Browser Storage Layer (localStorage)              │  │
│  │                                                                │  │
│  │  Key: 'js-compiler-projects'                                  │  │
│  │  └─ Project[]                                                 │  │
│  │     ├─ id, name, files[]                                      │  │
│  │     └─ CodeFile[]                                             │  │
│  │        ├─ id, name, language, code                            │  │
│  │        └─ createdAt, updatedAt                                │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘

                              ↕ API Calls
                         (Axios HTTP Client)

┌──────────────────────────────────────────────────────────────────────┐
│                   Express.js Backend Server                          │
│                      (Port: 3001)                                    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    REST API Endpoints                          │  │
│  │                                                                │  │
│  │  POST   /api/share                                            │  │
│  │  ├─ Input: { projectId, project, customName }               │  │
│  │  └─ Output: { shareUrl, shareId }                           │  │
│  │                                                                │  │
│  │  GET    /api/share/:shareId                                  │  │
│  │  ├─ Input: shareId (URL param)                              │  │
│  │  └─ Output: Project object                                  │  │
│  │                                                                │  │
│  │  GET    /api/share-check/:shareId                            │  │
│  │  ├─ Input: shareId (URL param)                              │  │
│  │  └─ Output: { available: boolean }                          │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │           In-Memory Project Storage                            │  │
│  │           (HashMap: shareId → Project)                         │  │
│  │                                                                │  │
│  │  Future: Replace with Database (MongoDB, PostgreSQL)          │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │           Middleware Stack                                    │  │
│  │  • CORS (allow same-network requests)                         │  │
│  │  • Express.json (parse JSON)                                 │  │
│  │  • Static serving (dist folder)                              │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Creating and Running Code

```
User Input (Editor)
     ↓
  onChange handler
     ↓
  storage.updateFile()
     ↓
  localStorage updated
     ↓
  State updated (React re-render)
     ↓
  Code change reflected in UI
```

### Executing Code

```
User clicks "▶ Run Code"
     ↓
  Get all files (JS, HTML, CSS)
     ↓
  compiler.executeCode()
     ↓
  Create iframe sandbox
     ↓
  Inject HTML + CSS + JS
     ↓
  Capture console.log() output
     ↓
  Display in Preview panel
     ↓
  Show HTML/CSS rendered
     ↓
  Show console logs below
```

### Sharing Code

```
User clicks share icon
     ↓
  Prompt for custom name (optional)
     ↓
  Check if name available
     ↓
  POST /api/share
     ↓
  Server stores project in memory
     ↓
  Return shareUrl
     ↓
  Copy to clipboard
     ↓
  User shares URL
     ↓
  Other user visits URL
     ↓
  App fetches /api/share/:id
     ↓
  Display project (read-only or editable)
```

## Component Hierarchy

```
App (root)
├── ProjectManager
│   └── Project dropdown menu
├── FileExplorer
│   ├── File list
│   ├── Create file buttons
│   └── Delete file buttons
├── Editor
│   ├── Textarea (code input)
│   └── File info header
└── Preview
    ├── Console output section
    │   └── Log lines
    └── Live preview section
        └── Iframe (sandboxed HTML/CSS/JS)
```

## Technology Stack

```
Frontend:
  • React 19.2.0
    - Hooks (useState, useEffect, useCallback)
    - Functional components
    - Component composition

  • TypeScript 5.9
    - Type-safe components
    - Interface definitions
    - Generic types

  • Vite 7.3
    - Module bundling
    - Dev server with HMR
    - Production build

  • CSS3
    - CSS Variables
    - Flexbox & Grid
    - Responsive design

  • Axios 1.6
    - HTTP client
    - API communication
    - Error handling

Backend:
  • Express.js 4.18
    - Routing
    - Middleware
    - API endpoints

  • CORS 2.8
    - Cross-origin requests
    - Same-network access

Storage:
  • Browser LocalStorage
    - 5-10MB limit
    - Persistent storage
    - JSON serialization

Execution:
  • Browser APIs
    - iframe sandbox
    - console capturing
    - DOM manipulation
```

## State Management Flow

```
Global State (localStorage):
├── Projects[]
│   ├── id
│   ├── name
│   ├── files[]
│   │   ├── id
│   │   ├── name
│   │   ├── language
│   │   ├── code
│   │   └── timestamps
│   └── timestamps
└── currentProjectId

Local React State:
├── currentProject (Project)
├── selectedFile (CodeFile)
└── UI states (modals, dropdowns)
```

## File Types & Languages

```
JavaScript (.js)
├── ES6+ syntax
├── Async/await
├── DOM APIs
├── console.log()
└── Full browser APIs

HTML (.html)
├── HTML5 structure
├── Form elements
├── Interactive tags
└── Semantic markup

CSS (.css)
├── Modern CSS3
├── Flexbox & Grid
├── Animations
├── Media queries
├── Custom properties
```

## Execution Sandbox

```
iframe (Sandboxed)
├── Isolated DOM
├── Isolated JavaScript
├── No access to parent window
├── No access to localStorage
├── Only communicating via postMessage
└── Safe for untrusted code

Prevention:
├── Attribute: sandbox="allow-scripts"
├── No 'allow-same-origin'
├── No external resource access
└── No navigation capabilities
```

## API Contract

### Share Project Request
```typescript
interface ShareRequest {
  projectId: string;
  project: Project;
  customName?: string;
}

interface ShareResponse {
  success: boolean;
  shareUrl: string;
  shareId: string;
}
```

### Get Project Response
```typescript
interface GetProjectResponse {
  id: string;
  name: string;
  files: CodeFile[];
  sharedAt: number;
}
```

### Check Share Availability
```typescript
interface CheckShareResponse {
  available: boolean;
}
```

## Performance Characteristics

```
Local Storage Read: ~1ms
Local Storage Write: ~5ms
File Update (single): ~10ms
Project Save: ~20ms
Code Execution: ~50-200ms (depends on complexity)
iframe Creation: ~10-30ms
localStorage Limit: ~5-10MB (~200+ files)
```

## Browser Support

```
✅ Chromium-based (Chrome, Edge, Opera)
✅ Firefox
✅ Safari
❌ Internet Explorer (not supported)
❌ Very old mobile browsers
```

## Deployment Architecture

```
Development:
  npm run dev        → Vite dev server (port 5173)
  npm run dev:all    → Vite + Express (ports 5173 & 3001)

Production:
  npm run build      → Build React app to dist/
  npm run start      → Start Express server
                        (serves dist/ on port 3001)

Cloud Deployment:
  • Vercel (frontend only, no sharing)
  • AWS (full stack)
  • Heroku (full stack)
  • DigitalOcean (full stack)
```

## Future Architecture Improvements

```
Current (In-Memory):
  Shared Projects → HashMap in RAM
                 ↓ (Lost on server restart)

Planned (Database):
  Shared Projects → MongoDB/PostgreSQL
                 ↓ (Persistent)
                 → Redis cache (performance)

Authentication:
  Current: None (public sharing)
  Future: User accounts, project permissions

Real-time:
  Current: No collaboration
  Future: WebSocket, real-time editing (like Google Docs)

Version Control:
  Current: Single version
  Future: Git-like history, branches, diffs
```
