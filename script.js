
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
        // QA Feature: AbortController prevents the app from hanging if the AI API is slow
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout limit

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
            signal: controller.signal // Link the timeout controller
        });

        clearTimeout(timeoutId); // Clear timeout if fetch succeeds

        const result = await response.json();
        if (result.error) throw new Error(result.error.message);

        // Pass raw text to Ankit's sanitization function
        const cleanText = sanitizeAIOutput(result.choices[0].message.content);
        document.getElementById('aiSummaryDisplay').innerHTML = cleanText;

    } catch (error) {
        let errorMsg = error.message;
        if (error.name === 'AbortError') errorMsg = "AI Connection timed out. Please try again.";
        
        // Inject a custom styled error specifically for the AI card
        document.getElementById('aiSummaryDisplay').innerHTML = `
            <div class="p-3 bg-danger bg-opacity-25 border border-danger rounded text-white">
                <i class="bi bi-exclamation-triangle-fill text-warning"></i> AI Insights currently unavailable: ${errorMsg}
            </div>`;
            
        console.error("Ankit QA System Log - AI API Error:", error);
    }
}

// 2. Data Sanitization Function
function sanitizeAIOutput(rawText) {
    // QA Feature: Remove accidental markdown blocks that LLMs sometimes generate
    let formattedText = rawText.replace(/```html/g, '').replace(/```/g, '').trim();
    
    // QA Feature: Fallback if AI returns empty data
    if (!formattedText || formattedText.length < 10) {
        return "<p><em>AI provided an incomplete response. Please analyze the city again.</em></p>";
    }
    
    return formattedText;
}

// 3. Advanced Global Error Handling
function showError(message) {
    const errorDisplay = document.getElementById('errorDisplay');
    
    // Display the error with an icon
    errorDisplay.innerHTML = `<i class="bi bi-shield-exclamation"></i> <strong>System Alert:</strong> ${message}`;
    errorDisplay.classList.remove('d-none');
    
    // QA Feature: Auto-hide the error after 6 seconds to keep the UI clean
    setTimeout(() => {
        errorDisplay.classList.add('d-none');
    }, 6000);

    // QA Feature: Log for developer debugging
    console.warn("Ankit QA System caught a global error:", message);
}