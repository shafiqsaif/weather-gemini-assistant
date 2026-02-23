// api/ai.js

module.exports = async function (context, req) {
  try {
    if (req.method !== "POST") {
      context.res = { status: 405, body: { error: "Use POST" } };
      return;
    }

    const GROQ_KEY = process.env.GROQ_KEY;
    if (!GROQ_KEY) {
      context.res = { status: 500, body: { error: "Server missing GROQ_KEY" } };
      return;
    }

    const prompt = req.body?.prompt;
    if (!prompt) {
      context.res = { status: 400, body: { error: "Missing prompt" } };
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

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
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json();
    if (result?.error) throw new Error(result.error.message);

    const content = result?.choices?.[0]?.message?.content ?? "";
    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: { content }
    };
  } catch (err) {
    const msg = err.name === "AbortError" ? "AI request timed out" : (err.message || "AI error");
    context.res = { status: 500, body: { error: msg } };
  }
};