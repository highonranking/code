# JS Compiler - Quick Start Guide

## 🎯 What You've Got

A fully functional, browser-based JavaScript IDE with:
- ✅ React + TypeScript frontend
- ✅ Local storage persistence (auto-save)
- ✅ Same-network file sharing (simple: `/share/yourname`)
- ✅ Live code preview
- ✅ Console output capture
- ✅ Multi-file project support
- ✅ Express backend for sharing
- ✅ **IDE-like code completion** (auto-close brackets, suggestions)
- ✅ **Auto-indentation** (smart Enter key)

## 🚀 Getting Started (2 minutes)

### Step 1: Start the App
```bash
cd /Users/abhinav/Documents/js-compiler
npm run dev
```

Visit: **http://localhost:5173**

### Step 2: Create Your First File
1. Click the **➕** button to create a new project
2. Name it (e.g., "My First App")
3. Click **JS** to create a JavaScript file

### Step 3: Write Some Code
```javascript
console.log("Hello, World!");

// Try some JavaScript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Sum:", sum);
```

### Step 4: Run It!
Click **▶ Run Code** button and see output in the right panel

## 💡 Features at a Glance

| Feature | How to Use |
|---------|-----------|
| **Create Project** | Click ➕ next to "Project:" |
| **Create File** | Click JS/HTML/CSS buttons |
| **Run Code** | Click ▶ Run Code button |
| **Share Code** | Click ⋮ → 🔗 → Copy link |
| **Delete File** | Click ✕ on file in explorer |
| **Rename Project** | Click ⋮ → ✎ on project |
| **Auto-Save** | Happens as you type |

## 🔗 Sharing Code (Same Network)

### Quick Share:
1. Click **⋮** menu button
2. Click the **🔗** (share button) in the top right
3. Enter a simple name (e.g., "abhinav")
4. Click **Share Now**
5. Share the generated URL with others on your network

### Simple Share Examples:
```
http://localhost:3001/s/abhinav
http://192.168.1.100:3001/s/my-project
http://YOUR_IP:3001/s/code-demo
```

All shared immediately accessible to same-network users!

## 📁 File Types Supported

### JavaScript (.js)
- Full ES6+ support
- console.log() works
- DOM manipulation
- Async/await
- **Auto-close brackets & quotes**
- **Auto-suggestions**

### HTML (.html)
- Full HTML5 structure
- Works with CSS & JS
- Interactive elements
- **Auto-complete tags**
- Forms and inputs

### CSS (.css)
- Modern CSS3
- Flexbox & Grid
- Animations
- Responsive design

## ⚡ IDE Features - Code Completion

The editor includes professional IDE features:

### Auto-Close Brackets & Quotes
Type `(` and `)` appears automatically. Works for:
- `(` → `)`
- `[` → `]`
- `{` → `}`
- `"` → `"`
- `'` → `'`
- `` ` `` → `` ` ``

### Auto-Indent
Press `Enter` for automatic indentation:
```javascript
if (true) {   // Type opening bracket
  |           // Press Enter, cursor auto-indents
```

### Code Suggestions
Start typing to see suggestions:
- JavaScript: keywords, functions, methods
- HTML: tags with auto-close
- CSS: properties and values

### Smart Features
- **Tab key**: Insert 2 spaces
- **Escape key**: Close suggestions
- **Arrow keys**: Navigate suggestion list
- **Enter**: Select highlighted suggestion

**Example workflow:**
```javascript
Type: con
↓ (select from suggestions)
Result: console.log(|)
Type: "Hello"
Result: console.log("Hello|")
```

## 💾 Your Data is Safe

All your code is automatically saved to **browser localStorage**:
- ✅ Survives page refreshes
- ✅ Survives browser crashes
- ✅ No internet needed
- ✅ ~5MB storage per site

Check in DevTools → Application → Local Storage

## 📚 Example Projects

### Example 1: Todo List
**HTML:**
```html
<div id="app">
  <input type="text" id="task" placeholder="Add a task">
  <button onclick="addTask()">Add</button>
  <ul id="tasks"></ul>
</div>
```

**JavaScript:**
```javascript
function addTask() {
  const task = document.getElementById('task').value;
  const li = document.createElement('li');
  li.textContent = task;
  document.getElementById('tasks').appendChild(li);
  document.getElementById('task').value = '';
}
```

**CSS:**
```css
#app {
  max-width: 500px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}

input {
  padding: 10px;
  width: 70%;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

li {
  padding: 10px;
  margin: 5px 0;
  background: #f0f0f0;
  border-radius: 4px;
}
```

### Example 2: Simple Calculator
```javascript
function calculate(operation, a, b) {
  switch(operation) {
    case 'add': return a + b;
    case 'subtract': return a - b;
    case 'multiply': return a * b;
    case 'divide': return a / b;
  }
}

console.log(calculate('add', 10, 5));        // 15
console.log(calculate('multiply', 4, 7));   // 28
```

## ⚡ Keyboard Shortcuts

- **Tab** - Indent code
- **Ctrl/Cmd + A** - Select all
- **Ctrl/Cmd + C** - Copy
- **Ctrl/Cmd + V** - Paste

## 🐛 Troubleshooting

### "Code not running"
- Check for syntax errors in console (F12)
- Make sure HTML elements exist before JS references them

### "Files disappeared"
- Check DevTools → Application → Local Storage
- Don't clear browser data
- Export important projects

### "Can't share on same network"
- Use IP address instead of localhost
- Check port 3001 isn't blocked
- Both devices must be on same Wi-Fi

## 📦 Project Files Structure

```
js-compiler/
├── src/
│   ├── components/     # React components
│   ├── utils/          # Storage & compiler
│   ├── hooks/          # Custom hooks
│   ├── styles/         # CSS files
│   ├── App.tsx         # Main app
│   └── server.ts       # Express server
├── dist/               # Built files (after npm run build)
├── package.json        # Dependencies
├── vite.config.ts      # Vite config
└── README.md           # Full documentation
```

## 🎓 Learning Resources

- **JavaScript**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **HTML**: https://developer.mozilla.org/en-US/docs/Web/HTML
- **CSS**: https://developer.mozilla.org/en-US/docs/Web/CSS
- **React**: https://react.dev

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Run frontend + backend together
npm run dev:all

# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm run start

# Check for lint errors
npm run lint
```

## 💬 Tips

1. **Start simple** - Write basic JavaScript first
2. **Use console.log()** - For debugging
3. **Test often** - Click "Run Code" frequently
4. **Share early** - Get feedback on prototypes
5. **Keep files clean** - One purpose per file

## 🎉 You're All Set!

You now have a complete JavaScript compiler that:
- ✨ Runs in your browser
- 💾 Saves automatically
- 🔗 Shares easily
- 🚀 Works offline
- 📱 Works on same network

Start coding and have fun! 🎨💻

---

**Questions?** Check FEATURE_GUIDE.md for detailed documentation
