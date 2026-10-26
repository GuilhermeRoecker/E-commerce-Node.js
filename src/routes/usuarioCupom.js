const express = require('express');
const router = express.Router();
const usuarioCupomController = require('../controllers/usuarioCupomController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');

router.get('/', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja'], permitirEmpresa: true }),
     usuarioCupomController.listAll);
router.get('/:id', autenticarJWT, usuarioCupomController.get);
router.post('/', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja'], permitirEmpresa: true }),
     usuarioCupomController.create);
router.patch('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja'], permitirEmpresa: true }),
     usuarioCupomController.update);
router.delete('/:id', autenticarJWT,
    autorizarCargoEmpresa({ cargosPermitidos: ['admin', 'vendedor', 'dono-loja'], permitirEmpresa: true }),
     usuarioCupomController.delete);

module.exports = router;
