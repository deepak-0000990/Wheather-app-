const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const message = document.querySelector("#message");
const weatherCard = document.querySelector("#weather-card");
const cityName = document.querySelector("#city-name");
const condition = document.querySelector("#condition");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const wind = document.querySelector("#wind");
const weatherIcon = document.querySelector("#weather-icon");
const submitButton = form.querySelector("button");

function setMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Loading" : "Search";
}

function showWeather(data) {
  cityName.textContent = data.city;
  condition.textContent = data.weather;
  temperature.textContent = Math.round(data.temperature);
  humidity.textContent = `${data.humidity}%`;
  wind.textContent = `${data.wind_speed} km/h`;
  weatherIcon.src = data.icon.startsWith("http") ? data.icon : `https:${data.icon}`;
  weatherIcon.alt = data.weather;
  weatherCard.classList.remove("is-hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    weatherCard.classList.add("is-hidden");
    setMessage("Please enter a city name.", true);
    cityInput.focus();
    return;
  }

  setLoading(true);
  setMessage("Checking current weather...");

  try {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.detail || "Weather server returned an unexpected response.");
    }

    showWeather(data);
    setMessage("Updated just now.");
  } catch (error) {
    weatherCard.classList.add("is-hidden");
    setMessage(error.message || "Something went wrong. Please try again.", true);
  } finally {
    setLoading(false);
  }
});
