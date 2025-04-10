// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'Suman@110473',
  database: 'dietfit',
});

db.connect((err) => {
  if (err) console.error('❌ DB error:', err.message);
  else console.log('✅ MySQL Connected');
});

// Signup
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed],
      (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') return res.status(400).send({ message: 'Email already exists' });
          return res.status(500).send({ message: 'Database error' });
        }
        res.send({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send({ message: 'Invalid email' });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ message: 'Incorrect password' });
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '7d' });
    res.send({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Save User Details
app.post('/api/user-details', (req, res) => {
  const { user_id, age, weight, height, gender, activity_level } = req.body;
  const sql = `INSERT INTO UserDetails (user_id, age, weight, height, gender, activity_level)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [user_id, age, weight, height, gender, activity_level], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error saving details' });
    }
    res.send({ message: 'Details saved successfully' });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
