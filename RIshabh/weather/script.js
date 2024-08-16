const apiKey = "c6f20ac2610aaeff78e9c2ffe28c22e8"
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

const temper = document.querySelector(".temp");


const searchBar = document.querySelector(".search input")
const searchBtn = document.querySelector(".search #button1")
const nextBtn = document.querySelector(".search #button2")
const images = document.querySelector(".weather-icon")

async function weather(city) {
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    var data = await response.json();
    console.log(data);
    temper.innerHTML = `${Math.round(data.main.temp)}°C`
    document.querySelector(".city").innerHTML = data.name
    document.querySelector(".humidity").innerHTML = `${data.main.humidity}%`
    // document.querySelector
    document.querySelector(".winds").innerHTML = `${data.wind.speed} KM/H`
    if (data.weather[0].main == "Clouds")
        images.src = "images/clouds.png"
    else if (data.weather[0].main == "Clear")
        images.src = "images/clear.png"
    else if (data.weather[0].main == "Rain")
        images.src = "images/rain.png"
    else if (data.weather[0].main == "Dizzle")
        images.src = "images/dizzle.png"
    else if (data.weather[0].main == "Mist")
        images.src = "images/mist.png"
    const date = new Date(data.dt * 1000)
    const format = date.toLocaleString();
    document.querySelector(".date").innerHTML = `${format}`

    document.querySelector(".weather").style.display = "block";

}

const apiURL2 = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q="

async function FiveDays(city) {
    const response = await fetch(apiURL2 + city + `&appid=${apiKey}`)
    var data = await response.json();
    console.log(data);




}


searchBtn.addEventListener('click', () => {
    weather(searchBar.value);
    const city = searchBar.value;
    localStorage.setItem('city', city);
    // FiveDays(searchBar.value);
})

nextBtn.addEventListener('click', () => {
    const city = localStorage.getItem('city');
    if (city) {
        FiveDays(city).then(() => {
            window.location.href = "next-page.html";
        });
    } else {
        alert("City not set. Please search for a city first.");
    }
    console.log(city);
    
})
