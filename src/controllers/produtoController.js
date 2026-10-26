const db = require('../database/db');
const Produto = require('../database/dto/model/Produto');

const produtoController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM produto');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar produtos', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM produto WHERE id = ?', [id]);
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar produto', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { nome, descricao, preco, estoque, empresaId, categoriaId, ativo } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO produto (nome, descricao, preco, estoque, empresaId, categoriaId, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nome, descricao, preco, estoque, empresaId, categoriaId, ativo]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar produto', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, empresaId, categoriaId, ativo } = req.body;
    try {
      await db.query(
        'UPDATE produto SET nome = ?, descricao = ?, preco = ?, estoque = ?, empresaId = ?, categoriaId = ?, ativo = ? WHERE id = ?',
        [nome, descricao, preco, estoque, empresaId, categoriaId, ativo, id]
      );
      res.status(200).json({ mensagem: 'Produto atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar produto', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM produto WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Produto excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir produto', detalhes: err });
    }
  }
};

module.exports = produtoController;
