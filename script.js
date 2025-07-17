const userLocation = document.getElementById("userLocation"),
  converter = document.getElementById("converter"),
  weatherIcon = document.querySelector(".weatherIcon"),
  temperature = document.querySelector(".temperature"),
  feelsLike = document.querySelector(".feelslike"),
  description = document.querySelector(".description"),
  date = document.querySelector(".date"),
  city = document.querySelector(".city"),
  HValue = document.getElementById("Hvalue"),
  WValue = document.getElementById("Wvalue"),
  SRValue = document.getElementById("SRValue"),
  SSValue = document.getElementById("SSValue"),
  CValue = document.getElementById("Cvalue"),
  PValue = document.getElementById("Pvalue"),
  Forecast = document.querySelector(".Forecast");

let currentUnit = "metric";
const API_KEY = "b4e92b86beae8ef1900d85aafc356594";

function convertTime(timestamp, offset) {
  const local = new Date((timestamp + offset) * 1000);
  return local.toUTCString().slice(17, 22);
}

function findUserLocation() {
  const location = userLocation.value.trim();
  if (!location) return alert("Please enter a location.");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${currentUnit}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (!data || data.cod !== 200) return alert("Location not found.");

      const unitSymbol = currentUnit === "metric" ? "°C" : "°F";
      const speedUnit = currentUnit === "metric" ? "km/h" : "mph";

      city.textContent = data.name;
      temperature.textContent = `${data.main.temp}${unitSymbol}`;
      feelsLike.textContent = `Feels like ${data.main.feels_like}${unitSymbol}`;
      description.textContent = data.weather[0].description;
      weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />`;
      date.textContent = new Date().toDateString();

      HValue.textContent = `${data.main.humidity}%`;
      WValue.textContent = `${data.wind.speed} ${speedUnit}`;
      CValue.textContent = `${data.clouds.all}%`;
      PValue.textContent = `${data.main.pressure} hPa`;
      SRValue.textContent = convertTime(data.sys.sunrise, data.timezone);
      SSValue.textContent = convertTime(data.sys.sunset, data.timezone);

      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${currentUnit}&appid=${API_KEY}`)
        .then(res => res.json())
        .then(forecastData => {
          Forecast.innerHTML = "";
          const grouped = {};
          forecastData.list.forEach(item => {
            const day = new Date(item.dt_txt).toDateString();
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(item);
          });

          Object.keys(grouped).slice(1, 6).forEach(day => {
            const items = grouped[day];
            const temps = items.map(i => i.main.temp);
            const min = Math.min(...temps).toFixed(1);
            const max = Math.max(...temps).toFixed(1);
            const icon = items[0].weather[0].icon;
            const desc = items[0].weather[0].description;

            const card = document.createElement("div");
            card.innerHTML = `
              <h4>${day}</h4>
              <img src="https://openweathermap.org/img/wn/${icon}.png" />
              <p>${desc}</p>
              <p>Min: ${min}${unitSymbol} | Max: ${max}${unitSymbol}</p>
            `;
            Forecast.appendChild(card);
          });
        });
    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch data.");
    });
}

// Event Listeners
document.querySelector(".fa-search").addEventListener("click", findUserLocation);
userLocation.addEventListener("keydown", e => {
  if (e.key === "Enter") findUserLocation();
});
converter.addEventListener("change", () => {
  currentUnit = converter.value;
  findUserLocation();
});

// Raindrop effect
const rainContainer = document.querySelector('.rain-container');
const rainCount = 100;
for (let i = 0; i < rainCount; i++) {
  const drop = document.createElement('div');
  drop.classList.add('raindrop');
  drop.style.left = `${Math.random() * 100}vw`;
  drop.style.animationDuration = `${Math.random() * 1.5 + 0.5}s`;
  drop.style.animationDelay = `${Math.random() * 3}s`;
  rainContainer.appendChild(drop);
};
