# Code Completion & Auto-Formatting Guide

## 🎯 IDE-Like Features

The JS Compiler now includes professional IDE features that make coding faster and easier.

## ⚡ Auto-Close Brackets & Quotes

When you type an opening bracket or quote, the closing one is automatically added.

### Supported Auto-Closing Pairs:

| Open | Close | Example |
|------|-------|---------|
| `(` | `)` | `console.log(|)` |
| `[` | `]` | `arr[|]` |
| `{` | `}` | `if (true) { \|` |
| `"` | `"` | `"Hello |"` |
| `'` | `'` | `'World |'` |
| `` ` `` | `` ` `` | `` `Template ${|}` `` |
| `<` | `>` | `<div>|</div>` |

**How it works:**
1. Type an opening bracket: `(`
2. Closing bracket `)` appears automatically
3. Cursor is positioned between them
4. Continue typing or press right arrow to skip the closing bracket

### Smart Skip:
If the closing bracket already exists, it won't duplicate:
```javascript
// If you type ) and ) already exists
console.log(||)  // Won't become console.log())
```

## 📝 Auto-Indentation

Press `Enter` to create a new line with proper indentation.

### How it works:

```javascript
// Before pressing Enter
if (true) {|

// After pressing Enter (cursor on new line with auto-indent)
if (true) {
  |
```

### Smart Indentation:
- Increases indent after opening brackets: `{`, `[`, `(`
- Maintains current indent level otherwise
- Works for JavaScript, HTML, and CSS

## 🚀 Code Suggestions

Start typing to see intelligent code completions.

### JavaScript Suggestions:
- **Keywords**: `const`, `let`, `var`, `function`, `async`, `await`, etc.
- **Functions**: `console.log()`, `document.getElementById()`, `fetch()`, etc.
- **Methods**: `.map()`, `.filter()`, `.reduce()`, `.forEach()`, etc.

**Example:**
```javascript
Type: con
Suggestions: const, console.log
Select: console.log
Result: console.log($)  // $  = cursor position
```

### HTML Suggestions:
- **Tags**: `div`, `button`, `form`, `input`, `img`, `table`, etc.
- **Structures**: Auto-complete with closing tags

**Example:**
```html
Type: but
Suggestions: button
Select: button
Result: <button>|</button>
```

### CSS Suggestions:
- **Properties**: `color`, `background-color`, `padding`, `margin`, `font-size`, etc.
- **Values**: `flex`, `grid`, `absolute`, `pointer`, etc.

**Example:**
```css
Type: dis
Suggestions: display
Select: display
Result: display: |;
```

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Insert 2 spaces (auto-indent) |
| `Enter` | New line with auto-indent |
| `(`, `[`, `{`, `"`, `'`, `` ` `` | Auto-close brackets/quotes |
| `Escape` | Close suggestion dropdown |
| `↑` / `↓` | Navigate suggestions (when open) |
| `Enter` | Select highlighted suggestion |

## 🎨 Smart Features

### 1. Automatic Bracket Closing
```javascript
// Type: function test(
// Result: function test(|)

// Type: arr[
// Result: arr[|]

// Type: {
// Result: {
//   |
// }
```

### 2. Quote Pairing
```javascript
// Type: "
// Result: "|"

// Type: '
// Result: '|'

// Type: `
// Result: `|`
```

### 3. HTML Tag Closing
```html
// Type: <button
// Result: <button>|</button>
```

### 4. Nested Structure Support
```javascript
// Type: const obj = {
// Then Enter
// Result:
const obj = {
  |
}
```

## 💡 Pro Tips

1. **Fast Code Input**: Let auto-close handle brackets - just keep typing
2. **Navigate Completions**: Use arrow keys to select from suggestion list
3. **Skip Auto-Close**: If closing bracket exists, press right arrow or Delete
4. **Multi-line Indents**: Auto-indent works on every new line
5. **Template Literals**: Use backticks `` ` `` for template strings with auto-complete

## Example Workflows

### Creating a Function (JavaScript):
```
1. Type: func
2. Select: function from suggestions
3. Type: test(
4. Auto-closing: )
5. Result: function test(|)
6. Press Enter
7. Auto-indent creates:
   function test(
     |
   )
```

### Creating an HTML Form:
```
1. Type: <form
2. Auto-closing: </form>
3. Result: <form>|</form>
4. Press Enter, type: <input
5. Auto-complete: <input>|</input>
6. Or select from suggestions for proper structure
```

### Writing CSS:
```
1. Type: col
2. Select: color from suggestions
3. Result: color: |;
4. Type: blue
5. Press Tab to move to next property or Enter for new line
```

## ⚙️ Configuration

All auto-completion is enabled by default. Suggestions show:
- Top 10 matching items
- Icons to indicate type (keyword ⚡, function 𝒇, etc.)
- Documentation and hints
- Keyboard navigation support

## Troubleshooting

### Suggestions not appearing?
- Ensure you've typed at least 2 characters
- Check that the language is correctly set
- Try pressing Escape then type again

### Unwanted auto-close?
- The closing character won't be added if it already exists ahead
- Use Backspace to delete unwanted closing character
- Press Delete to remove the auto-closed character

### Indentation looking wrong?
- Auto-indent bases on previous line's structure
- Manual spaces override auto-indent
- Custom indent size can be adjusted (default: 2 spaces)

## Supported Languages

✅ **JavaScript (ES6+)**
- Full keyword support
- Common APIs and methods
- Async/await patterns

✅ **HTML5**
- All major tags
- Semantic markup
- Form elements

✅ **CSS3**
- Modern properties
- Flexbox & Grid
- Pseudo-classes & elements

## Future Enhancements

- [ ] Custom snippet support
- [ ] Multi-line auto-completion
- [ ] Language server integration
- [ ] Real-time error detection
- [ ] Code formatting (Prettier)
- [ ] Configurable bracket styles
