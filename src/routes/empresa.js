const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');

router.get('/', autenticarJWT, empresaController.listAll);
router.get('/:id', autenticarJWT,empresaController.get);
router.post('/', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin'], permitirEmpresa: true }),
     empresaController.create);
router.patch('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin'], permitirEmpresa: true }),
     empresaController.update);
router.delete('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin'], permitirEmpresa: true }),
     empresaController.delete);

module.exports = router;
