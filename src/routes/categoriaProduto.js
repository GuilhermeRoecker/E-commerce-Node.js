const express = require('express');
const router = express.Router();
const categoriaProdutoController = require('../controllers/categoriaProdutoController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');

router.get('/', autenticarJWT, categoriaProdutoController.listAll);
router.get('/:id', autenticarJWT, categoriaProdutoController.get);
router.post('/', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin'], permitirEmpresa: true }),
     categoriaProdutoController.create);
router.patch('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin'], permitirEmpresa: true }),
     categoriaProdutoController.update);
router.delete('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin'], permitirEmpresa: true }),
     categoriaProdutoController.delete);

module.exports = router;