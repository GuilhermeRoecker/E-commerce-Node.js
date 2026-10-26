const cron = require('node-cron');
const nodemailer = require('nodemailer');
const db = require('../database/db');

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

function iniciarVerificacaoCarrinho() {
  cron.schedule('* 10 * * *', async () => {
    console.log("verificando carrinho..........");

    const seisHoraAtras = new Date(Date.now() - 540 * 60 * 1000);
    const horaAtual = new Date(Date.now() - 180 * 60 * 1000);

    try {
      const [rows] = await db.query(`
        SELECT p.email, p.nomeCompleto, c.id AS carrinhoId, c.dataCriacao
        FROM carrinho c
        JOIN pessoa p ON c.pessoaId = p.id
        WHERE c.dataCriacao < ?
      `, [seisHoraAtras]);

      for (const row of rows) {
        if (!row.email) continue;

        await db.query(`
          UPDATE carrinho
          SET dataCriacao = ?
          WHERE id = ?
        `, [horaAtual, row.carrinhoId]);

        await transporter.sendMail({
          from: `"Arome" <${process.env.EMAIL_USER}>`,
          to: row.email,
          subject: 'Você esqueceu algo no carrinho!',
          html: `
            <p>Olá cliente, ${row.nomeCompleto}</p>
            <p>Você deixou itens no carrinho.</p>
          `
        });

        console.log(`Email enviado para ${row.email} (última criação: ${row.dataCriacao})`);
      }
    } catch (err) {
      console.error('Erro ao enviar e-mail', err);
    }
  });
}

module.exports = iniciarVerificacaoCarrinho;
