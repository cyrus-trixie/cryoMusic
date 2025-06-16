import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.post('/api/postdata',(req,res)=>{
    
})

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Deezer' });
  }
});

app.listen(5000, () => console.log('Proxy server running on port 5000'));
