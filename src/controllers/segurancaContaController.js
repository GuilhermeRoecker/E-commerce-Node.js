const db = require('../database/db');

// GET segurança por pessoaId
async function getSeguranca(req, res) {
  const { pessoaId } = req.params;
  const [rows] = await db.query('SELECT * FROM seguranca_conta WHERE pessoaId = ?', [pessoaId]);
  if (rows.length === 0) return res.status(404).json({ error: 'Segurança não encontrada' });
  res.json(rows[0]);
}

// POST segurança
async function createSeguranca(req, res) {
  const {
    pessoaId,
    emailVerificado,
    tokenVerificacaoEmail,
    tentativasDeLoginFalhas,
    bloqueadoAte
  } = req.body;

  await db.query(
    `INSERT INTO seguranca_conta (pessoaId, emailVerificado, tokenVerificacaoEmail, tentativasDeLoginFalhas, bloqueadoAte)
     VALUES (?, ?, ?, ?, ?)`,
    [pessoaId, emailVerificado, tokenVerificacaoEmail, tentativasDeLoginFalhas, bloqueadoAte]
  );

  res.status(201).json({ message: 'Segurança de conta criada' });
}

// PATCH
async function updateSeguranca(req, res) {
  const { pessoaId } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) return res.status(400).json({ error: 'Nada para atualizar' });

  const setClause = keys.map(key => `${key} = ?`).join(', ');
  await db.query(
    `UPDATE seguranca_conta SET ${setClause} WHERE pessoaId = ?`,
    [...values, pessoaId]
  );

  res.json({ message: 'Segurança de conta atualizada' });
}

// DELETE
async function deleteSeguranca(req, res) {
  const { pessoaId } = req.params;
  await db.query('DELETE FROM seguranca_conta WHERE pessoaId = ?', [pessoaId]);
  res.json({ message: 'Segurança de conta removida' });
}

module.exports = {
  getSeguranca,
  createSeguranca,
  updateSeguranca,
  deleteSeguranca
};
