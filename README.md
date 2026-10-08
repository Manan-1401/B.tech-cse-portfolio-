# 🏎️ Manan Joshi #14 — F1 Telemetry Portfolio

An F1 Telemetry & Pit Wall inspired personal portfolio website for **Manan Joshi**, JECRC University student, future software engineer, and 35x hackathon winner.

---

## 🚦 Live Features & Highlights

- **5-Red-Lights Out Sequence**: Iconic F1 start lights animation on page load with replay button.
- **Cockpit Steering Wheel HUD**:
  - 15-segment LED RPM shift lights (Green ➔ Red ➔ Purple).
  - Digital gear display (Gears 1 to 8), live speedometer (km/h), and delta times.
  - Interactive pedals: **Throttle (GAS)**, **Brake**, **Paddle Shifts [Q/E]**, and **DRS toggle [D]**.
- **Real-Time Canvas Telemetry Waveform**:
  - 60 FPS live canvas oscilloscope visualizing Speed, Throttle, Brake, and Engine RPM in real time.
- **Native Web Audio API Sound Engine**:
  - Synthesized F1 pit-radio squelch / chirp beeps.
  - Realistic pneumatic gear shift sound effects.
  - Dynamic dual-oscillator F1 engine rev drone responding to your throttle.
  - Mute/Unmute audio toggle switch in the pit wall bar (respects browser autoplay standards).
- **Official Qualifying Timing Screen**:
  - Displays academic record with Class 12th Board (96% Purple Sector) and JECRC University progression.
- **Power Unit Technical Stack**:
  - C Language (Internal Combustion Engine - Low level memory & speed)
  - Python (MGU-K Energy Recovery - AI & Chatbot frameworks)
  - Java (Chassis & Transmission - Scalable OOP systems)
  - Web Engineering (Aerodynamics - Responsive HUD, HTML5 Canvas)
- **Engineered Projects**:
  - **Apex Web Platform**: Responsive telemetry UI.
  - **PitCom AI Chatbot**: Interactive conversational race-engineer simulator right on the page!
- **Championship Trophy Cabinet**:
  - Highlights **50+ Hackathon Starts & 35 P1 Podium Victories** (70% Win Conversion Rate).
- **Pit Radio Communications**:
  - Direct Phone: `67676767676`
  - GitHub: [github.com/Manan-1401](https://github.com/Manan-1401)
  - LinkedIn: [linkedin.com/in/manan-joshi](https://www.linkedin.com/in/manan-joshi-312787428)
  - Interactive radio check sound trigger and message transmission form.

---

## 📁 Project Structure

```
My Portfolio - MANAN/
├── index.html              # Main F1 Pit Wall cockpit dashboard
├── README.md               # Documentation & deployment guide
├── css/
│   ├── style.css           # Core dark theme, typography, layout & animations
│   └── telemetry.css       # Steering wheel HUD, gauges, LEDs & canvas charts
└── js/
    ├── audio.js            # Native Web Audio API sound synthesizer
    ├── telemetry.js        # Canvas waveform plotter & cockpit physics simulation
    └── main.js             # Nav, mobile menu, AI chat simulator & radio form
```

---

## 🚀 How to Run Locally

Because this project is built with vanilla HTML5, CSS3, and JavaScript, **no build step or npm installation is required**.

1. Simply double-click `index.html` to open it in your favorite browser (Chrome, Edge, Firefox, Brave, Safari).
2. Alternatively, you can use VS Code's "Live Server" extension or any local static server.

---

## 🌐 Deploy to GitHub Pages (Zero Config)

To publish this portfolio to your free GitHub Pages site:

1. Create a repository on your GitHub account (`https://github.com/Manan-1401/portfolio`).
2. Push the files in this directory to the repository:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit of F1 Telemetry Portfolio"
   git branch -M main
   git remote add origin https://github.com/Manan-1401/<your-repo-name>.git
   git push -u origin main
   ```
3. In GitHub, go to **Settings > Pages**, choose **Branch: main**, and click **Save**.
4. Your website will be live in seconds at `https://manan-1401.github.io/<your-repo-name>/`!
