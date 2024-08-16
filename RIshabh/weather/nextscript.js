const city=localStorage.getItem('city')

document.getElementById("cityname").innerHTML=`City : ${city.toUpperCase()}`

const apiURL2 = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q="
const apiKey = "c6f20ac2610aaeff78e9c2ffe28c22e8"
const goback=document.querySelector(".search #button3")
async function FiveDays(city) {
    const response = await fetch(apiURL2 + city + `&appid=${apiKey}`)
    var data = await response.json();
    console.log(data);
    let images=[]
    for (let index = 0; index < 5; index++) {

        images.push(data.list[index*8].weather[0].main)
        
    }
    for (let index = 0; index < 5; index++) {
       let val=index;

        document.querySelector(`#day${val+1}`).innerHTML=
        `<img src="images/${images[index].toLowerCase()}.png" class="weather-icon">
        <h4 id="date${val+1}">${data.list[index*8].dt_txt}</h4>
        <br>
        <h4 id="city${val+1}">${city.toUpperCase()}</h4>
        <br>
        <h3 id="temp${val+1}">${data.list[index*8].main.temp}°C</h3>
       `
        
    }

    goback.addEventListener("click", ()=>
    {
        window.location.href="index.html"
    })


}

FiveDays(city);
