import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// --- START CORS CONFIGURATION ---
// Read the frontend URL from an environment variable (set this on Render)
const allowedOrigins = [process.env.FRONTEND_URL];

// Configure CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // If the origin is not provided (e.g., direct API calls via Postman or server-to-server)
    // or if the origin is in our explicitly allowed list, then allow it.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      // If the origin is not allowed, block the request and provide an error message
      console.error(`CORS Blocked: Origin '${origin}' is not in the allowed list.`);
      callback(new Error(`Not allowed by CORS: Origin '${origin}'`), false);
    }
  },
  optionsSuccessStatus: 200 // For handling pre-flight requests (OPTIONS method)
}));
// --- END CORS CONFIGURATION ---


app.post('/api/postdata',(req,res)=>{
    // Your post logic here
    // For a POST request, you often expect a body, so you might need app.use(express.json());
    // For now, just sending a success message.
    res.status(200).json({ message: 'POST request received' });
});

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
    res.json(response.data);
  } catch (err) {
    console.error('Error fetching from Deezer:', err.message);
    res.status(500).json({ error: 'Failed to fetch from Deezer' });
  }
});

// Use process.env.PORT for Render, and fallback to 5000 for local development
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));