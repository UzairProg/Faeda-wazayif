const key = process.env.GEMINI_API_KEY || "";
const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro", "gemini-2.5-flash"];

async function check() {
  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Say OK' }] }] })
      });
      const data = await res.json();
      if (data.candidates && data.candidates[0]) {
        console.log(`MODEL ${model}: SUCCESS ->`, data.candidates[0].content.parts[0].text.trim());
      } else {
        console.log(`MODEL ${model}: FAILED ->`, data.error?.code, data.error?.message?.slice(0, 100));
      }
    } catch (e) {
      console.log(`MODEL ${model}: ERROR ->`, e.message);
    }
  }
}
check();
