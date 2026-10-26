const express = require('express');
const router = express.Router();
const produtoImagemController = require('../controllers/produtoImagemController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Apenas imagens são permitidas'));
  }
});


router.get('/:produtoId', produtoImagemController.listByProduto);
router.post('/', autenticarJWT,
     autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja']}),
     upload.array('images', 5), produtoImagemController.create);
router.patch('/:id', autenticarJWT,
     autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja']}),
     upload.array('images', 5), produtoImagemController.update);
router.delete('/:id', autenticarJWT,
     autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja']}),
     produtoImagemController.delete);

module.exports = router;
