import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// --- CORS CONFIGURATION (Hardcoded Origin) ---
const allowedOrigins = ['https://cyromusic.netlify.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`🚫 CORS Blocked: Origin '${origin}' is not allowed.`);
      callback(new Error(`Not allowed by CORS: Origin '${origin}'`), false);
    }
  },
  optionsSuccessStatus: 200
}));
// --- END CORS CONFIG ---



app.get('/', (req, res) => {
  res.send('✅ API IS UP');
});

// Main search endpoint
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error fetching from Deezer:', err.message);
    res.status(500).json({ error: 'Failed to fetch from Deezer' });
  }
});

// Listen on Render's provided port, or fallback locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));
