// ==============================
// EVENTOS MODAL
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-menu').addEventListener('click', () => {
    document.getElementById('modalMenu').classList.add('active');
  });

  document.getElementById('btn-fechar-modal').addEventListener('click', () => {
    document.getElementById('modalMenu').classList.remove('active');
  });

  document.getElementById('btn-sair').addEventListener('click', () => {
    logout();
    document.getElementById('modalMenu').classList.remove('active');
  });

  document.getElementById('btn-cadastrar-produto').addEventListener('click', () => {
    window.location.href = '/html/loja.html';
    document.getElementById('modalMenu').classList.remove('active');
  });

  document.getElementById('btn-cadastrar-vendedor').addEventListener('click', () => {
    window.location.href = '/html/cadastrar-vendedor.html';
    document.getElementById('modalMenu').classList.remove('active');
  });

  document.getElementById('modalMenu').addEventListener('click', (e) => {
  if (e.target.id === 'modalMenu') {
    document.getElementById('modalMenu').classList.remove('active');
  }
});

  document.getElementById('btn-carrinho').addEventListener('click', () => {
    window.location.href = '/html/carrinho.html';
    document.getElementById('modalMenu').classList.remove('active');
  });

  document.getElementById('btn-cadastrar-empresa').addEventListener('click', () => {
    window.location.href = '/html/cadastro-empresas.html';
    document.getElementById('modalMenu').classList.remove('active');
  });

    document.getElementById('btn-cadastrar-categorias').addEventListener('click', () => {
    window.location.href = '/html/cadastro-categorias.html';
    document.getElementById('modalMenu').classList.remove('active');
  });
});
