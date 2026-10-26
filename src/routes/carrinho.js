const express = require('express');
const router = express.Router();
const CarrinhoController = require('../controllers/carrinhoController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, CarrinhoController.listAll);
router.get('/:id', autenticarJWT, validaUserId, CarrinhoController.get);
router.post('/', autenticarJWT, validaUserId, CarrinhoController.post);
router.patch('/:id', autenticarJWT, validaUserId, CarrinhoController.patch);
router.delete('/:id', autenticarJWT, validaUserId, CarrinhoController.delete);
router.get('/pessoa/:pessoaId', autenticarJWT, validaUserId, CarrinhoController.getByPessoaId);

module.exports = router;
