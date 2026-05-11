// fetch weather data and display results


let apiKey = "b246b4394aaa61364af75cdafc0c0390"; // <-- Paste your OpenWeatherMap API key here


const cityInput = document.getElementById('cityInput');
const myLocationBtn = document.getElementById('myLocationBtn');

const mapEl = document.getElementById('map');

const searchBtn = document.getElementById('searchBtn');
const errorMsg = document.getElementById('errorMsg');
const weatherSection = document.getElementById('weatherSection');

const cityNameEl = document.getElementById('cityName');
const countryCodeEl = document.getElementById('countryCode');
const weatherIconEl = document.getElementById('weatherIcon');
const tempEl = document.getElementById('temp');
const conditionEl = document.getElementById('condition');

const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const visibilityEl = document.getElementById('visibility');

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
  weatherSection.hidden = true;
}

function hideError() {
  errorMsg.hidden = true;
}

function displayWeather(data) {
  // City name, country code
  cityNameEl.textContent = data.name;
  countryCodeEl.textContent = data.sys.country;

  // Weather icon
  const iconCode = data.weather && data.weather[0] ? data.weather[0].icon : '';
  weatherIconEl.src = iconCode
    ? `https://openweathermap.org/img/wn/${iconCode}@2x.png`
    : '';
  weatherIconEl.alt = data.weather && data.weather[0] ? data.weather[0].description : 'Weather icon';

  // Temp + condition
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  conditionEl.textContent = data.weather && data.weather[0] ? toTitle(data.weather[0].description) : '';

  // Info cards
  humidityEl.textContent = `${data.main.humidity}%`;

  // wind speed comes in m/s => convert to km/h
  const windKmh = data.wind && typeof data.wind.speed === 'number' ? data.wind.speed * 3.6 : 0;
  windEl.textContent = `${Math.round(windKmh)} km/h`;

  // visibility comes in metres => convert to km
  const visibilityKm = data.visibility != null ? data.visibility / 1000 : 0;
  visibilityEl.textContent = `${visibilityKm >= 1 ? visibilityKm.toFixed(1) : visibilityKm.toFixed(2)} km`;

  hideError();
  weatherSection.hidden = false;
}

function toTitle(str) {
  return String(str)
    .split(' ')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ');
}

function getCityFromInput() {
  return cityInput.value.trim();
}

function fetchWeather(city) {
  // Straightforward fetch with .then() (not async/await)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        return res.json().then((errData) => {
          const msg = errData && errData.message ? errData.message : 'City not found. Please try again.';
          showError(msg);
          return null;
        });
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;

      // Move map marker + center using returned coordinates (same behavior as geolocation/map click)
      if (data.coord && typeof data.coord.lat === 'number' && typeof data.coord.lon === 'number') {
        updateMapFromCoords(data.coord.lat, data.coord.lon);
      }

      displayWeather(data);
    })
    .catch(() => {
      showError('Weather service failed. Please try again.');
    });
}


function onSearch() {
  if (!apiKey) {
    showError('City not found. Please try again.');
    return;
  }

  const city = getCityFromInput();
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  // hide old error when searching
  hideError();
  fetchWeather(city);
}

function updateMapFromCoords(lat, lon) {
  if (marker) marker.setLatLng([lat, lon]);
  if (map) map.setView([lat, lon], 10);
}



searchBtn.addEventListener('click', onSearch);
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') onSearch();
});

// Initialize Leaflet map
const defaultLat = 20;
const defaultLon = 0;
const defaultZoom = 2;

let map;
let marker;

if (mapEl && typeof L !== 'undefined' && myLocationBtn) {

  map = L.map('map', { worldCopyJump: true }).setView([defaultLat, defaultLon], defaultZoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  marker = L.marker([defaultLat, defaultLon]).addTo(map);

  map.on('click', (e) => {
    if (!apiKey) {
      showError('Please add your OpenWeatherMap API key in script.js');
      return;
    }

    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    // Simple marker move
    if (marker) marker.setLatLng([lat, lon]);

  fetchWeatherByCoords(lat, lon);

    if (map) map.setView([lat, lon], 10);
  });
}

function fetchWeatherByCoords(lat, lon) {
  // Straightforward fetch with .then() (not async/await)
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((res) => {
      if (res.status === 404) {
        showError('Location not found. Please try again.');
        return null;
      }
      if (!res.ok) {
        showError('Weather service failed. Please try again.');
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (!data) return;
      displayWeather(data);
    })
    .catch(() => {
      showError('Weather service failed. Please try again.');
    });
}




myLocationBtn.addEventListener('click', () => {
  if (!apiKey) {
    showError('Please add your OpenWeatherMap API key in script.js');
    return;
  }

  if (!navigator.geolocation) {
    showError('Geolocation is not supported by this browser');
    return;
  }

  hideError();

  // Use browser geolocation API
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      if (marker) marker.setLatLng([lat, lon]);
      if (map) map.setView([lat, lon], 10);

      fetchWeatherByCoords(lat, lon);
    },
    (err) => {
      if (err && err.code === 1) {
        showError('Location access denied. Please allow location permission.');
      } else {
        showError('Could not get your location. Please try again.');
      }
    }
  );
});


