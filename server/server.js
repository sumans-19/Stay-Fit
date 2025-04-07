const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'diet_manager'
});

// Register
app.post('/api/register', async (req, res) => {
  const {
    name, email, password, age, weight, height, gender,
    activity_level, goal, is_diabetic, is_pregnant,
    preference, allergies, dislikes
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO Users (name, email, password, age, weight, height, gender, activity_level, goal, is_diabetic, is_pregnant, preference, allergies, dislikes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, age, weight, height, gender, activity_level, goal, is_diabetic, is_pregnant, preference, allergies, dislikes],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send({ success: true });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, users) => {
    if (err || users.length === 0) return res.status(401).send('Invalid credentials');
    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) return res.status(401).send('Invalid password');
    const token = jwt.sign({ id: users[0].id }, 'secret');
    res.send({ token });
  });
});

// Get Foods
app.get('/api/foods', (req, res) => {
  const { preference, allergies, goal } = req.query;
  let query = `SELECT * FROM Foods WHERE is_veg = ? AND suitable_for LIKE ?`;
  db.query(query, [preference === 'veg', `%${goal}%`], (err, results) => {
    if (err) return res.status(500).send(err);
    const allergyList = allergies ? allergies.split(',') : [];
    const filtered = results.filter(food => !allergyList.includes(food.name));
    res.send(filtered);
  });
});

// GET user progress (add this to server.js)
app.get('/api/progress', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Unauthorized');
    const decoded = jwt.verify(token, 'secret');
    db.query('SELECT date, weight, calories_consumed FROM Progress WHERE user_id = ?', [decoded.id], (err, rows) => {
      if (err) return res.status(500).send(err);
      res.send(rows);
    });
  });

  app.get('/api/progress/:userId', (req, res) => {
    const { userId } = req.params;
    db.query(
      'SELECT date, weight, calories_consumed FROM Progress WHERE user_id = ? ORDER BY date',
      [userId],
      (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
      }
    );
  });
  
  