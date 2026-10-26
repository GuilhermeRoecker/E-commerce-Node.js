const db = require('../database/db');
const Empresa = require('../database/dto/model/Empresa');

const empresaController = {
  listAll: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM empresa');
      res.status(200).json(rows);
    } catch (err) {
      console.error('Erro ao listar empresas:', err);
      res.status(500).json({ erro: 'Erro ao listar empresas', detalhes: err.message || err });
    }
  },

  get: async (req, res) => {
    const { id } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM empresa WHERE id = ?', [id]);
      if (rows.length === 0) {
        console.warn(`Empresa com id ${id} não encontrada.`);
        return res.status(404).json({ erro: 'Empresa não encontrada' });
      }
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error('Erro ao buscar empresa:', err);
      res.status(500).json({ erro: 'Erro ao buscar empresa', detalhes: err.message || err });
    }
  },

create: async (req, res) => {
  const { razaoSocial, nomeFantasia, inscricaoEstadual, site } = req.body;

  console.log('Recebido no body:', req.body); // debug

  try {
    const [result] = await db.query(
      `INSERT INTO empresa (razaoSocial, nomeFantasia, inscricaoEstadual, site)
       VALUES (?, ?, ?, ?)`,
      [razaoSocial, nomeFantasia, inscricaoEstadual, site]
    );

    console.log('Empresa criada com ID:', result.insertId); // debug
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao criar empresa:', err); // log completo do erro
    res.status(500).json({ erro: 'Erro ao criar empresa', detalhes: err.message });
  }
},


  update: async (req, res) => {
    const { id } = req.params;
    const { razaoSocial, nomeFantasia, inscricaoEstadual, site } = req.body;
    try {
      const [result] = await db.query(
        `UPDATE empresa SET razaoSocial = ?, nomeFantasia = ?, inscricaoEstadual = ?, site = ? WHERE id = ?`,
        [razaoSocial, nomeFantasia, inscricaoEstadual || null, site || null, id]
      );

      if (result.affectedRows === 0) {
        console.warn(`Nenhuma empresa atualizada. ID não encontrado: ${id}`);
        return res.status(404).json({ erro: 'Empresa não encontrada para atualizar' });
      }

      res.status(200).json({ mensagem: 'Empresa atualizada' });
    } catch (err) {
      console.error('Erro ao atualizar empresa:', err);
      res.status(500).json({ erro: 'Erro ao atualizar empresa', detalhes: err.message || err });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM empresa WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        console.warn(`Nenhuma empresa excluída. ID não encontrado: ${id}`);
        return res.status(404).json({ erro: 'Empresa não encontrada para exclusão' });
      }

      res.status(200).json({ mensagem: 'Empresa excluída' });
    } catch (err) {
      console.error('Erro ao excluir empresa:', err);
      res.status(500).json({ erro: 'Erro ao excluir empresa', detalhes: err.message || err });
    }
  }
};

module.exports = empresaController;
