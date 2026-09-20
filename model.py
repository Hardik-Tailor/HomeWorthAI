import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import pickle


# Load Dataset

data = pd.read_excel("Housing_Dataset.xlsx")

# Selecting House Feature Columns

X = data[['BEDROOMS','BATHROOMS','SQUARE_FT','YEAR_BUILT','FLOORS','TIER']]
y = data['PRICE_LAKHS']   # Target column


# Split Data

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


# Training Model

from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
print(model.score(X_test, y_test))


# Testing Accuracy

y_pred = model.predict(X_test)

print("R2 Score:", r2_score(y_test, y_pred))
print("MAE:", mean_absolute_error(y_test, y_pred))

# 7. Save Model as .pkl

with open("Price_Estimator.pkl", "wb") as file:
    pickle.dump(model, file)

print("Model Saved Successfully")
