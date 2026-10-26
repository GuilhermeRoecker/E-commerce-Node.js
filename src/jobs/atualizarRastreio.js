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

const statusList = [
  'PENDENTE',
  'PAGO',
  'ENVIADO',
  'ENTREGUE'
];

cron.schedule('* * * * *', async () => {
  console.log("Verificando atualização de rastreio...");

  try {
    const [rows] = await db.query(`
      SELECT p.email, p.nomeCompleto, ped.id AS pedidoId, ped.status
      FROM pedido ped
      JOIN pessoa p ON ped.pessoaId = p.id
      WHERE ped.status != 'Entregue'
    `);

    for (const row of rows) {
      if (!row.email) continue;

      const currentIndex = statusList.indexOf(row.status);
      let proxStatus = 'Entregue';
      if (currentIndex >= 0 && currentIndex < statusList.length - 1) {
        proxStatus = statusList[currentIndex + 1];
      }
      
       await db.query(`
        UPDATE pedido
        SET status = ?
        WHERE id = ?
      `, [proxStatus, row.pedidoId]);

       await transporter.sendMail({
        from: '"Arome" <guilhermeroecker@mkm.net.br>',
        to: row.email,
        subject: `Atualização de Rastreio do Pedido`,
        html: `
          <p>Olá ${row.nomeCompleto},</p>
          <p>O status do seu pedido foi atualizado para: <strong>${proxStatus}</strong>.</p>
        `
      });

      console.log(`Atualização enviada para ${row.email}"`);
    }
  } catch (err) {
    console.error('Erro ao atualizar rastreio', err);
  }
});


