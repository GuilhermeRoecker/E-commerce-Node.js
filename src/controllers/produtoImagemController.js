const db = require('../database/db');
const ProdutoImagem = require('../database/dto/model/ProdutoImagem');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: './src/uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('image/')
      ? cb(null, true)
      : cb(new Error('Somente imagens são permitidas'));
  }
});

const produtoImagemController = {
  listByProduto: async (req, res) => {
    const { produtoId } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM produtoimagem WHERE produtoId = ?', [produtoId]);
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao listar imagens', detalhes: err });
    }
  },

  uploadImages: async (req, res) => {
  const { produtoId } = req.body;

  if (!produtoId || !req.files || req.files.length === 0) {
    return res.status(400).json({ erro: 'Produto ou imagens não fornecidos' });
  }

  try {
    const insertPromises = req.files.map((file, index) => {
      const url = `/uploads/${file.filename}`; // para servir via rota estática
      const legenda = null;
      const ordem = index;

      return db.query(
        'INSERT INTO produtoimagem (produtoId, url, legenda, ordem) VALUES (?, ?, ?, ?)',
        [produtoId, url, legenda, ordem]
      );
    });

    await Promise.all(insertPromises);

    res.status(201).json({ mensagem: 'Imagens enviadas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar imagens', detalhes: err });
  }
},

create: async (req, res) => {
  try {
    const { produtoId } = req.body;
    const arquivos = req.files;

    if (!produtoId || !arquivos || arquivos.length === 0) {
      return res.status(400).json({ erro: 'Produto ID ou imagens não fornecidos' });
    }

    const insercoes = arquivos.map((file, index) => {
      const url = `/uploads/${file.filename}`;
      return db.query(
        'INSERT INTO produtoimagem (produtoId, url, legenda, ordem) VALUES (?, ?, ?, ?)',
        [produtoId, url, null, index]
      );
    });

    await Promise.all(insercoes);

    res.status(201).json({ mensagem: 'Imagens salvas com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar imagens', detalhes: err.message });
  }
},


update: async (req, res) => {
  const { id } = req.params;
  const { url, legenda, ordem } = req.body;

  try {
    const campos = [];
    const valores = [];

    if (url !== undefined) {
      campos.push('url = ?');
      valores.push(url);
    }
    if (legenda !== undefined) {
      campos.push('legenda = ?');
      valores.push(legenda);
    }
    if (ordem !== undefined) {
      campos.push('ordem = ?');
      valores.push(ordem);
    }

    if (campos.length === 0) {
      return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
    }

    valores.push(id);

    const sql = `UPDATE produtoimagem SET ${campos.join(', ')} WHERE id = ?`;
    await db.query(sql, valores);

    res.status(200).json({ mensagem: 'Imagem atualizada' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar imagem', detalhes: err });
  }
},


  delete: async (req, res) => {
    const { id } = req.params;
    try {
      await db.query('DELETE FROM produtoimagem WHERE id = ?', [id]);
      res.status(200).json({ mensagem: 'Imagem excluída' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao excluir imagem', detalhes: err });
    }
  }
};

module.exports = produtoImagemController;
