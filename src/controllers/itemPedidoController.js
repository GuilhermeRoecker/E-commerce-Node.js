const db = require('../database/db');
const ItemPedido = require('../database/dto/model/itemPedido');

const itemPedidoController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM itemPedido');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar itens de pedido', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM itemPedido WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ erro: 'Item de pedido não encontrado' });
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar item de pedido', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;
    try {
      const [result] = await db.query(
        `INSERT INTO itemPedido (pedidoId, produtoId, quantidade, precoUnitario)
         VALUES (?, ?, ?, ?)`,
        [pedidoId, produtoId, quantidade, precoUnitario]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar item de pedido', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { pedidoId, produtoId, quantidade, precoUnitario } = req.body;
    try {
      await db.query(
        `UPDATE itemPedido SET pedidoId = ?, produtoId = ?, quantidade = ?, precoUnitario = ? WHERE id = ?`,
        [pedidoId, produtoId, quantidade, precoUnitario, id]
      );
      res.status(200).json({ mensagem: 'Item de pedido atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar item de pedido', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM itemPedido WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Item de pedido excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir item de pedido', detalhes: err });
    }
  }
};

module.exports = itemPedidoController;
