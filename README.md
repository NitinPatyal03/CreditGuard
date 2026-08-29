# CreditGuard

## ML-Powered Credit Risk Prediction System

CreditGuard is an end-to-end Machine Learning application that predicts credit risk from customer financial and personal information.

The project combines a trained Machine Learning model, FastAPI backend, and React frontend to provide an interactive credit risk assessment system.

---

## Features

- Credit risk prediction
- Probability-based risk assessment
- Custom decision threshold
- Human-readable input form
- Risk level classification
- Risk factors
- Protective factors
- Prediction history
- Dashboard analytics
- Frontend input validation
- Backend request validation
- REST API
- Interactive Swagger documentation

---

## Machine Learning

The project uses the German Credit dataset.

### ML Pipeline

```text
Raw Dataset
     ↓
Data Cleaning
     ↓
Exploratory Data Analysis
     ↓
Feature Engineering
     ↓
Preprocessing
     ↓
Model Training
     ↓
Model Comparison
     ↓
Hyperparameter Tuning
     ↓
Threshold Optimization
     ↓
Final Model


Model Performance
Metric	Baseline	Tuned
ROC-AUC	0.8040	0.8094
Recall	0.5333	0.7833
F1 Score	0.5926	0.6309

The optimized model uses a decision threshold of approximately 0.55.

Tech Stack
Machine Learning
Python
Pandas
NumPy
Scikit-learn
Joblib
Jupyter Notebook
Backend
FastAPI
Pydantic
Uvicorn
Frontend
React
Vite
Tailwind CSS



Architecture
                    ┌─────────────────┐
                    │  React Frontend │
                    └────────┬────────┘
                             │
                             │ POST /predict
                             ↓
                    ┌─────────────────┐
                    │  FastAPI API    │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │ Input Validation│
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  Preprocessor   │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │  ML Model       │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │ Probability +   │
                    │ Risk Assessment  │
                    └────────┬────────┘
                             │
                             ↓
                    ┌─────────────────┐
                    │ React Dashboard │
                    └─────────────────┘
API
Health Check
GET /health

Response:

{
  "status": "healthy"
}
Credit Prediction
POST /predict

Example response:

{
  "prediction": "Bad Credit",
  "risk_level": "High",
  "probability": 0.6813,
  "threshold": 0.55
}


Running Locally

Backend
cd api

pip install -r requirements.txt

uvicorn main:app --reload

API:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

Frontend
cd frontend

npm install

npm run dev


Project Structure
CreditGuard/
│
├── api/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── models/
│   ├── creditguard_model.pkl
│   ├── preprocessor.pkl
│   └── config.pkl
│
├── notebooks/
│   └── ML experiments
│
├── data/
│   └── Dataset
│
├── .gitignore
└── README.md

Future Improvements:-

User authentication
Database-backed prediction history
Advanced model explainability
SHAP-based explanations
Model monitoring
Cloud deployment
Automated retraining pipeline
Credit risk reporting