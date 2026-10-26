const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, pagamentoController.listAll);
router.get('/:id', autenticarJWT, validaUserId, pagamentoController.get);
router.post('/', autenticarJWT, validaUserId, pagamentoController.create);
router.patch('/:id', autenticarJWT, validaUserId, pagamentoController.update);
router.delete('/:id', autenticarJWT, validaUserId, pagamentoController.delete);

module.exports = router;
