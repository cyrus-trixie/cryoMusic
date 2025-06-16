import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// Configure CORS (consider specifying your Netlify frontend URL for production)
app.use(cors());

app.post('/api/postdata',(req,res)=>{
    // Your post logic here
    res.status(200).json({ message: 'POST request received' }); // Added a basic response
})

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching from Deezer:', err.message); // Added more detailed error logging
    res.status(500).json({ error: 'Failed to fetch from Deezer' });
  }
});

// Use process.env.PORT for Render, and fallback to 5000 for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));