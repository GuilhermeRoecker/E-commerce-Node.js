const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post('/enviar-codigo', async (req, res) => {
  const { email, codigo } = req.body;

  try {
    await transporter.sendMail({
      from: '"Cadastro" <guilhermeroecker@mkm.net.br>',
      to: email,
      subject: 'Código de Verificação',
      html: `<p>Olá cliente obrigado pelo cadastro em nosso site segue a abaixo seu código de verificação.</p> 
                <p>Seu código de verificação é: <b>${codigo}</b></p>`
    });

    res.json({ message: 'Código enviado com sucesso!' });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).json({ message: 'Falha ao enviar e-mail' });
  }
});

module.exports = router;
