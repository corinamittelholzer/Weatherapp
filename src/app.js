//new Date();

function getWeatherByCurrentLocation(position) {
  let apiKey = "833c266388856a77756df0737bbad0be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(changeWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getWeatherByCurrentLocation);
}

let currentLocationButton = document.querySelector("#current-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let cityTemperature;

function search(cityName) {
  let apiKey = "833c266388856a77756df0737bbad0be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric`;

  axios.get(`${apiUrl}&appid=${apiKey}`).then(changeWeather);
}

function getWeatherByCityName(event) {
  event.preventDefault();
  let cityName = document.querySelector("#cityname-input").value;
  search(cityName);
}

function changeWeather(response) {
  //console.log(response.data);
  changeDate(response);
  changeLocation(response);
  changeTemperature(response);
  changeDescription(response);
  changeWindspeed(response);
  changeHumidity(response);
  changeIcon(response);
  changeBackground(response);
  getForecast(response);
}

function changeDate(response) {
  let currentDate = new Date(response.data.dt * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[currentDate.getDay()];
  let date = currentDate.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[currentDate.getMonth()];

  let h2 = document.querySelector("h2");
  h2.innerHTML = `${day}, ${month} ${date}`;

  let hour = currentDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = currentDate.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  let currentTime = document.querySelector("#current-time");
  currentTime.innerHTML = `updated at ${hour}:${minute}`;
}

function changeLocation(response) {
  let cityName = response.data.name;
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${cityName}`;
}

function changeTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#temperature-now");
  temperatureElement.innerHTML = `${temperature}`;
  cityTemperature = temperature;
}

function changeDescription(response) {
  let description = response.data.weather[0].description;
  let descriptionElement = document.querySelector("#weather-description");
  descriptionElement.innerHTML = `${description}`;
}

function changeWindspeed(response) {
  let windspeed = response.data.wind.speed;
  let windElement = document.querySelector("#windspeed");
  windElement.innerHTML = `Wind: ${Math.round(windspeed)}km/h`;
}

function changeHumidity(response) {
  let humidity = response.data.main.humidity;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `Humidity: ${Math.round(humidity)}%`;
}

function changeIcon(response) {
  let iconElement = document.querySelector("#icon-now");
  iconElement.setAttribute(
    "src",
    `images/${response.data.weather[0].icon}.svg`
  );
}

function changeBackground(response) {
  let body = document.querySelector("body");
  body.setAttribute("class", `background${response.data.weather[0].icon}`);
  //body.classList.remove(body.classList.item(0));
  //body.classList.add(`background${response.data.weather[0].icon}`);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getWeatherByCityName);

function toFahrenheit(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = `${Math.round((cityTemperature * 9) / 5 + 32)}`;
  changeToC.classList.remove("active");
  changeToF.classList.add("active");
}

let changeToF = document.querySelector("#change-to-f");
changeToF.addEventListener("click", toFahrenheit);

function toCelsius(event) {
  event.preventDefault();
  let temperatureNow = document.querySelector("#temperature-now");
  temperatureNow.innerHTML = `${cityTemperature}`;
  changeToF.classList.remove("active");
  changeToC.classList.add("active");
}

let changeToC = document.querySelector("#change-to-c");
changeToC.addEventListener("click", toCelsius);

search("Zürich");

function getForecast(response) {
  let apiKey = "833c266388856a77756df0737bbad0be";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function formatDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  return `${day}/${month}`;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(response.data.daily);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="card">
            <div class="card-body">
            <h3 class="day">${formatDay(forecastDay.dt)}</h3>
            <p class="date">${formatDate(forecastDay.dt)}</p>
            <img class="icon" src="images/${forecastDay.weather[0].icon}.svg" />
            <p class="temperature-max">${Math.round(
              forecastDay.temp.max
            )}° <span class="temperature-min">${Math.round(
          forecastDay.temp.min
        )}°<span> </p>
          </div> </div>`;
    }
  });

  //  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
