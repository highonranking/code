# JS Compiler - Complete Feature Guide

## Overview
The JS Compiler is a browser-based IDE for writing, testing, and sharing JavaScript code with integrated HTML and CSS support. All code is automatically saved to your local browser storage, ensuring no data loss.

## Quick Start

### 1. Start Development Server
```bash
cd /Users/abhinav/Documents/js-compiler
npm run dev
```
Then open `http://localhost:5173` in your browser.

### 2. Create Your First Project
1. Click the **➕** button next to "Project:"
2. Enter a project name (e.g., "Hello World")
3. Click OK

### 3. Create Files
In the **Files** panel on the left:
- Click **JS** to create a JavaScript file
- Click **HTML** to create an HTML file  
- Click **CSS** to create a CSS file

### 4. Write and Run Code

**JavaScript Example:**
```javascript
console.log("Hello, World!");
const numbers = [1, 2, 3, 4, 5];
console.log("Sum:", numbers.reduce((a, b) => a + b, 0));
```

**HTML Example:**
```html
<h1>Welcome to JS Compiler</h1>
<p id="message">Click the button below</p>
<button onclick="changeMessage()">Click Me</button>
```

**CSS Example:**
```css
h1 {
  color: #007acc;
  font-family: 'Segoe UI', sans-serif;
  text-align: center;
}

button {
  background-color: #007acc;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #005a9e;
}
```

Click **▶ Run Code** to execute and see results in the output panel.

## Features Explained

### 📁 Project Management
**Current Project Area** (Top)
- Shows active project name
- **➕** Create new project
- **⋮** Project menu

**Project Menu Options:**
- Click project name to switch
- **🔗** Share with link
- **✎** Rename project
- **🗑** Delete project

### 📄 File Explorer (Left Panel)
**File List:**
- 📄 JavaScript files
- 🔷 HTML files
- 🎨 CSS files

**File Actions:**
- Click to select and edit
- ✕ button to delete file
- Auto-saves as you type

**Create New File:**
- JS, HTML, CSS buttons at top
- Automatically numbered if multiple of same type

### ✏️ Editor (Middle Panel)
**Features:**
- Monospace font for code
- Line-by-line editing
- Auto-saves while typing
- Shows file type in header

**Supported Languages:**
- JavaScript with full syntax
- HTML with proper structure
- CSS with styling rules

### 🖥️ Output Panel (Right)
**Two Sections:**
1. **Console Output**
   - JavaScript console.log() output
   - Error messages in red
   - Real-time execution feedback

2. **Live Preview**
   - HTML/CSS rendered in sandbox
   - Interactive elements work
   - Refresh with "▶ Run Code" button

### 🔗 File Sharing (Same Network)

#### How to Share Code:
1. Click **⋮** (menu) button
2. Select the project to share
3. Click **🔗** (share link) button
4. Share URL is copied to clipboard
5. Others on same network can access

#### Share URL Format:
```
http://your-ip:3001/share/project-name
```

#### For Same-Network Access:
1. Find your local IP: `hostname -I` (Linux/Mac)
2. Share: `http://<your-ip>:3001/share/my-project`
3. Device on same network can access

### 💾 Local Storage

**Auto-Save Behavior:**
- Every keystroke auto-saves
- No manual save needed
- Data survives browser crashes
- Persists after page refresh

**Storage Location:**
- Browser DevTools → Application → Local Storage
- Key: `js-compiler-projects`

**Storage Limits:**
- ~5-10MB per domain (Chrome/Firefox/Safari)
- Sufficient for 100+ code files
- Check available space in DevTools

### 🚀 Code Execution

**JavaScript Execution:**
- Runs in browser context
- Access to global window object
- DOM manipulation works
- Async/await supported

**HTML/CSS Rendering:**
- Runs in sandboxed iframe
- CSS immediately applied
- HTML elements interact with JS
- Safe execution environment

**Example: Interactive HTML/CSS/JS:**
```html
<!-- HTML -->
<input type="text" id="name" placeholder="Enter your name">
<button onclick="greet()">Greet</button>
<p id="greeting"></p>
```

```javascript
// JavaScript
function greet() {
  const name = document.getElementById('name').value;
  document.getElementById('greeting').textContent = `Hello, ${name}!`;
}
```

```css
/* CSS */
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

p {
  color: #007acc;
  font-weight: bold;
}
```

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Tab indent | Tab | Tab |
| New line | Enter | Enter |
| Select all | Ctrl+A | Cmd+A |
| Copy | Ctrl+C | Cmd+C |
| Paste | Ctrl+V | Cmd+V |

## Common Workflows

### Workflow 1: Building a Todo App
1. Create HTML file with form and list
2. Create CSS file for styling
3. Create JS file for functionality
4. Add event listeners for add/delete

### Workflow 2: Learning JavaScript
1. Create single JS file
2. Write practice code
3. Run and check console output
4. Iterate and improve

### Workflow 3: Quick Prototyping
1. Create HTML mockup
2. Style with CSS
3. Add interactivity with JS
4. Share with team for feedback

## Troubleshooting

### Q: My code doesn't run
**A:** 
- Check console for syntax errors
- Make sure HTML elements exist before JS references them
- Click "▶ Run Code" to execute
- Look for error messages in red

### Q: Files disappeared!
**A:**
- Check DevTools → Application → Local Storage
- If browser data cleared, files are lost
- Export your code regularly
- Consider using GitHub for backup

### Q: Can't connect on same network
**A:**
- Use IP address instead of localhost
- Check firewall isn't blocking port 3001
- Both devices must be on same Wi-Fi
- Try: `http://192.168.x.x:3001` (your IP)

### Q: Preview not showing changes
**A:**
- Click "▶ Run Code" to refresh
- Check for HTML syntax errors
- Ensure CSS file exists
- Check console for JavaScript errors

### Q: Share link not working
**A:**
- Check both devices on same network
- Use IP address not hostname
- Verify port 3001 is open
- Server must be running

## Advanced Features

### Working with Multiple Files
```
Project: My App
├── index.html (main structure)
├── styles.css (layout & design)
├── app.js (main logic)
├── utils.js (helper functions)
└── api.js (API calls)
```

### DOM Manipulation
```javascript
// Selecting elements
const btn = document.getElementById('myBtn');
const items = document.querySelectorAll('.item');

// Creating elements
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello';
document.body.appendChild(newDiv);

// Events
btn.addEventListener('click', function() {
  console.log('Clicked!');
});
```

### Async JavaScript
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchData();
```

## Browser Compatibility

✅ **Supported:**
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

❌ **Not Supported:**
- Internet Explorer (any version)
- Very old mobile browsers

## Performance Tips

1. **Keep projects organized** - One project per task
2. **Delete unused files** - Clean up storage
3. **Monitor storage** - Check DevTools regularly
4. **Test frequently** - Run code often
5. **Export backups** - Save important projects

## Project Structure in Storage

```json
{
  "id": "project-1234567890",
  "name": "My Project",
  "files": [
    {
      "id": "file-xxx",
      "name": "index.html",
      "language": "html",
      "code": "<h1>Hello</h1>",
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ],
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

## Tips & Tricks

1. **Use console.log() for debugging** - See output instantly
2. **Test HTML structure first** - Before adding JS
3. **Style incrementally** - Apply CSS one element at a time
4. **Share early** - Get feedback on prototypes
5. **Keep files focused** - One purpose per file

## Getting Help

- Check browser console for errors (F12)
- Review JavaScript documentation at MDN
- Test code in small increments
- Try simplified versions of your code

Enjoy building with JS Compiler! 🚀
