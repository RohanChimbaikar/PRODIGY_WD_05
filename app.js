const apiKey = "8e75fc7fa127e320cabdadd367280bce";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

function formatTime(unixTimestamp, timezoneOffset = 0) {
  // unixTimestamp and timezoneOffset are both in seconds
  // Calculate local time in milliseconds
  const localTimestamp = (unixTimestamp + timezoneOffset) * 1000;
  const localDate = new Date(localTimestamp);

  // Use getUTCHours and getUTCMinutes to get time relative to UTC (since we manually added offset)
  const hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minuteStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hour12}:${minuteStr} ${ampm}`;
}

function formatDate(unixTimestamp, timezoneOffset = 0) {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);

  const year = date.getUTCFullYear();
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();

  return `${month} ${day}, ${year}`;
}

async function checkWeather(city) {
  city = city.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);

  if (!response.ok) {
    alert("City not found");
    return;
  }

  const data = await response.json();
  const timezoneOffset = data.timezone; // in seconds

  // Update city and main temperature
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";
  document.querySelector(".clouds").innerHTML = data.clouds.all + "%";
  document.querySelector(".pressure").innerHTML = data.main.pressure + " hPa";

  // Format sunrise and sunset times with timezone offset
  document.querySelector(".sunrise").innerHTML = formatTime(data.sys.sunrise, timezoneOffset);
  document.querySelector(".sunset").innerHTML = formatTime(data.sys.sunset, timezoneOffset);

  // Capitalize first letter of weather description
  const capitalizedDescription = data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1);
  document.querySelector(".condition").innerHTML = capitalizedDescription;

  // Current UTC timestamp in seconds
  const nowUTC = Math.floor(Date.now() / 1000);
  document.querySelector(".local-time").innerHTML = formatTime(nowUTC, timezoneOffset);
  document.querySelector(".local-date").innerHTML = formatDate(nowUTC, timezoneOffset);

  // Update weather icon
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.src = iconUrl;
  weatherIcon.alt = data.weather[0].description;
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
  }
});
