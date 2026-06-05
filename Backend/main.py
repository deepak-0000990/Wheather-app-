from pathlib import Path

import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()


BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")


@app.get("/")
def read_index():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/weather")
def get_weather(city: str):
    city = city.strip()
    if not city:
        raise HTTPException(status_code=400, detail="Please enter a city name.")

    api_key = "7dbf5eca9ef848f1a6e130407260506"

    url = f"https://api.weatherapi.com/v1/current.json?key={api_key}&q={city}&aqi=no"

    try:
        response = requests.get(url, timeout=10)
    except requests.RequestException:
        raise HTTPException(status_code=503, detail="Unable to reach the weather service right now.")

    if response.status_code == 400:
        raise HTTPException(status_code=404, detail="City not found. Try another city name.")
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Weather service returned an error. Please try again.")

    data = response.json()
    current = data["current"]
    location = data["location"]

    return {
        "city": location["name"],
        "temperature": current["temp_c"],
        "weather": current["condition"]["text"],
        "humidity": current["humidity"],
        "wind_speed": current["wind_kph"],
        "icon": current["condition"]["icon"],
    }
