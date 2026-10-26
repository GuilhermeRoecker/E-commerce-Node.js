const db = require('../database/db');

const carrinhoItemController = {
  // Listar todos os itens de um carrinho específico
  listByCarrinhoId: async (req, res) => {
    const { carrinhoId } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM carrinhoitem WHERE carrinhoId = ?', [carrinhoId]);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar itens do carrinho', detalhes: err });
    }
  },

  // Adicionar item ao carrinho (com soma e validação de estoque)
 create: async (req, res) => {
  const { carrinhoId, produtoId, quantidade } = req.body;

  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({ erro: 'Quantidade deve ser maior que zero' });
  }

  try {
    // Buscar estoque do produto
    const [produtos] = await db.query('SELECT estoque FROM produto WHERE id = ?', [produtoId]);
    if (produtos.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    const estoque = produtos[0].estoque;

    // Buscar item existente no carrinho
    const [items] = await db.query('SELECT * FROM carrinhoitem WHERE carrinhoId = ? AND produtoId = ?', [carrinhoId, produtoId]);

    if (items.length === 0) {
      // Não existe no carrinho, inserir limitado ao estoque
      const qtdInserir = Math.min(quantidade, estoque);
      const [result] = await db.query(
        'INSERT INTO carrinhoitem (carrinhoId, produtoId, quantidade) VALUES (?, ?, ?)',
        [carrinhoId, produtoId, qtdInserir]
      );
      return res.status(201).json({ id: result.insertId, carrinhoId, produtoId, quantidade: qtdInserir });
    } else {
      // Já existe, somar quantidade e limitar ao estoque
      const itemAtual = items[0];
      const novaQtd = Math.min(itemAtual.quantidade + quantidade, estoque);

      if (novaQtd === 0) {
        // Se zero, remover item
        await db.query('DELETE FROM carrinhoitem WHERE id = ?', [itemAtual.id]);
        return res.status(200).json({ mensagem: 'Item removido do carrinho pois quantidade ficou zero' });
      }

      await db.query('UPDATE carrinhoitem SET quantidade = ? WHERE id = ?', [novaQtd, itemAtual.id]);
      return res.status(200).json({ mensagem: 'Quantidade atualizada com sucesso', quantidade: novaQtd });
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao adicionar item ao carrinho', detalhes: err });
  }
},

  // Atualizar quantidade do item com validação de estoque
  update: async (req, res) => {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (quantidade == null || quantidade < 0) {
      return res.status(400).json({ erro: 'Quantidade inválida' });
    }

    try {
      // Buscar carrinhoitem e produtoId
      const [items] = await db.query('SELECT produtoId FROM carrinhoitem WHERE id = ?', [id]);
      if (items.length === 0) {
        return res.status(404).json({ erro: 'Item não encontrado' });
      }
      const produtoId = items[0].produtoId;

      // Buscar estoque do produto
      const [produtos] = await db.query('SELECT estoque FROM produto WHERE id = ?', [produtoId]);
      if (produtos.length === 0) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      const estoque = produtos[0].estoque;

      if (quantidade === 0) {
        // Remove o item se quantidade for zero
        await db.query('DELETE FROM carrinhoitem WHERE id = ?', [id]);
        return res.status(200).json({ mensagem: 'Item removido do carrinho' });
      }

      if (quantidade > estoque) {
        return res.status(400).json({ erro: `Quantidade excede o estoque disponível (${estoque})` });
      }

      await db.query('UPDATE carrinhoitem SET quantidade = ? WHERE id = ?', [quantidade, id]);
      res.status(200).json({ mensagem: 'Quantidade atualizada com sucesso' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar item do carrinho', detalhes: err });
    }
  },

  // Remover item individual
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM carrinhoitem WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Item removido com sucesso' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao remover item do carrinho', detalhes: err });
    }
  },

  // Remover todos os itens de um carrinho
  deleteByCarrinhoId: async (req, res) => {
    const { carrinhoId } = req.params;
    try {
      await db.query('DELETE FROM carrinhoitem WHERE carrinhoId = ?', [carrinhoId]);
      res.status(200).json({ mensagem: 'Todos os itens do carrinho foram removidos' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao limpar carrinho', detalhes: err });
    }
  }
};

module.exports = carrinhoItemController;
