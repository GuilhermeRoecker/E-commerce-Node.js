const express = require('express');
const router = express.Router();
const itemPedidoController = require('../controllers/itemPedidoController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, itemPedidoController.listAll);
router.get('/:id', autenticarJWT, validaUserId, itemPedidoController.get);
router.post('/', autenticarJWT, validaUserId, itemPedidoController.create);
router.patch('/:id', autenticarJWT, validaUserId, itemPedidoController.update);
router.delete('/:id', autenticarJWT, validaUserId, itemPedidoController.delete);

module.exports = router;
