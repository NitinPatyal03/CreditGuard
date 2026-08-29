from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
from pydantic import BaseModel, Field


app = FastAPI(
    title="CreditGuard API",
    description="Credit Risk Prediction API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Load ML artifacts
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

model = joblib.load(
    os.path.join(MODEL_DIR, "creditguard_model.pkl")
)

preprocessor = joblib.load(
    os.path.join(MODEL_DIR, "preprocessor.pkl")
)

config = joblib.load(
    os.path.join(MODEL_DIR, "config.pkl")
)

BEST_THRESHOLD = config["threshold"]

# -----------------------------
# Model Explainability
# -----------------------------

FEATURE_NAMES = preprocessor.get_feature_names_out()
MODEL_COEFFICIENTS = model.coef_[0]

FEATURE_IMPORTANCE = dict(
    zip(FEATURE_NAMES, MODEL_COEFFICIENTS)
)


# -----------------------------
# Request Model
# -----------------------------

class CreditRequest(BaseModel):

    checking_status: str = Field(
        ...,
        description="Checking account status"
    )

    duration_months: int = Field(
        ...,
        gt=0,
        le=120,
        description="Loan duration in months"
    )

    credit_history: str = Field(
        ...,
        description="Credit history"
    )

    purpose: str = Field(
        ...,
        description="Purpose of the loan"
    )

    credit_amount: float = Field(
        ...,
        gt=0,
        description="Credit amount"
    )

    savings_status: str = Field(
        ...,
        description="Savings account status"
    )

    employment: str = Field(
        ...,
        description="Employment status"
    )

    installment_rate: int = Field(
        ...,
        ge=1,
        le=4,
        description="Installment rate"
    )

    personal_status: str = Field(
        ...,
        description="Personal status"
    )

    other_debtors: str = Field(
        ...,
        description="Other debtors"
    )

    residence_since: int = Field(
        ...,
        ge=1,
        description="Years at current residence"
    )

    property_type: str = Field(
        ...,
        description="Property type"
    )

    age: int = Field(
        ...,
        ge=18,
        le=100,
        description="Age"
    )

    other_installment_plans: str = Field(
        ...,
        description="Other installment plans"
    )

    housing: str = Field(
        ...,
        description="Housing situation"
    )

    existing_credits: int = Field(
        ...,
        ge=1,
        description="Number of existing credits"
    )

    job: str = Field(
        ...,
        description="Job category"
    )

    dependents: int = Field(
        ...,
        ge=0,
        description="Number of dependents"
    )

    telephone: str = Field(
        ...,
        description="Telephone ownership"
    )

    foreign_worker: str = Field(
        ...,
        description="Foreign worker status"
    )
# -----------------------------
# Health Check
# -----------------------------

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# -----------------------------
# Root
# -----------------------------

@app.get("/")
def root():
    return {
        "message": "CreditGuard API is running",
        "model": config["model_type"],
        "threshold": BEST_THRESHOLD
    }


def get_risk_factors(processed_data):
    contributions = processed_data[0] * MODEL_COEFFICIENTS

    feature_contributions = list(
        zip(FEATURE_NAMES, contributions)
    )

    positive_factors = sorted(
        [
            (feature, float(contribution))
            for feature, contribution in feature_contributions
            if contribution > 0
        ],
        key=lambda x: x[1],
        reverse=True
    )

    negative_factors = sorted(
        [
            (feature, float(contribution))
            for feature, contribution in feature_contributions
            if contribution < 0
        ],
        key=lambda x: x[1]
    )

    risk_factors = [
        feature.replace("num__", "")
               .replace("cat__", "")
        for feature, _ in positive_factors[:3]
    ]

    protective_factors = [
        feature.replace("num__", "")
               .replace("cat__", "")
        for feature, _ in negative_factors[:3]
    ]

    return risk_factors, protective_factors

# -----------------------------
# Credit Prediction
# -----------------------------

@app.post("/predict")
def predict(request: CreditRequest):

    # Convert request to DataFrame
    data = pd.DataFrame([request.model_dump()])

    # Apply preprocessing
    processed_data = preprocessor.transform(data)

    # Get probability of Bad Credit
    probability = float(
        model.predict_proba(processed_data)[0][1]
    )

    # Apply optimized threshold
    prediction = int(
        probability >= BEST_THRESHOLD
    )

    # Get explanation
    risk_factors, protective_factors = get_risk_factors(
        processed_data
    )

    # Determine result
    if prediction == 1:
        result = "Bad Credit"
        risk_level = "High"
    else:
        result = "Good Credit"
        risk_level = "Low"

    return {
        "prediction": result,
        "risk_level": risk_level,
        "probability": round(probability, 4),
        "threshold": BEST_THRESHOLD,
        "risk_factors": risk_factors,
        "protective_factors": protective_factors
    }
