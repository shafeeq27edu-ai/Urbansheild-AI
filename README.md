# UrbanShield AI

UrbanShield AI is a premium, investor-grade smart city command center simulation. It visualizes real-time climate risk data (flood, heat) and demonstrates AI-driven mitigation strategies.

## 🚀 Features
- **Real-time Digital Twin**: Interactive 3D map with risk heatmaps.
- **AI Intelligence**: Predictive analytics for flood and heat stress.
- **Cinematic UI**: Glassmorphism, ambient animations, and premium data visualization.
- **Emergency Protocols**: Simulated alert systems with audio feedback.

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
