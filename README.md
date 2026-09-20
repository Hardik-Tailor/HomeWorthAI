# HomeWorth AI

A machine learning web application that estimates residential property prices based on key house features. The app combines a Python scikit-learn model with a Node.js/Express backend and a fully custom, modern frontend.

---

## Overview

HomeWorth AI takes six property attributes as input and predicts the estimated price in Indian Rupees (Lakhs). The prediction is powered by a Linear Regression model trained on a curated housing dataset and served via a lightweight REST API.

---

## Features

- Instant price prediction using a trained ML model
- Six input features: area, bedrooms, bathrooms, floors, year built, and location tier
- Real-time API: Node.js server bridges the browser to the Python backend
- Animated, colorful frontend with glassmorphism design
- Confetti animation and count-up effect on result display
- Responsive layout for desktop and mobile
- No external UI framework dependency — pure HTML, CSS, and vanilla JavaScript

---

## Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | Python, scikit-learn (Linear Regression), pandas, NumPy |
| Backend API | Node.js, Express |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Model Storage | Pickle (.pkl) |
| Dataset | Excel (.xlsx) |

---

## Project Structure

```
HomeWorthAI/
├── public/
│   ├── index.html        # Main web page
│   ├── style.css         # All styling and animations
│   └── script.js         # Frontend logic, API calls, confetti
├── app.py                # Original tkinter app (legacy)
├── model.py              # Model training script
├── predict.py            # CLI script called by Node server
├── server.js             # Express server (entry point)
├── Price_Estimator.pkl   # Trained model file
├── Housing_Dataset.xlsx  # Training dataset
├── Dataset_Cleaning.ipynb
├── package.json
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- Python 3.8 or higher
- pip packages: `scikit-learn`, `joblib`, `numpy`, `pandas`, `openpyxl`

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Hardik-Tailor/HomeWorthAI.git
cd HomeWorthAI
```

2. Install Node dependencies:

```bash
npm install
```

3. Install Python dependencies:

```bash
pip install scikit-learn joblib numpy pandas openpyxl
```

4. (Optional) Retrain the model:

```bash
python model.py
```

### Running the App

```bash
node server.js
```

Open your browser and go to: **http://localhost:3000**

---

## How It Works

1. The user fills in property details on the web form.
2. The browser sends a POST request to `/predict` on the Express server.
3. The server spawns a Python child process, passing the input values as arguments.
4. `predict.py` loads `Price_Estimator.pkl` and runs model inference.
5. The result is returned as JSON and displayed with an animated count-up in the browser.

---

## Input Features

| Feature | Description | Example |
|---|---|---|
| Area | Property area in square feet | 1500 |
| Bedrooms | Number of bedrooms | 3 |
| Bathrooms | Number of bathrooms | 2 |
| Floors | Number of floors | 2 |
| Year Built | Year the property was constructed | 2015 |
| Tier | Location tier (1 = Metro, 2 = Urban, 3 = Semi-Urban) | 1 |

---

## Model Details

- Algorithm: Linear Regression
- Library: scikit-learn
- Training split: 80% train / 20% test
- Output: Predicted price in Lakhs (INR)
- Features used: BEDROOMS, BATHROOMS, SQUARE_FT, YEAR_BUILT, FLOORS, TIER

---

## License

This project is for educational purposes. Predictions are estimates only and should not be used for real financial decisions.

---

## Author

Hardik Tailor — [GitHub](https://github.com/Hardik-Tailor)
