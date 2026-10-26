const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const autenticarJWT = require('../middleware/auth');

router.post('/login', login);

router.get('/me', autenticarJWT, (req, res) => {
  res.json(req.usuario);
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true
  });
  res.sendStatus(200);
});

module.exports = router;
