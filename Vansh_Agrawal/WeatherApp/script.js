const apikey = "05fd49a410b84fcd40257dff8b13d4ce";
const cityname = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const urlforcast = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const w_icon = document.querySelector(".weather-icon");
const w_div = document.querySelector(".weather");
const fore_div=document.querySelector(`.forecast`);
async function checkWeather(city) {
  try {
    const response = await fetch(`${url}${city}&appid=${apikey}`);
    if ((response.status == "400")|| (response.status == "404"))
        { alert("Enter a valid city name");
        }
    else {
      let data = await response.json();
      console.log(data);
      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML = `${Number(data.main.temp).toFixed(1)}°c`;
      document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`;
      document.querySelector(".wind").innerHTML = `${data.wind.speed} Kmph`;
      let state = "";
      switch (data.weather[0].main) {
        case "Clouds":
          state = "clouds";
          break;
        case "Clear":
          state = "clear";
          break;
        case "Snow":
          state = "snow";
          break;
        case "Rain":
          state = "rain";
          break;
        case "Mist":
          state = "mist";
          break;
        case "drizzle":
          state = "drizzle";
          break;
        default:
          state = "clouds";
      }
      w_icon.src = `./images/${state}.png`;
      w_div.style.display = "block";
    }
    forecastWeather(city);
  } catch (error) {
    console.log(`Error Occured during fetching of file ${error}`);
  }
}
async function forecastWeather(city)
{
    try{
    const response = await fetch(`${urlforcast}${city}&appid=${apikey}`);
    const data=await response.json();

    fore_div.innerHTML = ''; 
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { 
            const forecast_day = new Date(item.dt_txt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                weekday: 'long',
            });
            let state = "";
            switch (item.weather[0].main) {
              case "Clouds":
                state = "clouds";
                break;
              case "Clear":
                state = "clear";
                break;
              case "Snow":
                state = "snow";
                break;
              case "Rain":
                state = "rain";
                break;
              case "Mist":
                state = "mist";
                break;
              case "drizzle":
                state = "drizzle";
                break;
              default:
                state = "clouds";
            }
            console.log(`state is  ${state}`);
            w_icon.src = `./images/${state}.png`;

            const forecast_html = `
                <div class="forecast_item" >
                    <h2>${forecast_day}</h2>
                    <img src="./images/${state}.png" alt="Weather Icon">
                    <p>Temp :${Number(item.main.temp).toFixed(1)}°c</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Wind Speed: ${item.wind.speed} Kmph</p>
                </div>
            `;

            fore_div.innerHTML += forecast_html;
        }
    });

    }
catch(error)
{
    console.log(`Error: ${Error}`);
    
}
}
searchbtn.addEventListener("click", () => checkWeather(cityname.value));
