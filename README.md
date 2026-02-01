# ScanIt 🍄➡️📓
*Formerly Mystic Finance / Family Finance Translator*

**ScanIt** is a gamified financial literacy app for kids, enabling them to scan real-world objects to learn about their cost, value (needs vs. wants), and financial concepts in a fun, "Mystical Forest" themed environment.

## 🚀 Getting Started

### Prerequisites

*   **Node.js** (v18 or higher)
*   **Python** (v3.11 or higher)
*   **Google Cloud API Key** (for Vision API - optional for UI demo, required for scanning)
*   **Google Gemini API Key** (for financial tips - optional for UI demo)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/MaryamElhamidi/ellehacks-nitecrawlers.git
    cd ellehacks-nitecrawlers
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    pip install -r requirements.txt
    # Create .env file with your API keys
    # GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
    # GEMINI_API_KEY="your_api_key"
    cd ..
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## 🏃‍♂️ How to Run

We've provided a convenient script to start both servers at once:

```bash
chmod +x start.sh
./start.sh
```

Or, run them manually in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## 🌲 Tech Stack
*   **Frontend:** React, Vite, TailwindCSS (Pixel Art Theme)
*   **Backend:** Python (FastAPI/Uvicorn)
*   **AI/ML:** Google Cloud Vision API, Google Gemini (GenAI)

## ✨ Features
*   **Scan:** Snap photos of items to get prices and "wants vs. needs" analysis.
*   **Profile:** Toggle between your "Receipt" (Budget) and "Notebook" (Collection).
*   **Theme:** Immersive "Mystical Forest" pixel-art UI.