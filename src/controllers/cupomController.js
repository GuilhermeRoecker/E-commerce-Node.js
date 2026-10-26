const db = require('../database/db');
const Cupom = require('../database/dto/model/Cupom');

const cupomController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM cupom');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar cupons', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM cupom WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ erro: 'Cupom não encontrado' });
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar cupom', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { codigo, descricao, tipo, desconto, percentual, data_expiracao, limite_uso, uso_total } = req.body;
    try {
      const [result] = await db.query(
        `INSERT INTO cupom (codigo, descricao, tipo, desconto, percentual, data_expiracao, limite_uso, uso_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [codigo, descricao, tipo, desconto, percentual, data_expiracao, limite_uso, uso_total]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar cupom', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { codigo, descricao, tipo, desconto, percentual, data_expiracao, limite_uso, uso_total } = req.body;
    try {
      await db.query(
        `UPDATE cupom SET codigo = ?, descricao = ?, tipo = ?, desconto = ?, percentual = ?, data_expiracao = ?, limite_uso = ?, uso_total = ? WHERE id = ?`,
        [codigo, descricao, tipo, desconto, percentual, data_expiracao, limite_uso, uso_total, id]
      );
      res.status(200).json({ mensagem: 'Cupom atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar cupom', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM cupom WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Cupom excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir cupom', detalhes: err });
    }
  }
};

module.exports = cupomController;
