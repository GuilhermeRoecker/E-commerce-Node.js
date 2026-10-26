const db = require('../database/db');
const Pedido = require('../database/dto/model/Pedido');

const pedidoController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM pedido');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar pedidos', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM pedido WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ erro: 'Pedido não encontrado' });
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar pedido', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { pessoaId, dataPedido, status, total } = req.body;
    try {
      const [result] = await db.query(
        `INSERT INTO pedido (pessoaId, dataPedido, status, total)
         VALUES (?, ?, ?, ?)`,
        [pessoaId, dataPedido, status, total]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar pedido', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { pessoaId, dataPedido, status, total } = req.body;
    try {
      await db.query(
        `UPDATE pedido SET pessoaId = ?, dataPedido = ?, status = ?, total = ? WHERE id = ?`,
        [pessoaId, dataPedido, status, total, id]
      );
      res.status(200).json({ mensagem: 'Pedido atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar pedido', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM pedido WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Pedido excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir pedido', detalhes: err });
    }
  }
};

module.exports = pedidoController;
