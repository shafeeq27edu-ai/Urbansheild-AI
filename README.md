# UrbanShield AI

UrbanShield AI is a premium, investor-grade smart city command center simulation. It visualizes real-time climate risk data (flood, heat) and demonstrates AI-driven mitigation strategies.

## 🚀 Features
- **Real-time Digital Twin**: Interactive 3D map with risk heatmaps.
- **AI Intelligence**: Predictive analytics for flood and heat stress.
- **Cinematic UI**: Glassmorphism, ambient animations, and premium data visualization.
- **Emergency Protocols**: Simulated alert systems with audio feedback.
Modern cities face increasing climate volatility, yet most systems react only after disasters occur. URBANSHIELD AI shifts the approach from reactive to predictive — using intelligent risk modeling and dynamic scenario simulation to provide early warnings, infrastructure stress insights, and actionable mitigation recommendations.

🚨 The Problem

Urban areas are highly vulnerable to:

Flash floods caused by intense rainfall and poor drainage

Extreme heatwaves amplified by urban heat island effects

Infrastructure overload during climate stress

Lack of predictive, zone-level intelligence for city authorities

Existing systems are either too generalized or not built for real-time decision support.

🧠 Our Solution

URBANSHIELD AI provides:

1️⃣ Hyper-Local Risk Prediction

Analyzes multiple urban parameters such as rainfall intensity, drainage efficiency, elevation, temperature trends, humidity, and population density to compute:

Flood Risk Score (0–1 scale)

Heatwave Severity Index

Confidence Level

Risk Categories (Low to Critical)
## 🛠️ Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/shafeeq27edu-ai/Urbansheild-AI.git
    cd Urbansheild-AI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env.local` file in the root directory and add your Mapbox token:
    ```bash
    NEXT_PUBLIC_MAPBOX_TOKEN=your_public_mapbox_token_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

5.  **Build for Production:**
    ```bash
    npm run build
    npm start
    ```

## 📦 Tech Stack
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS
-   **Map**: Mapbox GL JS (react-map-gl)
-   **State**: Zustand
-   **Animation**: Framer Motion
