const db = require('../database/db'); // ajuste conforme sua conexão com o DB

const CarrinhoController = {
  async get(req, res) {
    const { id } = req.params;
    try {
      const [carrinho] = await db.query('SELECT * FROM carrinho WHERE id = ?', [id]);
      if (carrinho.length === 0) return res.status(404).json({ error: 'Carrinho não encontrado' });
      res.json(carrinho[0]);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
  },

  async listAll(req, res) {
    try {
      const [carrinhos] = await db.query('SELECT * FROM carrinho');
      res.json(carrinhos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar carrinhos' });
    }
  },

async post(req, res) {
  const { pessoaId } = req.body; 
  console.log('POST /carrinhos body:', req.body);

  if (!pessoaId) {
    return res.status(400).json({ error: 'pessoaId é obrigatório' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO carrinho (pessoaId) VALUES (?)',
      [pessoaId]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Erro no post carrinho:', error);
    res.status(500).json({ error: 'Erro ao criar carrinho' });
  }
},

  async patch(req, res) {
    const { id } = req.params;
    const { pessoaId, dataCriacao } = req.body;
    try {
      await db.query(
        'UPDATE carrinho SET pessoaId = ?, dataCriacao = ? WHERE id = ?',
        [pessoaId, dataCriacao, id]
      );
      res.json({ message: 'Carrinho atualizado' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar carrinho' });
    }
  },

  async getByPessoaId(req, res) {
  const { pessoaId } = req.params;
  try {
    const [carrinho] = await db.query('SELECT * FROM carrinho WHERE pessoaId = ? ORDER BY id DESC LIMIT 1', [pessoaId]);
    if (carrinho.length === 0) return res.status(404).json({ error: 'Carrinho não encontrado' });
    res.json(carrinho[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar carrinho por pessoaId' });
  }
},


  async delete(req, res) {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM carrinho WHERE id = ?', [id]);
      res.json({ message: 'Carrinho removido' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar carrinho' });
    }
  },
};

module.exports = CarrinhoController;
