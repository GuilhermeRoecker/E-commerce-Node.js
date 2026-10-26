const express = require('express');
const router = express.Router();
const controleAcessoController = require('../controllers/controleAcessoController');
const autenticarJWT = require('../middleware/auth');
const validaUserId = require('../middleware/validaUserId');

router.get('/', autenticarJWT, validaUserId, controleAcessoController.listAll);
router.get('/:id', autenticarJWT, validaUserId, controleAcessoController.get);
router.post('/', autenticarJWT, validaUserId, controleAcessoController.create);
router.patch('/:id', autenticarJWT, validaUserId, controleAcessoController.update);
router.delete('/:id', autenticarJWT, validaUserId, controleAcessoController.delete);

module.exports = router;
