// SHAFIQ'S PART: WEATHER ENGINE & UI
// Selecting elements from HTML
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const appNav = document.getElementById('appNav');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorDisplay = document.getElementById('errorDisplay');

cityInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') executeSearch();
});
searchBtn.addEventListener('click', executeSearch);

// Logic to switch between pages
function switchPage(pageId, btnElement) {
    document.querySelectorAll('.page-view').forEach(page => page.classList.add('d-none'));
    document.getElementById(`page-${pageId}`).classList.remove('d-none');
    
    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'text-primary');
        btn.classList.add('text-white', 'glass-card');
    });
    
    btnElement.classList.add('active', 'bg-white', 'text-primary');
    btnElement.classList.remove('text-white', 'glass-card');
}

// Main function to get data
async function executeSearch() {
    const city = cityInput.value.trim();
    if (!city) return showError("Please enter a valid city name.");

    // Hiding old data and showing loading spinner
    errorDisplay.classList.add('d-none');
    appNav.classList.add('d-none');
    document.querySelectorAll('.page-view').forEach(page => page.classList.add('d-none'));
    loadingIndicator.classList.remove('d-none');
    document.getElementById('aiSummaryDisplay').innerHTML = '<div class="spinner-border spinner-border-sm text-light" role="status"></div> Thinking...';

    try {
        // Getting current weather
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData.cod !== 200) throw new Error(weatherData.message || "City not found.");

        // Getting forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${OPENWEATHER_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        // Getting air quality
        const lat = weatherData.coord.lat;
        const lon = weatherData.coord.lon;
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
        const aqiResponse = await fetch(aqiUrl);
        const aqiData = await aqiResponse.json();

        // Putting data into the UI
        populateWeatherUI(weatherData, aqiData);
        populateForecastUI(forecastData);

        // Showing the dashboard
        loadingIndicator.classList.add('d-none');
        appNav.classList.remove('d-none');
        document.getElementById('page-weather').classList.remove('d-none');

        // Asking AI for advice 
        fetchAIInsights(weatherData, aqiData);

    } catch (error) {
        loadingIndicator.classList.add('d-none');
        showError(error.message);
    }
}

// Filling the main weather card
function populateWeatherUI(data, aqiData) {
    document.getElementById('cityNameDisplay').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('tempDisplay').innerText = Math.round(data.main.temp) + "°C";
    document.getElementById('conditionDisplay').innerText = data.weather[0].description;
    
    document.getElementById('highTempDisplay').innerText = Math.round(data.main.temp_max) + "°C";
    document.getElementById('lowTempDisplay').innerText = Math.round(data.main.temp_min) + "°C";
    document.getElementById('feelsLikeDisplay').innerText = Math.round(data.main.feels_like) + "°C";
    
    document.getElementById('humidityDisplay').innerText = data.main.humidity + "%";
    document.getElementById('windDisplay').innerText = data.wind.speed + " m/s";
    document.getElementById('pressureDisplay').innerText = data.main.pressure + " hPa";
    document.getElementById('visibilityDisplay').innerText = (data.visibility / 1000).toFixed(1) + " km";
    document.getElementById('cloudDisplay').innerText = data.clouds.all + "%";

    // Fixing time for the city
    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const localCityTime = new Date(utcTime + (data.timezone * 1000));
    document.getElementById('localTimeDisplay').innerHTML = `<i class="bi bi-clock"></i> Local Time: ${localCityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // Fixing sunrise and sunset time
    const formatTime = (unixTime) => new Date(utcTime + (data.timezone * 1000) + ((unixTime - data.dt) * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunriseDisplay').innerText = formatTime(data.sys.sunrise);
    document.getElementById('sunsetDisplay').innerText = formatTime(data.sys.sunset);

    // Setting AQI colors
    const aqiIndex = aqiData.list[0].main.aqi;
    const aqiLabels = ["", "Excellent", "Fair", "Moderate", "Poor", "Hazardous"];
    const aqiColors = ["", "text-success", "text-info", "text-warning", "text-danger", "text-danger fw-bold"];
    
    const aqiElement = document.getElementById('aqiDisplay');
    aqiElement.innerText = aqiLabels[aqiIndex];
    aqiElement.className = `text-white mb-0 ${aqiColors[aqiIndex]}`; 
}

// Filling the 3-day forecast
function populateForecastUI(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = ''; 
    const dailyData = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    const next3Days = dailyData.slice(0, 3);

    next3Days.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); 
        const temp = Math.round(day.main.temp);
        const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`;

        const cardHtml = `
            <div class="col-md-4">
                <div class="card glass-card-dark border-0 shadow-lg text-center p-4 h-100">
                    <h4 class="text-white mb-2 fw-bold">${dayName}</h4>
                    <img src="${iconUrl}" alt="Weather Icon" class="mx-auto" style="width: 120px;">
                    <h2 class="text-white mb-1">${temp}°C</h2>
                    <p class="text-white-50 text-capitalize fs-5 mb-0">${day.weather[0].description}</p>
                </div>
            </div>
        `;
        forecastContainer.innerHTML += cardHtml;
    });
}


