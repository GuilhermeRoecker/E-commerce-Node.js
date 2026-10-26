const db = require('../database/db');

async function validaUserId(req, res, next) {
  const userId = req.usuario?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (req.usuario.cargo && req.usuario.cargo.toLowerCase() === 'admin') {
    return next();
  }

  if (req.params.pessoaId) {
    if (parseInt(req.params.pessoaId) !== userId) {
      return res.status(403).json({ error: 'Acesso negado para pessoaId diferente' });
    }
    return next();
  }

  // Para rotas que usam carrinhoId (ex: /carrinho-items/:carrinhoId)
  if (req.params.carrinhoId) {
    // Consultar no banco se o carrinho pertence ao usuário
    try {
      const [rows] = await db.query('SELECT * FROM carrinho WHERE id = ? AND pessoaId = ?', [
        req.params.carrinhoId,
        userId
      ]);
      if (rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado para carrinho não pertencente ao usuário' });
      }
      return next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro na validação do carrinho' });
    }
  }

  // Para rotas que usam id de item do carrinho, pode ser necessário consultar para validar
  if (req.params.id) {
    try {
      const [rows] = await db.query(
        `SELECT ci.* FROM carrinhoitem ci
         JOIN carrinho c ON ci.carrinhoId = c.id
         WHERE ci.id = ? AND c.pessoaId = ?`,
        [req.params.id, userId]
      );
      if (rows.length === 0) {
        return res.status(403).json({ error: 'Acesso negado para item de carrinho não pertencente ao usuário' });
      }
      return next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro na validação do item do carrinho' });
    }
  }

  // Caso não tenha parâmetros para validar
  return next();
}

module.exports = validaUserId;