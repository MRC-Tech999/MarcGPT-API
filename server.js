const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { conversation } = req.body;

  try {
    const botResponse = await fetch("https://open-ai21.p.rapidapi.com/conversationllama", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "open-ai21.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      },
      body: JSON.stringify({ messages: conversation, web_access: false })
    });

    const botData = await botResponse.json();
    const botText = botData.result;

    const humanResponse = await fetch("https://chatgpt-42.p.rapidapi.com/aitohuman", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      },
      body: JSON.stringify({ text: botText })
    });

    const humanData = await humanResponse.json();
    res.json({ result: humanData.result });

  } catch (error) {
    console.error("Erreur API :", error);
    res.status(500).json({ result: "Erreur IA. Veuillez réessayer." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MarcGPT API en ligne sur le port ${PORT}`));
