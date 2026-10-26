const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, enderecoController.listAll);
router.get('/:id', autenticarJWT, validaUserId, enderecoController.get);
router.post('/', autenticarJWT, validaUserId, enderecoController.create);
router.patch('/:id', autenticarJWT, validaUserId, enderecoController.update);
router.delete('/:id', autenticarJWT, validaUserId, enderecoController.delete);

module.exports = router;
