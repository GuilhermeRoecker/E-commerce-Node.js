const db = require('../database/db');
const Entrega = require('../database/dto/model/Entrega');

const entregaController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM entrega');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar entregas', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM entrega WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ erro: 'Entrega não encontrada' });
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar entrega', detalhes: err });
    }
  },

  create: async (req, res) => {
    const {
      pedidoId,
      enderecoEntregaId,
      transportadora,
      codigoRastreamento,
      status,
      dataEnvio,
      dataEntrega
    } = req.body;

    try {
      const [result] = await db.query(
        `INSERT INTO entrega (pedidoId, enderecoEntregaId, transportadora, codigoRastreamento, status, dataEnvio, dataEntrega)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [pedidoId, enderecoEntregaId, transportadora, codigoRastreamento, status, dataEnvio, dataEntrega]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar entrega', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const {
      pedidoId,
      enderecoEntregaId,
      transportadora,
      codigoRastreamento,
      status,
      dataEnvio,
      dataEntrega
    } = req.body;

    try {
      await db.query(
        `UPDATE entrega SET pedidoId = ?, enderecoEntregaId = ?, transportadora = ?, codigoRastreamento = ?, status = ?, dataEnvio = ?, dataEntrega = ? WHERE id = ?`,
        [pedidoId, enderecoEntregaId, transportadora, codigoRastreamento, status, dataEnvio, dataEntrega, id]
      );
      res.status(200).json({ mensagem: 'Entrega atualizada' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar entrega', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM entrega WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Entrega excluída' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir entrega', detalhes: err });
    }
  }
};

module.exports = entregaController;
