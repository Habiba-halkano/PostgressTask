const express = require('express');
const db = require('./db'); // adjust the path as needed

const app = express();
const port = 5000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Example route for testing the database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
