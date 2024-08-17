const apikey = "05fd49a410b84fcd40257dff8b13d4ce";
const cityname = document.querySelector(".search input");
const searchbtn = document.querySelector(".search button");
const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const w_icon = document.querySelector(".weather-icon");
const w_div = document.querySelector(".weather");
console.log(`hello`);

async function checkWeather(city) {
  try {
    const response = await fetch(`${url}${city}&appid=${apikey}`);
    if ((response.state = "404")) alert("Enter a valid city name");
    else {
      let data = await response.json();
      console.log(data);
      document.querySelector(".city").innerHTML = data.name;
      document.querySelector(".temp").innerHTML = `${Number(
        data.main.temp
      ).toFixed(1)}°c`;
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
      console.log(`state is  ${state}`);
      w_icon.src = `./images/${state}.png`;
      w_div.style.display = "block";
    }
  } catch (error) {
    console.log(`Error Occured during fetching of file ${error}`);
  }
}
searchbtn.addEventListener("click", () => checkWeather(cityname.value));
