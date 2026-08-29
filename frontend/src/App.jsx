import { useState } from "react";

const API_URL = "https://creditguard-004u.onrender.com";

const initialForm = {
  checking_status: "A11",
  duration_months: 24,
  credit_history: "A32",
  purpose: "A40",
  credit_amount: 5000,
  savings_status: "A61",
  employment: "A73",
  installment_rate: 4,
  personal_status: "A93",
  other_debtors: "A101",
  residence_since: 2,
  property_type: "A121",
  age: 35,
  other_installment_plans: "A143",
  housing: "A152",
  existing_credits: 1,
  job: "A173",
  dependents: 1,
  telephone: "A192",
  foreign_worker: "A201",
};

function formatFactor(factor) {
  const labels = {
    checking_status_A11: "Checking account status",
    checking_status_A14: "Checking account status",
    savings_status_A61: "Savings status",
    purpose_A40: "Loan purpose",
    purpose_A41: "Loan purpose",
    personal_status_A93: "Personal status",
    other_installment_plans_A143: "Other installment plans",
    property_type_A121: "Property type",
    duration_months: "Loan duration",
    credit_amount: "Credit amount",
    age: "Customer age",
    installment_rate: "Installment rate",
  };

  return labels[factor] || factor.replaceAll("_", " ");
}

const dropdownOptions = {
  checking_status: [
    { value: "A11", label: "< 0 DM" },
    { value: "A12", label: "0–200 DM" },
    { value: "A13", label: "≥ 200 DM" },
    { value: "A14", label: "No checking account" },
  ],

  credit_history: [
    { value: "A30", label: "No credits / paid duly" },
    { value: "A31", label: "All credits paid duly" },
    { value: "A32", label: "Existing credits paid duly" },
    { value: "A33", label: "Delay in paying" },
    { value: "A34", label: "Critical account / other credits" },
  ],

  purpose: [
    { value: "A40", label: "New car" },
    { value: "A41", label: "Used car" },
    { value: "A42", label: "Furniture / equipment" },
    { value: "A43", label: "Radio / television" },
    { value: "A44", label: "Domestic appliances" },
    { value: "A45", label: "Repairs" },
    { value: "A46", label: "Education" },
  ],

  savings_status: [
    { value: "A61", label: "< 100 DM" },
    { value: "A62", label: "100–500 DM" },
    { value: "A63", label: "500–1000 DM" },
    { value: "A64", label: "≥ 1000 DM" },
    { value: "A65", label: "Unknown / no savings" },
  ],

  employment: [
    { value: "A71", label: "Unemployed" },
    { value: "A72", label: "1–4 years" },
    { value: "A73", label: "4–7 years" },
    { value: "A74", label: "≥ 7 years" },
    { value: "A75", label: "Currently employed" },
  ],

  personal_status: [
    { value: "A91", label: "Male, divorced / separated" },
    { value: "A92", label: "Female, divorced / separated / married" },
    { value: "A93", label: "Male, single" },
    { value: "A94", label: "Male, married / widowed" },
  ],

  other_debtors: [
    { value: "A101", label: "None" },
    { value: "A102", label: "Co-applicant" },
    { value: "A103", label: "Guarantor" },
  ],

  property_type: [
    { value: "A121", label: "Real estate" },
    { value: "A122", label: "Building society / savings agreement" },
    { value: "A123", label: "Car or other property" },
    { value: "A124", label: "Unknown / no property" },
  ],

  housing: [
    { value: "A151", label: "Rent" },
    { value: "A152", label: "Own" },
    { value: "A153", label: "For free" },
  ],

  job: [
    { value: "A171", label: "Unskilled / non-resident" },
    { value: "A172", label: "Unskilled / resident" },
    { value: "A173", label: "Skilled employee / official" },
    { value: "A174", label: "Management / self-employed / highly qualified" },
  ],

  other_installment_plans: [
    { value: "A141", label: "Bank" },
    { value: "A142", label: "Stores" },
    { value: "A143", label: "None" },
  ],

  telephone: [
    { value: "A191", label: "No telephone" },
    { value: "A192", label: "Telephone registered" },
  ],

  foreign_worker: [
    { value: "A201", label: "Yes" },
    { value: "A202", label: "No" },
  ],
};

function App() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [predictionHistory, setPredictionHistory] = useState(() => {
  const savedHistory = localStorage.getItem("creditguard_history");

  return savedHistory
    ? JSON.parse(savedHistory)
    : [];
});
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate customer input
if (Number(form.age) < 18 || Number(form.age) > 100) {
  setError("Age must be between 18 and 100 years.");
  return;
}

