const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, pedidoController.listAll);
router.get('/:id', autenticarJWT, validaUserId, pedidoController.get);
router.post('/', autenticarJWT, validaUserId, pedidoController.create);
router.patch('/:id', autenticarJWT, validaUserId, pedidoController.update);
router.delete('/:id', autenticarJWT, validaUserId, pedidoController.delete);

module.exports = router;
