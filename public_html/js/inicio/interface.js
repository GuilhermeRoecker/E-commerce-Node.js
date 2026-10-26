// ==============================
// INTERFACE
// ==============================
async function ajustarInterface() {
  const usuario = await getUsuarioLogado();

  const btnLoginCadastro = document.getElementById('btn-login-cadastro');
  const btnMenu = document.getElementById('btn-menu');
  const modalMenu = document.getElementById('modalMenu');

  const btnSair = document.getElementById('btn-sair');
  const btnCadastrarProduto = document.getElementById('btn-cadastrar-produto');
  const btnCadastrarVendedor = document.getElementById('btn-cadastrar-vendedor');
  const btnCarrinho = document.getElementById('btn-carrinho');
  const textoUsuario = document.getElementById('texto-usuario');

  const btnCadastrarEmpresa = document.getElementById('btn-cadastrar-empresa');
  const btnCadastrarCategorias = document.getElementById('btn-cadastrar-categorias');
  const iconeUsuario = document.querySelector('.fa-user');

  if (!usuario) {
    textoUsuario.textContent = 'Olá, visitante';
    btnLoginCadastro.style.display = 'inline-flex';
    btnMenu.style.display = 'none';

    btnCarrinho.style.display = 'none';
    btnCadastrarProduto.style.display = 'none';
    btnCadastrarVendedor.style.display = 'none';
    btnSair.style.display = 'none';

    btnCadastrarEmpresa.style.display = 'none';
    btnCadastrarCategorias.style.display = 'none';

    modalMenu.classList.remove('active');

    // Se não estiver logado, redireciona para login ao clicar no ícone
    iconeUsuario.addEventListener('click', () => {
      window.location.href = '/html/login.html'; // ou outra página de login/cadastro
    });

  } else {
    textoUsuario.textContent = `Olá, ${usuario.nomeCompleto || usuario.email || 'usuário'}`;
    btnLoginCadastro.style.display = 'none';
    btnMenu.style.display = 'inline-flex';

    btnCarrinho.style.display = 'none';
    btnCadastrarProduto.style.display = 'none';
    btnCadastrarVendedor.style.display = 'none';
    btnSair.style.display = 'inline-flex';

    const perfil = usuario.cargo || usuario.perfil || usuario.role || 'cliente';

    if (perfil === 'admin') {
      btnCadastrarProduto.style.display = 'inline-flex';
      btnCadastrarVendedor.style.display = 'inline-flex';
      btnCarrinho.style.display = 'inline-flex';

      btnCadastrarEmpresa.style.display = 'inline-flex';
      btnCadastrarCategorias.style.display = 'inline-flex';
    } else if (perfil === 'dono-loja') {
      btnCadastrarProduto.style.display = 'inline-flex';
      btnCadastrarVendedor.style.display = 'inline-flex';
      btnCarrinho.style.display = 'inline-flex';
    } else if (perfil === 'vendedor') {
      btnCadastrarProduto.style.display = 'inline-flex';
      btnCarrinho.style.display = 'inline-flex';
    } else if (perfil === 'cliente') {
      btnCarrinho.style.display = 'inline-flex';
    } else {
      btnCadastrarEmpresa.style.display = 'none';
      btnCadastrarCategorias.style.display = 'none';
    }

    // Redireciona para a página de perfil ao clicar no ícone do usuário
    iconeUsuario.addEventListener('click', () => {
      window.location.href = '/html/perfil.html';
    });
  }
}
