# dots. — The little office

A 3D "office" where your AI agents live as little bots. Built with Vite + Three.js.

## Run it in VS Code

1. Unzip the folder and open it in VS Code (**File → Open Folder…**).
2. Open the terminal (**Terminal → New Terminal**, or `` Ctrl+` ``).
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Your browser opens at **http://localhost:3000**.

You need [Node.js](https://nodejs.org) 18 or newer installed.

## What you can do

- **Drag** to rotate the office, **scroll** to zoom.
- **Click a bot** (or a name in the sidebar) to see what it's working on, then hit **Say hi**.
- **Import agent** adds a new bot with your own name, role and color.
- **Your agents** tab shows everyone as cards.
- The toolbar at the bottom zooms, resets the view, and toggles auto-rotate.

## Where to change things

| File | What's in it |
| --- | --- |
| `src/bots.js` | The starting team — names, roles, colors, accessories, task lines |
| `src/main.js` | The 3D scene: room, furniture, bots, animation, clicks |
| `src/style.css` | All the UI styling |
| `index.html` | Page layout (top bar, sidebar, card, dialog) |

Accessories available in `bots.js`: `beret`, `glasses`, `antenna`, `nightcap`, `heart`, or `null`.
