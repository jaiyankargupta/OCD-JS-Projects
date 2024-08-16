const input = document.querySelector('.input');
const weather_icon = document.querySelector('.weather-icon');
const search_button = document.querySelector('.searchbtn') ;
const temperature = document.querySelector('.temp');
const description = document.querySelector('.description') ;
const humidity = document.querySelector('.humidity') ;
const wind_speed = document.querySelector('.wind') ;

const location_not_found = document.querySelector('.location-not-found');

const weather_body = document.querySelector('.weather');

 async function checkweather(city){
    const api_key = "73b9ca1fc8e7b111311c4fae6d288aa4" ;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

    const weather_data = await fetch(`${url}`).then(response => response.json());
   
    if(weather_data.cod === `404`){
        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
        console.log("error");
        return;
    }

    console.log("run");
    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;

    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;


    switch(weather_data.weather[0].main){
        case 'Clouds':
            weather_img.src = "/images/icons8-sun-behind-cloud-48.png";
            break;
        case 'Clear':
            weather_img.src = "/images/icons8-smiling-sun-50.png";
            break;
        case 'Rain':
            weather_img.src = "/images/icons8-heavy-rain-48.png";
            break;
        case 'Mist':
            weather_img.src = "/images/icons8-mist-24.png";
            break;
        case 'Snow':
            weather_img.src = "/images/icons8-snow-64.png";
            break;

    }

    console.log(weather_data);

}

search_button.addEventListener('click',()=> {
        checkweather(input.value);
    }) ;