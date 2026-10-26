const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config()
const iniciarVerificacaoCarrinho = require('./src/jobs/verificaCarrinho');
app.use(cookieParser());
app.use(express.json());
const iniciarArualizarRastreio = require('./src/jobs/atualizarRastreio');

const allowlist = ['http://localhost:3000', "http://127.0.0.1:5500", 'http://localhost:63342'];
const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = {
      origin: req.header('Origin'),
      credentials: true
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};


app.use(cors(corsOptionsDelegate));

iniciarVerificacaoCarrinho();

//ROTAS IMPORTACAO
const pessoaRoutes = require('./src/routes/pessoa');
const segurancaRoutes = require('./src/routes/segurancaConta');
const carrinhoRoutes = require('./src/routes/carrinho');
const carrinhoItemRoutes = require('./src/routes/carrinhoItem');
const produtoRoutes = require('./src/routes/produto');
const produtoImagemRoutes = require('./src/routes/produtoImagem');
const categoriaProdutoRoutes = require('./src/routes/categoriaProduto');
const controleAcessoRoutes = require('./src/routes/controleAcesso');
const cupomRoutes = require('./src/routes/cupom');
const usuarioCupomRoutes = require('./src/routes/usuarioCupom');
const empresaRoutes = require('./src/routes/empresa');
const enderecoRoutes = require('./src/routes/endereco');
const entregaRoutes = require('./src/routes/entrega');
const itemPedidoRoutes = require('./src/routes/itemPedido');
const pagamentoRoutes = require('./src/routes/pagamento');
const pedidoRoutes = require('./src/routes/pedido');
const authRoutes = require('./src/routes/auth');
const verificacaoRoutes = require('./src/routes/verificacao');
const finalizarCompraRoutes = require('./src/routes/finalizarCompra');

//ROTAS USO
app.use('/pessoas', pessoaRoutes);
app.use('/seguranca', segurancaRoutes);
app.use('/carrinhos', carrinhoRoutes);
app.use('/carrinho-items', carrinhoItemRoutes);
app.use('/produtos', produtoRoutes);
app.use('/produto-imagens', produtoImagemRoutes);
app.use('/categorias-produto', categoriaProdutoRoutes);
app.use('/controle-acesso', controleAcessoRoutes);
app.use('/cupons', cupomRoutes);
app.use('/usuario-cupons', usuarioCupomRoutes);
app.use('/empresa', empresaRoutes);
app.use('/endereco', enderecoRoutes);
app.use('/entrega', entregaRoutes);
app.use('/item-pedidos', itemPedidoRoutes);
app.use('/pagamentos', pagamentoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use('/auth', authRoutes);
app.use('/verificacao', verificacaoRoutes);
app.use('/finalizar-compra', finalizarCompraRoutes);

app.use(express.static(path.join(__dirname, 'public_html')));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/html/inicio.html');
});




//apagar depois
const emailRoutes = require('./src/routes/email');
app.use('/email', emailRoutes);