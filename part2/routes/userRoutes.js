const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login
router.post('/login', async (req, res) => {
  console.log("this is login api", req.body);
  const { email, password } = req.body;

  try {
    // check whether the user with specified email address and password exists
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE email = ? AND password_hash = ?
    `, [email, password]);
    console.log("record", rows[0]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    console.log("user", user);
    // Save user session info
    req.session.user = user;
    console.log("req", req.session);
    // Return to the jump page based on role
    const redirectUrl = user.role === 'owner' ? '/owner-dashboard.html' : '/walker-dashboard.html';

    res.json({ message: 'Login successful', redirect: redirectUrl });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Post loguot
router.post("/logout", async (req, res) => {
  console.log("this is logout api");

  try {
    // Terminate the current session to log out the user
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout failed", err);
        return res.status(500).json({ error: 'Logout failed' });
      }

      // Return success message
      console.log("User logged out successfully");
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;