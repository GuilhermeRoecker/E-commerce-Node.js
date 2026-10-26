const express = require('express');
const router = express.Router();
const entregaController = require('../controllers/entregaController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, entregaController.listAll);
router.get('/:id', autenticarJWT, validaUserId, entregaController.get);
router.post('/', autenticarJWT, validaUserId, entregaController.create);
router.patch('/:id', autenticarJWT, validaUserId, entregaController.update);
router.delete('/:id', autenticarJWT, validaUserId, entregaController.delete);

module.exports = router;
