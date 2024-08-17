document.addEventListener("DOMContentLoaded", () => {
    const cityName = document.querySelector(".weather_city");
    const dateTime = document.querySelector(".weather_date_time");
    const w_forecast = document.querySelector(".weather_forecast");
    const w_icon = document.querySelector(".weather_icon");
    const w_temperature = document.querySelector(".weather_temperature");
    const w_minTem = document.querySelector(".weather_min");
    const w_maxTem = document.querySelector(".weather_max");
  
    const w_feelsLike = document.querySelector(".weather_feelsLike");
    const w_humidity = document.querySelector(".weather_humidity");
    const w_wind = document.querySelector(".weather_wind");
    const w_pressure = document.querySelector(".weather_pressure");
  
    const citySearch = document.querySelector(".weather_search");
    const forecast_container = document.querySelector("#forecast");
  
    const getCountryName = (code) => new Intl.DisplayNames([code], { type: "region" }).of(code);
  
    const getDateTime = (dt) => {
      const curDate = new Date(dt * 1000);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
  
      return new Intl.DateTimeFormat("en-US", options).format(curDate);
    };
  
    let city = "pune";
  
    citySearch.addEventListener("submit", (e) => {
      e.preventDefault();
      const cityNameInput = document.querySelector(".city_name");
      city = cityNameInput.value;
      getWeatherData();
      cityNameInput.value = "";
    });
  
    const getWeatherData = async () => {
      const weatherUrl =` https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=63e7638b5b7959e3abca2b615eb9208f&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=63e7638b5b7959e3abca2b615eb9208f&units=metric`;
  
      try {
        // Fetch current weather data
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();
        console.log('Weather Data:', weatherData);
  
        const { main, name, weather, wind, sys, dt } = weatherData;
  
        if (cityName) cityName.innerHTML = `${name}, ${getCountryName(sys.country)}`;
        if (dateTime) dateTime.innerHTML = getDateTime(dt);
        if (w_forecast) w_forecast.innerHTML = weather[0].main;
        if (w_icon) w_icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather[0].icon}@4x.png" />`;
        if (w_temperature) w_temperature.innerHTML = `${main.temp}&#176`;
        if (w_minTem) w_minTem.innerHTML = `Min: ${main.temp_min.toFixed()}&#176`;
        if (w_maxTem) w_maxTem.innerHTML = `Max: ${main.temp_max.toFixed()}&#176`;
        if (w_feelsLike) w_feelsLike.innerHTML = `${main.feels_like.toFixed(2)}&#176`;
        if (w_humidity) w_humidity.innerHTML = `${main.humidity}%`;
        if (w_wind) w_wind.innerHTML = `${wind.speed} m/s`;
        if (w_pressure) w_pressure.innerHTML = `${main.pressure} hPa`;
  
        // Fetch 5-day forecast data
        const forecastRes = await fetch(forecastUrl);
        const forecastData = await forecastRes.json();
        console.log('Forecast Data:', forecastData);
  
        if (forecast_container) {
          forecast_container.innerHTML = ''; // Clear previous forecast
  
          if (forecastData.list && forecastData.list.length > 0) {
            forecastData.list.forEach((item, index) => {
              if (index % 8 === 0) { // 8 intervals per day
                const forecast_day = new Date(item.dt_txt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short'
                });
  
                const forecast_temp = item.main.temp;
                const forecast_icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
  
                const forecast_html = `
                  <div class="forecast_item">
                    <h3>${forecast_day}</h3>
                    <img src="${forecast_icon}" alt="Weather Icon">
                    <p>${forecast_temp}&#176;C</p>
                    <p>${item.weather[0].description}</p>
                  </div>
                `;
  
                forecast_container.innerHTML += forecast_html;
              }
            });
          } else {
            forecast_container.innerHTML = "<p>No forecast data available.</p>";
          }
        } else {
          console.error("Forecast container element not found.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    getWeatherData(); // Initial call to load weather data
  });
  