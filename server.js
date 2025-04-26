const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(cors());
app.use(express.text()); // for plain text uploads

// Make sure 'scripts' folder exists
if (!fs.existsSync('./scripts')) {
  fs.mkdirSync('./scripts');
}

app.post('/upload', (req, res) => {
  const script = req.body;
  const id = nanoid(8); // random 8 character ID

  fs.writeFileSync(`./scripts/${id}.lua`, script);

  res.send(`https://your-backend-url.onrender.com/raw/${id}`);
});

app.get('/raw/:id', (req, res) => {
  const id = req.params.id;
  const userAgent = req.headers['user-agent'] || "";

  if (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari')) {
    return res.status(403).send('403 Forbidden - Browser access not allowed');
  }

  const filePath = `./scripts/${id}.lua`;
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('404 Not Found');
  }

  const script = fs.readFileSync(filePath, 'utf8');
  res.type('text/plain').send(script);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
