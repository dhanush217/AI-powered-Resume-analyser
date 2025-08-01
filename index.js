const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', (req, res) => {
  const { text } = req.body;
  // TODO: Add AI feedback logic here
  res.json({ feedback: `This is a placeholder for AI feedback on the following text: ${text}` });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
