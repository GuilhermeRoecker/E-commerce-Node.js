const express = require('express');
const router = express.Router();
const cupomController = require('../controllers/cupomController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');

router.get('/', autenticarJWT, cupomController.listAll);
router.get('/:id', autenticarJWT, cupomController.get);
router.post('/', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'dono-loja'], permitirEmpresa: true }),
     cupomController.create);
router.patch('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'dono-loja'], permitirEmpresa: true }),
     cupomController.update);
router.delete('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'dono-loja'], permitirEmpresa: true }),
     cupomController.delete);

module.exports = router;
