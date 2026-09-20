import tkinter as tk
from tkinter import messagebox
import joblib
import numpy as np

# Loading Model

model = joblib.load("Price_Estimator.pkl")


def predict_price():
    try:
        area = float(entry_area.get())
        bedrooms = int(entry_bedrooms.get())
        bathrooms = int(entry_bathrooms.get())
        floors = int(entry_floors.get())
        year = int(entry_year.get())
        tier = int(entry_tier.get())

        features = np.array([[area, bedrooms, bathrooms, floors, year, tier]])

        price = model.predict(features)[0]

        label_result.config(
            text=f"Estimated Price: {price:.2f} Lakhs",
            fg="green"
        )

    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid values")

#GUI code using tkinter

root = tk.Tk()
root.title("Housing Price Estimator")
root.geometry("420x460")

title = tk.Label(root, text="Housing Price Estimator",
                 font=("Arial", 16, "bold"))
title.pack(pady=10)

frame = tk.Frame(root)
frame.pack(pady=10)

def add_input(label_text):
    row = tk.Frame(frame)
    row.pack(pady=5)
    lbl = tk.Label(row, text=label_text, width=18, anchor="w")
    lbl.pack(side=tk.LEFT)
    ent = tk.Entry(row)
    ent.pack(side=tk.RIGHT)
    return ent

entry_area = add_input("Area (sqft):")
entry_bedrooms = add_input("Bedrooms:")
entry_bathrooms = add_input("Bathrooms:")
entry_floors = add_input("Floors:")
entry_year = add_input("Year Built:")
entry_tier = add_input("Tier (1/2/3):")

btn = tk.Button(root, text="Predict Price",
                command=predict_price, bg="blue", fg="white")
btn.pack(pady=15)

label_result = tk.Label(root, text="", font=("Arial", 14))
label_result.pack(pady=10)

root.mainloop()
