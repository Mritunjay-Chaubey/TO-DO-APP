# TASKS — Brutalist To-Do List
 
A bold, retro-brutalist daily task manager built with pure HTML, CSS, and JavaScript. No frameworks. No dependencies. Just three files and a browser.
 
---
 
## 📁 Project Structure
 
```
project/
├── index.html   → Page structure & markup
├── style.css    → All styling, layout, animations
└── script.js    → App logic, state management, interactivity
```
 
---
 
## 🚀 Getting Started
 
1. Download all three files into the **same folder**
2. Open `index.html` in any modern browser
3. Start adding tasks — that's it
No build step. No npm install. No server required.
 
---
 
## ✨ Features
 
| Feature | How to Use |
|---|---|
| **Add a task** | Type in the input field and press `Enter` or click `+ ADD` |
| **Complete a task** | Click the square checkbox — it turns green with a checkmark |
| **Set priority** | Click the `LOW / MED / HIGH` badge on any task to cycle through levels |
| **Filter tasks** | Use the All / Active / Done / !! High buttons at the top |
| **Delete a task** | Click the `✕` on the right side of any task card |
| **Reorder tasks** | Drag and drop any task to a new position |
| **Clear completed** | Click "Clear Completed" in the bottom footer bar |
| **Persistent storage** | Tasks are saved in `localStorage` — they survive page refreshes |
 
---
 
## 🎨 Design
 
The app uses a **brutalist-retro print aesthetic** — designed to look nothing like a default browser UI or generic AI output:
 
- **Bebas Neue** — big editorial display font for headings and counters
- **Space Mono** — monospaced body font for a typewriter/terminal feel
- Hard ink-black borders with flat `5px` offset shadows (no blur)
- Warm paper-cream background (`#f2ede4`) with a subtle ruled-notebook line texture (pure CSS)
- Stark red accent (`#e63900`) for highlights, hover states, and the remaining-task counter
- Zero rounded corners — intentionally sharp and raw
---
 
## 🧠 How It Works
 
### State
All tasks are stored in a JavaScript array and synced to `localStorage` on every change. The app re-renders the list from scratch on each state update — no virtual DOM needed.
 
```js
let tasks = JSON.parse(localStorage.getItem('brutalist-tasks') || '[]');
```
 
### Task Object Shape
```js
{
  id: 1700000000000,   // timestamp used as unique ID
  text: "Buy groceries",
  done: false,
  priority: "low"      // "low" | "med" | "high"
}
```
 
### Render Cycle
Every action (add, toggle, delete, reorder, filter) calls `render()`, which:
1. Filters the task array based on the active filter
2. Clears the `<ul>` and rebuilds it from scratch
3. Attaches event listeners to each new element
4. Updates the counters in the header and footer
### Drag & Drop
Uses the native HTML5 Drag and Drop API. When a task is dropped onto another, `reorderTasks()` splices the source task out and re-inserts it at the target index.
 
---
 
## 🌐 Browser Support
 
Works in all modern browsers:
 
- Chrome / Edge 88+
- Firefox 85+
- Safari 14+
---
 
## 📦 Dependencies
 
None. The only external resource is the Google Fonts stylesheet loaded in `index.html`:
 
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
```
 
An internet connection is required on first load to fetch these fonts. After that, the browser caches them.
 
---
 
## 🛠 Customization
 
All visual tokens are defined as CSS variables at the top of `style.css`. Change them to restyle the entire app instantly:
 
```css
:root {
  --ink:    #0d0d0d;   /* Primary text & borders */
  --paper:  #f2ede4;   /* Background */
  --accent: #e63900;   /* Highlights, hover, counter */
  --muted:  #b0a89a;   /* Placeholder & secondary text */
  --done:   #5a8a5a;   /* Completed task checkbox */
  --border: 3px solid var(--ink);
  --shadow: 5px 5px 0 var(--ink);
}
```
 
---
 
## 📄 License
 
Free to use, modify, and build upon for personal or commercial projects.
 
