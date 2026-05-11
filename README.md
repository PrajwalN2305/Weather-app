# Weather App (HTML • CSS • JavaScript)

A simple, responsive weather application with a **Leaflet world map**. Click anywhere on the map to fetch weather for that location, search by city name, or use **Use My Location** (browser geolocation).

---

## Features
- 🌍 Interactive world map (Leaflet)
- 🖱️ Click map to fetch weather by coordinates (lat/lon)
- 🔎 City search with **Search button** + **Enter key**
- 📍 **Use My Location** using browser geolocation API
- ✅ Displays:
  - City name + country code
  - Weather icon
  - Temperature (°C)
  - Weather condition
  - Humidity (%)
  - Wind speed (km/h)
  - Visibility (km)
- 🛑 Error messages show OpenWeatherMap API response when possible
- 📱 Mobile responsive UI

---

## Tech Stack
- HTML, CSS, JavaScript (no frameworks)
- Leaflet.js (CDN)
- OpenWeatherMap API
- Google Fonts (Poppins)

---

## Setup
1. Get an API key from **OpenWeatherMap**.
2. Open `script.js` and paste your key into:
   ```js
   let apiKey = "PASTE_YOUR_OPENWEATHERMAP_KEY";
   ```
3. Run locally:
   ```bash
   python -m http.server 5500
   ```
4. Open your browser:
   - `http://localhost:5500`

---

## How it Works
- **City search** calls:
  `https://api.openweathermap.org/data/2.5/weather?q=CITYNAME&appid=APIKEY&units=metric`
- **Map click / geolocation** calls:
  `https://api.openweathermap.org/data/2.5/weather?lat=LAT&lon=LON&appid=APIKEY&units=metric`
- Wind conversion:
  - OpenWeatherMap returns m/s → displayed as **km/h** (× 3.6)
- Visibility conversion:
  - OpenWeatherMap returns meters → displayed as **km** (÷ 1000)

---

## Files
- `index.html`
- `style.css`
- `script.js`

---

## Notes
- If you see an API error (like invalid API key), verify the key in `script.js`.
- Geolocation requires browser permission.

---

**Made by Prajwal N**

