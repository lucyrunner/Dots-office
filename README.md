# Relay — Cloud autonomy

Relay is a hackathon prototype for **Autonomy as a Service**: affordable robots use lightweight edge hardware for sensing and actuation, while cloud services validate routes, process perception, and return autonomy decisions. Think DoorDash’s dispatch network, extended to physical delivery robots.

The dashboard presents a simulated campus delivery fleet, live neighborhood map, order activity, and cloud round-trip telemetry. It is a concept demo: the fleet, orders, timing, and cloud status are sample UI data; no real robot or cloud-control service is connected.

## Run it in VS Code

1. Unzip the folder and open it in VS Code (**File → Open Folder…**).
2. Open the terminal (**Terminal → New Terminal**, or `` Ctrl+` ``).
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open **http://localhost:3000** in your browser.

You need [Node.js](https://nodejs.org) 18 or newer installed.

## Demo interactions

- Rotate and zoom the 3D neighborhood map; click a robot or fleet entry to inspect it.
- Open **Fleet** to see the deployed robots and their current missions.
- Choose **Deploy a robot** to add another rover to the local demo fleet.
- Follow the sample DoorDash-inspired order feed and cloud-validation route overlays.

## Project structure

| File | What's in it |
| --- | --- |
| `src/bots.js` | Demo fleet, robot identities, and sample mission states |
| `src/main.js` | Three.js district, rover models, map controls, and interactions |
| `src/style.css` | Responsive dashboard styling |
| `index.html` | Dashboard layout and deploy-robot dialog |
