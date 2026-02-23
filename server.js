const express = require("express");
// const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html & assets

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const GROQ_KEY = process.env.GROQ_KEY;

// Weather endpoint
app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "Missing city" });

    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_KEY}`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (weatherData.cod !== 200)
      return res.status(404).json({ error: weatherData.message });

    const forecastUrl =
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_KEY}`;

    const forecastRes = await fetch(forecastUrl);
    const forecastData = await forecastRes.json();

    const { lat, lon } = weatherData.coord;
    const aqiUrl =
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;

    const aqiRes = await fetch(aqiUrl);
    const aqiData = await aqiRes.json();

    res.json({ weatherData, forecastData, aqiData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI endpoint
app.post("/api/ai", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const result = await response.json();
    if (result.error) throw new Error(result.error.message);

    res.json({ content: result.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));