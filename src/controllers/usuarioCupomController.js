const db = require('../database/db');
const Usuario_Cupom = require('../database/dto/model/Usuario_Cupom');

const usuarioCupomController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM usuario_cupom');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar usuário_cupom', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM usuario_cupom WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ erro: 'Usuário_Cupom não encontrado' });
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar usuário_cupom', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { cupom_id, pessoa_id, usado, data_uso } = req.body;
    try {
      const [result] = await db.query(
        `INSERT INTO usuario_cupom (cupom_id, pessoa_id, usado, data_uso)
         VALUES (?, ?, ?, ?)`,
        [cupom_id, pessoa_id, usado, data_uso]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar usuário_cupom', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { cupom_id, pessoa_id, usado, data_uso } = req.body;
    try {
      await db.query(
        `UPDATE usuario_cupom SET cupom_id = ?, pessoa_id = ?, usado = ?, data_uso = ? WHERE id = ?`,
        [cupom_id, pessoa_id, usado, data_uso, id]
      );
      res.status(200).json({ mensagem: 'Usuário_Cupom atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar usuário_cupom', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM usuario_cupom WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Usuário_Cupom excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir usuário_cupom', detalhes: err });
    }
  }
};

module.exports = usuarioCupomController;