if (Number(form.credit_amount) <= 0) {
  setError("Credit amount must be greater than 0.");
  return;
}

if (Number(form.duration_months) <= 0) {
  setError("Loan duration must be greater than 0 months.");
  return;
}

if (
  Number(form.installment_rate) < 1 ||
  Number(form.installment_rate) > 4
) {
  setError("Installment rate must be between 1 and 4.");
  return;
}

if (Number(form.residence_since) < 1) {
  setError("Residence since must be at least 1 year.");
  return;
}

if (Number(form.existing_credits) < 1) {
  setError("Existing credits must be at least 1.");
  return;
}

if (Number(form.dependents) < 0) {
  setError("Dependents cannot be negative.");
  return;
}

  setLoading(true);
  setError("");
  setResult(null);

  const payload = {
    ...form,
    duration_months: Number(form.duration_months),
    credit_amount: Number(form.credit_amount),
    installment_rate: Number(form.installment_rate),
    residence_since: Number(form.residence_since),
    age: Number(form.age),
    existing_credits: Number(form.existing_credits),
    dependents: Number(form.dependents),
  };

  try {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Prediction request failed.");
    }

    const data = await response.json();

    setResult(data);

    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      probability: data.probability,
      prediction: data.prediction,
      risk_level: data.risk_level,
    };

    setPredictionHistory((previousHistory) => {
      const updatedHistory = [
        historyItem,
        ...previousHistory,
      ].slice(0, 10);

      localStorage.setItem(
        "creditguard_history",
        JSON.stringify(updatedHistory)
      );

      return updatedHistory;
    });

  } catch (err) {
    setError(
      "Unable to connect to CreditGuard API. Make sure FastAPI is running."
    );
  } finally {
    setLoading(false);
  }
};

// This is OUTSIDE handleSubmit
const probability = result
  ? Math.round(result.probability * 100)
  : 0;
  const totalPredictions = predictionHistory.length;

const highRiskCount = predictionHistory.filter(
  (item) => item.risk_level === "High"
).length;

const lowRiskCount = predictionHistory.filter(
  (item) => item.risk_level === "Low"
).length;

