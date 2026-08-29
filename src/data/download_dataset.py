from ucimlrepo import fetch_ucirepo
import pandas as pd
from pathlib import Path

# Fetch German Credit dataset
dataset = fetch_ucirepo(id=144)

# Features and target
X = dataset.data.features
y = dataset.data.targets

# Combine into one DataFrame
df = pd.concat([X, y], axis=1)

# Create output directory
output_path = Path("data/raw")
output_path.mkdir(parents=True, exist_ok=True)

# Save dataset
file_path = output_path / "german_credit.csv"
df.to_csv(file_path, index=False)

print("Dataset downloaded successfully!")
print(f"Shape: {df.shape}")
print(f"Saved to: {file_path}")