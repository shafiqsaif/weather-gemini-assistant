// api/weather.js

module.exports = async function (context, req) {
  try {
    const city = req.query.city;
    if (!city) {
      context.res = { status: 400, body: { error: "Missing city parameter" } };
      return;
    }

    const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
    if (!OPENWEATHER_KEY) {
      context.res = { status: 500, body: { error: "Server missing OPENWEATHER_KEY" } };
      return;
    }

    // Current weather
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_KEY}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200) {
      context.res = { status: 404, body: { error: weatherData.message || "City not found" } };
      return;
    }

    // Forecast
    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_KEY}`;
    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    // AQI
    const { lat, lon } = weatherData.coord;
    const aqiUrl =
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
    const aqiRes = await fetch(aqiUrl);
    const aqiData = await aqiRes.json();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { weatherData, forecastData, aqiData }
    };
  } catch (err) {
    context.res = { status: 500, body: { error: err.message || "Server error" } };
  }
};