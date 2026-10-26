const db = require('../database/db');
const ControleAcesso = require('../database/dto/model/ControleAcesso');

const controleAcessoController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM controle_acesso');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar controles de acesso', detalhes: err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM controle_acesso WHERE pessoa_id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ erro: 'Controle de acesso não encontrado' });
      }
      res.status(200).json(rows[0]);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar controle de acesso', detalhes: err });
    }
  },

  create: async (req, res) => {
    const { pessoaId, dataCriacaoConta, ultimoLogin, statusConta } = req.body;
    try {
      const [result] = await db.query(
        `INSERT INTO controle_acesso (pessoa_id, data_criacao_conta, ultimo_login, status_conta) VALUES (?, ?, ?, ?)`,
        [pessoaId, dataCriacaoConta, ultimoLogin, statusConta]
      );
      res.status(201).json({ id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao criar controle de acesso', detalhes: err });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { dataCriacaoConta, ultimoLogin, statusConta } = req.body;
    try {
      await db.query(
        `UPDATE controle_acesso SET data_criacao_conta = ?, ultimo_login = ?, status_conta = ? WHERE pessoa_id = ?`,
        [dataCriacaoConta, ultimoLogin, statusConta, id]
      );
      res.status(200).json({ mensagem: 'Controle de acesso atualizado' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar controle de acesso', detalhes: err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM controle_acesso WHERE pessoa_id = ?', [id]);
      res.status(200).json({ mensagem: 'Controle de acesso excluído' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir controle de acesso', detalhes: err });
    }
  }
};

module.exports = controleAcessoController;
