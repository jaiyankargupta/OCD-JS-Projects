const apiKey = '9e9cafa85712cce11b9a2d7d35fdb6bf';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';


const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; 

document.addEventListener('DOMContentLoaded', () => {

    async function fetchWeatherData(city) {
        const cacheKey = `${city}_${Math.floor(Date.now() / CACHE_DURATION)}`;
        
        if (cache.has(cacheKey)) {
            const cachedData = cache.get(cacheKey);
            displayCurrentWeather(cachedData.weatherData);
            displayForecast(cachedData.forecastData);
            return;
        }

        const currentWeatherUrl = `${baseUrl}weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        const forecastUrl = `${baseUrl}forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    
        document.getElementById('loading').style.display = 'block'; 
    
        try {
            
            const weatherResponse = await fetch(currentWeatherUrl);
            if (!weatherResponse.ok) {
                const errorData = await weatherResponse.json();
                throw new Error(errorData.message || 'City not found');
            }
            const weatherData = await weatherResponse.json();
            displayCurrentWeather(weatherData);
    
            
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                const errorData = await forecastResponse.json();
                throw new Error(errorData.message || 'City not found');
            }
            const forecastData = await forecastResponse.json();
    
            console.log('Forecast Data:', forecastData); 
            displayForecast(forecastData);

          
            cache.set(cacheKey, { weatherData, forecastData });
    
        } catch (error) {
            console.error('Error fetching weather data:', error);
            displayErrorMessage(error.message);
        } finally {
            document.getElementById('loading').style.display = 'none'; 
        }
    }
    
    function displayErrorMessage(message) {
        const weatherContainer = document.getElementById('current-weather');
        weatherContainer.innerHTML = `
            <p class="error-message">Error: ${message}</p>
        `;
    }
    
    function displayForecast(data) {
        console.log('Forecast Data:', data.list); // Log the data to see what's being returned
    
        const forecastContainer = document.getElementById('forecast');
        forecastContainer.innerHTML = ''; // Clear any previous forecast
    
        // Create an object to store the latest forecast for each day
        const dailyForecasts = {};
    
        // Iterate over the forecast data to select one entry per day
        data.list.forEach((entry) => {
            const date = new Date(entry.dt * 1000); // Convert timestamp to date
            const day = date.toISOString().split('T')[0]; // Get date string in YYYY-MM-DD format
    
            // Store the first entry of each day
            if (!dailyForecasts[day]) {
                dailyForecasts[day] = entry;
            }
        });
    
        
        const days = Object.keys(dailyForecasts).slice(0, 5);
    
        console.log('Daily Forecasts:', dailyForecasts); 
        days.forEach((day) => {
            const forecast = dailyForecasts[day];
            const date = new Date(forecast.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temp = forecast.main.temp;
            const description = forecast.weather[0].description;
            const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
    
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.innerHTML = `
                <h3>${dayName}</h3>
                <img src="${iconUrl}" alt="${description}">
                <p class="temperature">Temperature: ${temp} °C</p>
                <p>Weather: ${description}</p>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    }
    
    function displayCurrentWeather(data) {
        const weatherContainer = document.getElementById('current-weather');
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherContainer.innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" alt="${data.weather[0].description}">
            <p class="temperature">Temperature: ${data.main.temp} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }

    // Geolocation
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    fetchWeatherDataByCoords(lat, lon);
                },
                error => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location. Please enter a city manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    async function fetchWeatherDataByCoords(lat, lon) {
        const currentWeatherUrl = `${baseUrl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastUrl = `${baseUrl}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        
        document.getElementById('loading').style.display = 'block'; // Show spinner
    
        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastUrl)
            ]);

            if (!weatherResponse.ok || !forecastResponse.ok) {
                throw new Error('Unable to fetch weather data');
            }

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            displayCurrentWeather(weatherData);
            displayForecast(forecastData);

        } catch (error) {
            console.error('Error fetching weather data:', error);
            displayErrorMessage(error.message);
        } finally {
            document.getElementById('loading').style.display = 'none'; // Hide spinner
        }
    }

    // Unit conversion
    function toggleTemperatureUnit() {
        const temperatureElements = document.querySelectorAll('.temperature');
        const isCelsius = temperatureElements[0].textContent.includes('°C');
        
        temperatureElements.forEach(el => {
            const currentTemp = parseFloat(el.textContent.match(/[-+]?[0-9]*\.?[0-9]+/)[0]);
            
            if (isCelsius) {
                el.textContent = `${convertToFahrenheit(currentTemp).toFixed(1)}°F`;
            } else {
                el.textContent = `${convertToCelsius(currentTemp).toFixed(1)}°C`;
            }
        });
    }
    
    function convertToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    function convertToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }

    // Dark mode toggle
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    // Event listeners
    document.getElementById('search-btn').addEventListener('click', () => {
        const city = document.getElementById('city-input').value;
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Please enter a city name');
        }
    });


    document.getElementById('geolocation-btn').addEventListener('click', getLocation);
    document.getElementById('unit-toggle').addEventListener('click', toggleTemperatureUnit);
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
});