const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');

router.get('/', produtoController.listAll);
router.get('/:id', produtoController.get);
router.post('/', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja']}),
     produtoController.create);
router.patch('/:id', autenticarJWT,
     produtoController.update);
router.delete('/:id', autenticarJWT,
     autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja']}),
     produtoController.delete);

module.exports = router;