const averageProbability =
  totalPredictions > 0
    ? predictionHistory.reduce(
        (sum, item) => sum + item.probability,
        0
      ) / totalPredictions
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-5">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl">
            🛡️
          </div>

          <div>
            <h1 className="text-xl font-bold">
              CreditGuard
            </h1>

            <p className="text-sm text-slate-400">
              AI Credit Risk Assessment
            </p>
          </div>

        </div>
      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Credit Risk Assessment
          </h2>

          <p className="mt-2 text-slate-400">
            Analyze customer credit risk using a machine learning model.
          </p>
        </div>


        <div className="grid gap-6 lg:grid-cols-2">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >

            <h3 className="mb-6 text-xl font-semibold">
              Customer Information
            </h3>


            <div className="grid gap-4 sm:grid-cols-2">

              <Input
                label="Credit Amount"
                name="credit_amount"
                type="number"
                value={form.credit_amount}
                onChange={handleChange}
              />

              <Input
                label="Duration (Months)"
                name="duration_months"
                type="number"
                value={form.duration_months}
                onChange={handleChange}
              />

              <Input
                label="Age"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />

              <Input
                label="Installment Rate"
                name="installment_rate"
                type="number"
                value={form.installment_rate}
                onChange={handleChange}
              />

              <Select
                label="Checking Status"
                name="checking_status"
                value={form.checking_status}
                onChange={handleChange}
                options={dropdownOptions.checking_status}
              />

              <Select
                label="Credit History"
                name="credit_history"
                value={form.credit_history}
                onChange={handleChange}
                options={dropdownOptions.credit_history}
              />

              <Select
                label="Purpose"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                options={dropdownOptions.purpose}
              />

              <Select
                label="Savings Status"
                name="savings_status"
                value={form.savings_status}
                onChange={handleChange}
                options={dropdownOptions.savings_status}
              />

              <Select
                label="Employment"
                name="employment"
                value={form.employment}
                onChange={handleChange}
                options={dropdownOptions.employment}
              />

              <Select
                label="Personal Status"
                name="personal_status"
                value={form.personal_status}
                onChange={handleChange}
                options={dropdownOptions.personal_status}
              />

              <Select
                label="Other Debtors"
                name="other_debtors"
                value={form.other_debtors}
                onChange={handleChange}
                options={dropdownOptions.other_debtors}
              />

              <Select
                label="Property Type"
                name="property_type"
                value={form.property_type}
                onChange={handleChange}
                options={dropdownOptions.property_type}
              />

              <Select
                label="Housing"
                name="housing"
                value={form.housing}
                onChange={handleChange}
                options={dropdownOptions.housing}
              />

              <Select
                label="Job"
                name="job"
                value={form.job}
                onChange={handleChange}
                options={dropdownOptions.job}
              />

              <Select
                label="Other Installment Plans"
                name="other_installment_plans"
                value={form.other_installment_plans}
                onChange={handleChange}
                options={dropdownOptions.other_installment_plans}
              />

              <Select
                label="Telephone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                options={dropdownOptions.telephone}
              />

              <Select
                label="Foreign Worker"
                name="foreign_worker"
                value={form.foreign_worker}
                onChange={handleChange}
                options={dropdownOptions.foreign_worker}
              />

            </div>


            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              <Input
                label="Residence Since"
                name="residence_since"
                type="number"
                value={form.residence_since}
                onChange={handleChange}
              />

              <Input
                label="Existing Credits"
                name="existing_credits"
                type="number"
                value={form.existing_credits}
                onChange={handleChange}
              />

              <Input
                label="Dependents"
                name="dependents"
                type="number"
                value={form.dependents}
                onChange={handleChange}
              />

            </div>


            {error && (
              <div className="mt-5 rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Analyzing Credit Risk..."
                : "Assess Credit Risk"}
            </button>

          </form>


          {/* RESULT */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h3 className="mb-6 text-xl font-semibold">
              Risk Assessment
            </h3>


            {!result && !loading && (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                <div className="mb-5 text-7xl">
                  🛡️
                </div>

                <h4 className="text-xl font-semibold">
                  Ready for Assessment
                </h4>

                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Enter customer information and let CreditGuard
                  evaluate the credit risk.
                </p>

              </div>
            )}


            {loading && (
              <div className="flex min-h-[500px] flex-col items-center justify-center">

                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                <p className="mt-5 text-slate-400">
                  Running ML prediction...
                </p>

              </div>
            )}


            {result && !loading && (
              <div>

                {/* Risk Score */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center">

                  <p className="text-sm text-slate-400">
                    Bad Credit Probability
                  </p>

                  <div className="relative mx-auto mt-5 h-40 w-40">
  <svg
    className="h-full w-full -rotate-90"
    viewBox="0 0 120 120"
  >
    <circle
      cx="60"
      cy="60"
      r="50"
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      className="text-slate-800"
    />

    <circle
      cx="60"
      cy="60"
      r="50"
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      strokeDasharray={`${probability * 3.14} 314`}
      className={
        result.risk_level === "High"
          ? "text-red-500"
          : "text-green-500"
      }
    />
  </svg>

  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-3xl font-bold">
      {probability}%
    </span>

    <span className="text-xs text-slate-400">
      Risk
    </span>
  </div>
</div>

                  <div
                    className={`mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                      result.risk_level === "High"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {result.risk_level} Risk
                  </div>

                  <div className="mt-4">

  <p
    className={`text-2xl font-bold ${
      result.risk_level === "High"
        ? "text-red-400"
        : "text-green-400"
    }`}
  >
    {result.prediction}
  </p>

  <p className="mt-1 text-sm text-slate-500">
    Model decision based on {Math.round(result.threshold * 100)}% threshold
  </p>

</div>

                </div>


                {/* Risk Factors */}
                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-5">

                    <h4 className="font-semibold text-red-400">
                      Risk Factors
                    </h4>

                    <ul className="mt-4 space-y-2 text-sm text-slate-300">

                      {result.risk_factors?.map((factor, index) => (
                        <li key={index} className="flex gap-2">
  <span>•</span>
  <span>{formatFactor(factor)}</span>
</li>
                      ))}

                    </ul>

                  </div>


                  <div className="rounded-xl border border-green-900/50 bg-green-950/20 p-5">

                    <h4 className="font-semibold text-green-400">
                      Protective Factors
                    </h4>

                    <ul className="mt-4 space-y-2 text-sm text-slate-300">

                      {result.protective_factors?.map((factor, index) => (
                        <li key={index} className="flex gap-2">
  <span>•</span>
  <span>{formatFactor(factor)}</span>
</li>
                      ))}

                    </ul>

                  </div>

                </div>


                {/* Threshold */}
                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <div className="flex justify-between text-sm">

                    <span className="text-slate-400">
                      Decision Threshold
                    </span>

                    <span className="font-semibold">
                      {Math.round(result.threshold * 100)}%
                    </span>

                  </div>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
    <p className="text-xs text-slate-500">
      MODEL
    </p>

    <p className="mt-1 font-semibold">
      Logistic Regression
    </p>
  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
    <p className="text-xs text-slate-500">
      ROC-AUC
    </p>

    <p className="mt-1 font-semibold">
      0.8094
    </p>
  </div>

</div>

              </div>
            )}

          </div>

          {/* Dashboard Analytics */}
<section className="mt-8">

  <div className="mb-5">
    <h3 className="text-xl font-semibold">
      Dashboard Analytics
    </h3>

    <p className="mt-1 text-sm text-slate-400">
      Overview of recent credit assessments
    </p>
  </div>


  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    {/* Total */}
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        Total Assessments
      </p>

      <p className="mt-3 text-3xl font-bold">
        {totalPredictions}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Last 10 predictions
      </p>

    </div>


    {/* High Risk */}
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        High Risk
      </p>

      <p className="mt-3 text-3xl font-bold text-red-400">
        {highRiskCount}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Bad credit predictions
      </p>

    </div>


    {/* Low Risk */}
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        Low Risk
      </p>

      <p className="mt-3 text-3xl font-bold text-green-400">
        {lowRiskCount}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Good credit predictions
      </p>

    </div>


    {/* Average */}
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

      <p className="text-sm text-slate-400">
        Average Risk
      </p>

      <p className="mt-3 text-3xl font-bold">
        {(averageProbability * 100).toFixed(1)}%
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Average bad-credit probability
      </p>

    </div>

  </div>

</section>

{totalPredictions > 0 && (
  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900 p-6">

    <div className="flex items-center justify-between">

      <div>
        <h4 className="font-semibold">
          Risk Distribution
        </h4>

        <p className="mt-1 text-sm text-slate-500">
          Distribution across recent assessments
        </p>
      </div>

      <span className="text-sm text-slate-400">
        {totalPredictions} total
      </span>

    </div>


    <div className="mt-5 h-4 w-full overflow-hidden rounded-full bg-slate-800">

      <div
        className="h-full bg-red-500 transition-all"
        style={{
          width: `${(highRiskCount / totalPredictions) * 100}%`,
        }}
      />

    </div>


    <div className="mt-4 flex justify-between text-sm">

      <span className="text-red-400">
        High Risk:{" "}
        {((highRiskCount / totalPredictions) * 100).toFixed(1)}%
      </span>

      <span className="text-green-400">
        Low Risk:{" "}
        {((lowRiskCount / totalPredictions) * 100).toFixed(1)}%
      </span>

    </div>

  </div>
)}

          {/* Prediction History */}
<section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

  <div className="mb-6 flex items-center justify-between">

    <div>
      <h3 className="text-xl font-semibold">
        Prediction History
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        Your recent credit risk assessments
      </p>
    </div>

    {predictionHistory.length > 0 && (
      <button
        onClick={() => {
          localStorage.removeItem("creditguard_history");
          setPredictionHistory([]);
        }}
        className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-red-500 hover:text-red-400"
      >
        Clear History
      </button>
    )}

  </div>


  {predictionHistory.length === 0 ? (

    <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">

      <div className="text-4xl">
        📋
      </div>

      <p className="mt-3 text-slate-400">
        No predictions yet
      </p>

      <p className="mt-1 text-sm text-slate-500">
        Your recent assessments will appear here.
      </p>

    </div>

  ) : (

    <div className="overflow-x-auto">

      <table className="w-full text-left text-sm">

        <thead>
          <tr className="border-b border-slate-800 text-slate-500">

            <th className="px-4 py-3 font-medium">
              Time
            </th>

            <th className="px-4 py-3 font-medium">
              Probability
            </th>

            <th className="px-4 py-3 font-medium">
              Risk
            </th>

            <th className="px-4 py-3 font-medium">
              Decision
            </th>

          </tr>
        </thead>


        <tbody>

          {predictionHistory.map((item) => (

            <tr
              key={item.id}
              className="border-b border-slate-800/70"
            >

              <td className="px-4 py-4 text-slate-400">
                {item.timestamp}
              </td>


              <td className="px-4 py-4 font-semibold">
                {(item.probability * 100).toFixed(2)}%
              </td>


              <td className="px-4 py-4">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.risk_level === "High"
                      ? "bg-red-500/10 text-red-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {item.risk_level}
                </span>

              </td>


              <td className="px-4 py-4">

                <span
                  className={
                    item.prediction === "Bad Credit"
                      ? "text-red-400"
                      : "text-green-400"
                  }
                >
                  {item.prediction}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

</section>

        </div>

      </main>

    </div>
  );
}


function Input({
  label,
  name,
  type,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm text-slate-400">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
      />

    </div>
  );
}


function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-400">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;