// ANKIT'S PART: AI & ERROR HANDLING
// Sending data to Groq AI
async function fetchAIInsights(weatherData, aqiData) {
    const aqiLabels = ["", "Excellent", "Fair", "Moderate", "Poor", "Hazardous"];
    const aqiText = aqiLabels[aqiData.list[0].main.aqi] || "Unknown";

    const prompt = `
        The weather in ${weatherData.name} is ${weatherData.main.temp}°C, feels like ${weatherData.main.feels_like}°C, with ${weatherData.weather[0].description}. Air quality is ${aqiText}.
        
        Provide a 4-part response formatted exactly like this with HTML tags:
        <p><strong>☁️ Atmosphere:</strong> [1-sentence poetic summary]</p>
        <p><strong>👕 Wardrobe:</strong> [Practical clothing advice]</p>
        <p><strong>🎯 Activity:</strong> [1 ideal indoor or outdoor activity]</p>
        <p><strong>🎒 Packing List:</strong> [List 3 essential items to bring today separated by commas]</p>
        
        Do not use markdown blocks, just return the raw HTML tags.
    `;

    try {
        // Timeout to stop freezing
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); 

        const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_KEY}` 
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", 
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7
            }),
            signal: controller.signal 
        });

        clearTimeout(timeoutId); 

        const result = await response.json();
        if (result.error) throw new Error(result.error.message);
        const cleanText = sanitizeAIOutput(result.choices[0].message.content);
        document.getElementById('aiSummaryDisplay').innerHTML = cleanText;

    } catch (error) {
        let errorMsg = error.message;
        if (error.name === 'AbortError') errorMsg = "AI Connection timed out. Please try again.";
        
        document.getElementById('aiSummaryDisplay').innerHTML = `
            <div class="p-3 bg-danger bg-opacity-25 border border-danger rounded text-white">
                <i class="bi bi-exclamation-triangle-fill text-warning"></i> AI Insights currently unavailable: ${errorMsg}
            </div>`;
    }
}

// Removing bad characters from AI text
function sanitizeAIOutput(rawText) {
    let formattedText = rawText.replace(/```html/g, '').replace(/```/g, '').trim();
    if (!formattedText || formattedText.length < 10) {
        return "<p><em>AI provided an incomplete response. Please analyze the city again.</em></p>";
    }
    return formattedText;
}

// Showing error messages
function showError(message) {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.innerHTML = `<i class="bi bi-shield-exclamation"></i> <strong>System Alert:</strong> ${message}`;
    errorDisplay.classList.remove('d-none');
    setTimeout(() => {
        errorDisplay.classList.add('d-none');
    }, 6000);
}