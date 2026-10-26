const express = require('express');
const router = express.Router();
const carrinhoItemController = require('../controllers/carrinhoItemController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');


router.get('/:carrinhoId', autenticarJWT, validaUserId, carrinhoItemController.listByCarrinhoId);
router.post('/', autenticarJWT, validaUserId, carrinhoItemController.create);
router.patch('/:id', autenticarJWT, validaUserId, carrinhoItemController.update);
router.delete('/:id', autenticarJWT, validaUserId, carrinhoItemController.delete);
router.delete('/carrinho/:carrinhoId', autenticarJWT, validaUserId, carrinhoItemController.deleteByCarrinhoId);

module.exports = router;