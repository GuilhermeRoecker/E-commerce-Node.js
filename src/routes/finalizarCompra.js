const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/', async (req, res) => {
  const { pessoaId, enderecoId, pagamento, carrinhoId } = req.body;

  if (!pessoaId || !enderecoId || !pagamento || !carrinhoId) {
    return res.status(400).json({ erro: 'Campos obrigatórios ausentes' });
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    // 1. Buscar itens do carrinho
    const [itens] = await conn.query('SELECT * FROM carrinhoitem WHERE carrinhoId = ?', [carrinhoId]);
    if (itens.length === 0) {
      await conn.rollback();
      return res.status(400).json({ erro: 'Carrinho vazio' });
    }

    // 2. Calcular total do pedido
    let total = 0;
    for (const item of itens) {
      const [[produto]] = await conn.query('SELECT preco, estoque FROM produto WHERE id = ?', [item.produtoId]);
      if (!produto) {
        await conn.rollback();
        return res.status(404).json({ erro: `Produto ID ${item.produtoId} não encontrado` });
      }
      if (produto.estoque < item.quantidade) {
        await conn.rollback();
        return res.status(400).json({ erro: `Estoque insuficiente para produto ID ${item.produtoId}` });
      }

      total += produto.preco * item.quantidade;
    }

    // 3. Criar pedido
    const [pedidoResult] = await conn.query(
      'INSERT INTO pedido (pessoaId, dataPedido, status, total) VALUES (?, NOW(), ?, ?)',
      [pessoaId, 'PAGO', total]
    );
    const pedidoId = pedidoResult.insertId;

    // 4. Inserir itens do pedido e atualizar estoque
    for (const item of itens) {
      const [[produto]] = await conn.query('SELECT preco, estoque FROM produto WHERE id = ?', [item.produtoId]);

      await conn.query(
        'INSERT INTO itemPedido (pedidoId, produtoId, quantidade, precoUnitario) VALUES (?, ?, ?, ?)',
        [pedidoId, item.produtoId, item.quantidade, produto.preco]
      );

      await conn.query(
        'UPDATE produto SET estoque = estoque - ? WHERE id = ?',
        [item.quantidade, item.produtoId]
      );
    }

    // 5. Inserir pagamento (mock simples)
    await conn.query(
      'INSERT INTO pagamento (pedidoId, forma, status, dataPagamento) VALUES (?, ?, ?, NOW())',
      [pedidoId, pagamento, 'PAGO']
    );

    // 6. Limpar carrinho
    await conn.query('DELETE FROM carrinhoitem WHERE carrinhoId = ?', [carrinhoId]);
    await conn.query('DELETE FROM carrinho WHERE id = ?', [carrinhoId]);

    await conn.commit();
    res.status(200).json({ mensagem: 'Compra finalizada com sucesso', pedidoId });
  } catch (error) {
    await conn.rollback();
    console.error('Erro ao finalizar compra:', error);
    res.status(500).json({ erro: 'Erro interno ao finalizar compra' });
  } finally {
    conn.release();
  }
});

module.exports = router;
