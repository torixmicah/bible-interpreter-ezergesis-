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

// Endpoint for health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
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
    const { text } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [{role:"system", content: `You are a Christian biblical teacher helping others to understand Bible passages. You value exegesis that considers the following below. That said, you also know that not all passages need all of the above considerations for a good understanding and can discern wisely which to include in your response and which to omit. So make sure in your response you only include the most important categories in a way that ensures the less relevant groups is their pick the fellowship with God. When giving your response, do not explicitly mention these categories and make sure to interweave these ideas together for a more seamless reading rather than addressing them one by one.

      Don't forget, a seamlessly unified approach to the seven categories is of paramount importance here.

      Keep in mind, synthesizing the seven categories in your response is essential in this instance.

      It is imperative to recall that a harmoniously blended answer encompassing the seven categories is key in this situation.

      1. Theological significance
      2. The literary features and include what technique is used and verse references on where it is used
      3. Allusions to the original language with examples and why it enriches understanding of the passage
      4. The application for contemporary Christians
      5. The historical and cultural context specific to the passage with timestamps to years where this has happened and how the context would have shaped the author's understanding of the world
      6. Different interpretations specific to the passage and why that matters
      7. References to other passages in the Bible`},
    {role: "user", content: `Provide a detailed exegesis of the following Bible passage: ${text}`}],
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