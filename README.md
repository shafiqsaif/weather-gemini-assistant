# Weather & Lifestyle App (Team 25)

### About Our Project
This is our final Capstone Project for the semester. We built a weather dashboard that doesn't just show you the temperature—it actually tells you what to do with that information using AI.

We used HTML, CSS (Bootstrap), and JavaScript to build it. The app pulls real-time weather data and then sends it to an AI model to generate advice like what to wear or what to pack.

### Key Features
* **3-Page Design:** You can switch between current weather, the AI advice, and the 3-day forecast without the page reloading.
* **Real Weather Data:** We fetch live data for temperature, humidity, wind, and sunrise/sunset times using the OpenWeather API.
* **Air Quality:** We also added a feature to check pollution levels (AQI) so you know if it's safe to go outside.
* **AI Integration:** We connected the app to Meta's LLaMA 3.1 AI. It reads the weather and gives you a custom packing list and activity suggestions.
* **Modern UI:** Tabish designed a "Glassmorphism" look using semi-transparent cards.

### How to Run It
1. Download or clone this folder.
2. Create a new file called `config.js` in the main folder.
3. Paste your API keys inside it like this:
   ```javascript
   const OPENWEATHER_KEY = "paste_key_here";
   const GROQ_KEY = "paste_key_here";