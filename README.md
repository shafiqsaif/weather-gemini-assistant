# 🌦️ Weather & Lifestyle App (Team 25)

> **Capstone Project — Deepening of Skills course**  
> An AI-powered weather assistant that turns real weather data into practical daily advice.

---

## 📌 About Our Project

We designed and implemented an **AI-powered Weather & Lifestyle Assistant** that goes beyond displaying raw weather data.  
The application combines **real-time atmospheric information** with **AI-generated recommendations** to help users make practical daily decisions.

Instead of simply showing temperature values, the system interprets weather conditions and provides contextual lifestyle advice such as:

- 👕 What to wear  
- 🎯 What activity is ideal  
- 🎒 What essentials to carry  

---

## 🎯 Project Objectives

The primary goals of this project were to:

- ✅ Practice real-world API integration  
- ✅ Explore AI usage in web applications  
- ✅ Strengthen frontend architecture skills  
- ✅ Improve asynchronous JavaScript handling  

---

## 🧰 Technologies Used

### Frontend
- **HTML**
- **CSS**
- **Bootstrap 5**

### Programming Logic
- **Vanilla JavaScript**

### External Services & APIs
- **OpenWeather API** (current weather + forecast)
- **OpenWeather Air Pollution API** (AQI)
- **Groq API** (Meta **LLaMA 3.1** model)

---

## 👥 Team Contributions

| Member | Responsibilities |
|--------|------------------|
| **Tabish Dawood** | Frontend UI design (HTML/CSS), Bootstrap layout, Glassmorphism styling, page structure |
| **Shafiq** | Weather engine & API integration, async fetching, UI data population, navigation logic |
| **Ankit** | AI integration via Groq (LLaMA 3.1), prompt formatting, timeout handling, sanitization, AI error handling, Updating Readme |

---

## ✨ Key Features

- 🔄 **Multi-page UI** without reload  
- 🌍 **Live weather** data for cities worldwide  
- 🌫️ **Air Quality Index (AQI)** display  
- 📅 **3-day forecast** visualization  
- 🤖 **AI-generated lifestyle insights** (wardrobe, activity, packing list)  
- 📱 Responsive modern interface  

---

## ▶️ How to Run the Application

1. **Download or clone** the project folder  
2. Create a file named **`config.js`** in the root directory  
3. Insert your API keys:

```javascript
const OPENWEATHER_KEY = "paste_key_here";
const AI_KEY = "paste_key_here";