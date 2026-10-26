const db = require('../database/db');
const Endereco = require('../database/dto/model/Endereco');

const enderecoController = {
  listAll: async (req, res) => {
    try {
      const { pessoaId, empresaId } = req.query;
      let sql = 'SELECT * FROM endereco';
      let params = [];
      if (pessoaId) {
        sql += ' WHERE pessoaId = ?';
        params.push(pessoaId);
      } else if (empresaId) {
        sql += ' WHERE empresaId = ?';
        params.push(empresaId);
      }
      const [rows] = await db.query(sql, params);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar endereços', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM endereco WHERE id = ?', [id]);
      if (rows.length === 0) return res.status(404).json({ erro: 'Endereço não encontrado' });
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar endereço', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { pessoaId = null, empresaId = null, rua, numero, complemento, cidade, estado, CEP } = req.body;
    try {
      const [result] = await db.query(
        `INSERT INTO endereco (pessoaId, empresaId, rua, numero, complemento, cidade, estado, CEP)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [pessoaId, empresaId, rua, numero, complemento, cidade, estado, CEP]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar endereço', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { pessoaId = null, empresaId = null, rua, numero, complemento, cidade, estado, CEP } = req.body;
    try {
      await db.query(
        `UPDATE endereco SET pessoaId = ?, empresaId = ?, rua = ?, numero = ?, complemento = ?, cidade = ?, estado = ?, CEP = ? WHERE id = ?`,
        [pessoaId, empresaId, rua, numero, complemento, cidade, estado, CEP, id]
      );
      res.status(200).json({ mensagem: 'Endereço atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar endereço', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM endereco WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Endereço excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir endereço', detalhes: err });
    }
  }
};


module.exports = enderecoController;
