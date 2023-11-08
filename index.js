// index.js
require('dotenv').config();
const express = require('express');
// const { OpenAIApi } = require('openai');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path')
const fetch = require('node-fetch')

const app = express();
// const openai = new OpenAIApi(new OpenAIApi.Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// }));
const openai = new OpenAI(process.env.OPENAI_API_KEY);
const API_KEY = process.env.BIBLIA_API_KEY;
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory
// Send the 'index.html' file when the root route is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Endpoint for fetching Bible text
app.get('/fetch-passage', async (req, res) => {
  const { book, chapter, verse } = req.query;
  const passageRef = verse ? `${book}.${chapter}:${verse}` : `${book}.${chapter}`;
  const apiUrl = `https://api.biblia.com/v1/bible/content/LEB.html?passage=${encodeURIComponent(passageRef)}&style=fullyFormatted&key=${API_KEY}`;
  ;

  try {
    const response = await fetch(`${apiUrl}`);
    if (!response.ok) {
      throw new Error(`Error fetching passage: ${response.statusText}`);
    }
    const text = await response.text();
    res.send({ passageText: text });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Endpoint for interpreting the text
app.post('/interpret-text', async (req, res) => {
  try {
    const { text, denomination } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{role:"system", content: "You are a theological professor"},
    {role: "user", content: `As a ${denomination} theologian, interpret the following passage: ${text}`}],
    });
    res.json({ interpretation: response.choices[0].message.content});
  } catch (error) {
    console.error('Error during text interpretation:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});