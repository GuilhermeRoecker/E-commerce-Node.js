const express = require('express');
const router = express.Router();
const controller = require('../controllers/segurancaContaController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/:pessoaId', autenticarJWT, validaUserId, controller.getSeguranca);
router.post('/', autenticarJWT, validaUserId, controller.createSeguranca);
router.patch('/:pessoaId', autenticarJWT, validaUserId, controller.updateSeguranca);
router.delete('/:pessoaId', autenticarJWT, validaUserId, controller.deleteSeguranca);

module.exports = router;
