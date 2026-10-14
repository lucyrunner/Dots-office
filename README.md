# Relay — Cloud autonomy

Relay is a hackathon prototype for **Autonomy as a Service** in restaurants: affordable service robots use lightweight edge hardware and LiDAR to map and localize inside a venue, while cloud services validate proposed motion and return autonomy decisions. Like DoorDash dispatch, Relay coordinates jobs—but robots navigate an indoor floor plan, not GPS streets.

The dashboard presents a simulated restaurant fleet, cutaway 3D dining room, kitchen-to-table service activity, and cloud round-trip telemetry. It is a concept demo: orders, routes, positioning, latency, and savings are sample UI data; no real robot or cloud-control service is connected. The visible rover is a low-poly placeholder and should be replaced by the vehicle CAD model when supplied (ideally exported as a GLB/glTF asset).

Indoor positioning in the concept is local (LiDAR mapping/SLAM and venue landmarks), not GPS. A real system still needs a safety-rated onboard stop/control path; cloud inference should not be the only safeguard for immediate obstacle avoidance.

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

- Rotate and zoom the 3D restaurant floor; click a robot or fleet entry to inspect it.
- Open **Fleet** to see indoor runners and their current missions.
- Choose **Deploy a robot** to add another rover to the local demo fleet.
- Follow sample kitchen-pass-to-table orders and GPS-free local route overlays.

## Project structure

| File | What's in it |
| --- | --- |
| `src/bots.js` | Demo fleet, robot identities, and sample restaurant missions |
| `src/main.js` | Three.js restaurant, placeholder rover models, map controls, and interactions |
| `src/style.css` | Responsive dashboard styling |
| `index.html` | Dashboard layout and deploy-robot dialog |
