const input = document.querySelector("input");
const city = document.querySelector(".city");
const condition = document.querySelector(".condition");
const subCondition = document.querySelector(".temps p");
const temp = document.querySelector(".temps h2");
const date = document.querySelector(".date p");
const img = document.querySelector(".img-fluid");

const WEATHER_CODE_MAP = {
  // ☀️ Clear
  1000: "clear",

  // ⛅ Partly cloudy
  1003: "partly-cloudy",

  // ☁️ Cloudy / Overcast
  1006: "cloudy",
  1009: "overcast",

  // 🌫 Mist / Fog / Freezing fog
  1030: "fog",
  1135: "fog",
  1147: "fog",

  // 🌁 Haze / Smoke / Dust
  1035: "haze",
  1039: "smoke",
  1114: "dust",
  1117: "dust",

  // 🌦 Drizzle
  1150: "drizzle",
  1153: "drizzle",

  // 🌧 Rain
  1180: "rain",
  1183: "rain",
  1186: "rain",
  1189: "rain",
  1192: "rain",
  1195: "rain",

  // 🧊 Freezing rain / Sleet
  1168: "sleet",
  1171: "sleet",
  1198: "extreme-rain",
  1201: "extreme-rain",

  // ❄ Snow
  1210: "snow",
  1213: "snow",
  1216: "snow",
  1219: "snow",
  1222: "snow",
  1225: "snow",

  // 🌨 Ice pellets / Hail
  1237: "hail",
  1249: "sleet",
  1252: "sleet",
  1261: "hail",
  1264: "hail",

  // ⛈ Thunderstorms
  1273: "thunderstorms-rain",
  1276: "thunderstorms-extreme-rain",
  1279: "thunderstorms-snow",
  1282: "thunderstorms-extreme-snow",
};

const apikey = "3dcba07cf7a4452a8e6120524251712";
const apiUrl = "https://api.weatherapi.com/v1/current.json?&q=";

const apiUrlForecast = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=&days=14`;
const humidity = document.querySelector(".humidity");
const windSpd = document.querySelector(".wind-speed");
const pressure = document.querySelector(".pressure");
const visibility = document.querySelector(".visibility");
const sunRise = document.querySelector(".sun-rise");
const sunSet = document.querySelector(".sunset");

function normalizeCondition(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[^a-z-]/g, ""); // remove junk chars
}

function getWeatherIcon(condition, isDay) {
  const base = WEATHER_CODE_MAP[condition.code] || "not-available";
  const time = isDay ? "day" : "night";
  // console.log(condition);

  if (base == "clear") {
    return `./images/clear-${time}.svg`;
  }

  // Partly cloudy
  if (base == "partly-cloudy") {
    return `./images/partly-cloudy-${time}.svg`;
  }

  // Fog / Mist / Haze / Smoke / Dust
  if (["fog", "mist", "haze", "smoke", "dust"].includes(base)) {
    return `./images/${base}-${time}.svg`;
  }

  // Thunderstorms
  if (base.startsWith("thunderstorms")) {
    return `./images/${base}-${time}.svg`;
  }

  if (base === "overcast") {
    return `./images/overcast-${time}.svg`;
  }

  return `./images/partly-cloudy-${time}-${base}.svg`;
}

async function setData(input) {
  console.log("forecast api--------------------------\n");
  const url = `https://corsproxy.io/?https://api.weatherapi.com/v1/forecast.json?key=3dcba07cf7a4452a8e6120524251712&q=Ulaanbaatar&days=14`;

  const responseForecast = await fetch(url);
  const dataForcast = await responseForecast.json();

  const forecastArray = dataForcast.forecast.forecastday;

  // console.log(forecastArray); // Array(14)
  // console.log(forecastArray[0].astro.sunrise); // First day
  // console.log(forecastArray[0].date); // "2025-12-18"

  // console.log(responseForecast);
  //-----------------------------------------------------------

  var response = await fetch(`${apiUrl}${input}&key=${apikey}`);
  const data = await response.json();
  console.log(response);

  city.innerHTML = `${data.location.name}, ${data.location.country}`;
  condition.innerHTML = data.current.condition.text;
  subCondition.innerHTML = "Feels like " + data.current.feelslike_c + "°C";
  temp.innerHTML = data.current.temp_c + "°C";
  date.innerHTML = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  humidity.innerHTML = data.current.humidity + "%";
  windSpd.innerHTML = data.current.wind_kph + "km/h";
  pressure.innerHTML = data.current.pressure_mb + " hPa";
  visibility.innerHTML = data.current.vis_km + " km";
  sunRise.innerHTML = forecastArray[0].astro.sunrise;
  sunSet.innerHTML = forecastArray[0].astro.sunset;

  console.log(data);
  const conditionText = data.current.condition.text;
  const normalized = normalizeCondition(conditionText);
  const timeOfDay = data.current.is_day ? "day" : "night";
  let fileName = `${normalized}-${timeOfDay}.svg`;
  img.src = getWeatherIcon(data.current.condition, data.current.is_day);

  const today = forecastArray[0];
  const tempHrsContainer = document.querySelector(".temp-hrs");
  tempHrsContainer.innerHTML = "";

  const currentHour = new Date().getHours();

  forecastArray[0].hour.slice(currentHour, currentHour + 8).forEach((hour) => {
    const time = hour.time.split(" ")[1];

    const hrsItem = document.createElement("div");
    hrsItem.className = "hrs-item";

    hrsItem.innerHTML = `
      <p>${time}</p>
      <img src="${getWeatherIcon(hour.condition, hour.is_day)}" width="75px" />
      <p class="cond-title">${hour.condition.text}</p>
      <p class="hrs-temp">${Math.round(hour.temp_c)}°C</p>
    `;

    tempHrsContainer.appendChild(hrsItem);
  });
}

input.addEventListener("keydown", (event) => {
  console.log("You pressed a key!");
  if (event.key == "Enter") {
    let value = input.value.trim();
    if (value !== "") {
      setData(value);
      input.blur();
    }
  }
});
