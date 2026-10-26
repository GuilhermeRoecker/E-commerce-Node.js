const db = require('../database/db');
const CategoriaProduto = require('../database/dto/model/CategoriaProduto');

const categoriaProdutoController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM categoriaproduto');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar categorias', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM categoriaproduto WHERE id = ?', [id]);
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar categoria', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { nome, descricao } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO categoriaproduto (nome, descricao) VALUES (?, ?)',
        [nome, descricao]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar categoria', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    try {
      await db.query(
        'UPDATE categoriaproduto SET nome = ?, descricao = ? WHERE id = ?',
        [nome, descricao, id]
      );
      res.status(200).json({ mensagem: 'Categoria atualizada' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar categoria', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM categoriaproduto WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Categoria excluída' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir categoria', detalhes: err });
    }
  }
};

module.exports = categoriaProdutoController;
