const express = require('express');
const router = express.Router();
const controller = require('../controllers/pessoaController');
const autenticarJWT = require('../middleware/auth');
const autorizarCargoEmpresa = require('../middleware/autorizarCargoEmpresa');

// ROTA PÚBLICA – Cadastro de clientes (sem autenticação)
router.post('/publico', controller.createPessoaPublica);

router.get('/', autenticarJWT, controller.listAllPessoas);
router.get('/usuarios', autenticarJWT, controller.listUsuariosPorCargo);
router.get('/:id', autenticarJWT, controller.getPessoa);
router.post('/', autenticarJWT, controller.createPessoa);
router.patch('/:id', autenticarJWT, controller.updatePessoa);
router.delete('/:id', autenticarJWT, controller.deletePessoa);


module.exports = router;
