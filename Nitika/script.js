const url =  'https://api.openweathermap.org/data/2.5/';
const apiKey = `74f9eb43f4f8921e0f3a92c39c53dbd1`;
let country = document.querySelector("#country");
const btn = document.querySelector(".btn");
const forecast_container = document.querySelector('.forecast_container');
// make dropdowns for all country codes
for(let countryCode in countryList){
    const newOption = document.createElement("option");
    newOption.innerText = countryList[countryCode];
    newOption.value = countryCode;
    if(newOption.innerText === "India" && newOption.value === "IN"){
        newOption.selected = true;
    }
    country.append(newOption);
}
// add event listener to change flag on changing country
country.addEventListener('change',(evt)=>{
    changeFlag(evt.target);
});
// function to change flag
const changeFlag = (element)=>{
    const countryCode = element.value;
    let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = document.querySelector(".flag");
    img.src = newsrc;
}
// on button click
btn.addEventListener("click",async (evt)=>{
    evt.preventDefault();
    async function fetchdata(){
        try {
            country = document.querySelector("#country").value;
            let city = document.querySelector(".city").value;
            let city1 = document.querySelector(".city1");
            let temp_in_text = document.querySelector(".temp_in_text");
            let temperature = document.querySelector(".weather_now h1");
            let feels_like = document.querySelector(".feels_like");
            let haze = document.querySelector(".haze");
            let maxTemp_value= document.querySelector(".maxTemp_value");
            let Humidity_value = document.querySelector(".Humidity_value");
            let Wind_value = document.querySelector(".Wind_value");
            let cloud = document.querySelector(".cloud");
            let current_icon = document.querySelector(".current_weather img");
            

            if(city != ""){
                let finalurl = `${url}weather?q=${city},${country}&units=metric&appid=${apiKey}`;
                const response = await fetch(finalurl);
                const result = await response.json();
                console.log(result);
                let max_temp = Math.floor(result.main.temp_max);
                let temp = Math.floor(result.main.temp);
                let humidity = result.main.humidity;
                let temp_feels_like = Math.floor(result.main.feels_like);
                let wind_speed = (result.wind.speed * 3.6).toFixed(2);
                if(temp>45){
                    temp_in_text.innerText = "Excessive Heat";
                }else if(temp<=15 && temp>=10){
                    temp_in_text.innerText = "Cold";
                }else if(temp<10){
                    temp_in_text.innerText = "Excessive Cold";
                }else{
                    temp_in_text.innerText = "Normal Temperature";
                }
                let deg = '\u00B0';
                city1.innerText = city;
                temperature.innerText = `${temp} ${deg}C`;
                feels_like.innerText = `Feels like ${temp_feels_like} ${deg}C`;
                maxTemp_value.innerText = ` ${max_temp} ${deg} c`;
                Humidity_value.innerText = ` ${humidity}%`;
                Wind_value.innerText = ` ${wind_speed}kph`;
                cloud.innerText = result.weather[0].description;
                current_icon.src = `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`;

                // Fetch and display 5-day forecast
                const forecast_url = `${url}forecast?q=${city},${country}&units=metric&appid=${apiKey}`;
                const forecast_response = await fetch(forecast_url);
                const forecast_result = await forecast_response.json();

                forecast_container.innerHTML = ''; // Clear previous forecast

                forecast_result.list.forEach((item, index) => {
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
                                <p>${forecast_temp}${deg}C</p>
                                <p>${item.weather[0].description}</p>
                            </div>
                        `;

                        forecast_container.innerHTML += forecast_html;
                    }
                });
            }else{
                alert("Enter city!");
            }
        } catch (error) {
            console.error(error);
        }
    }
    fetchdata();
})




