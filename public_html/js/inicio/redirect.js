document.addEventListener('DOMContentLoaded', () => {
  const btnLoginCadastro = document.getElementById('btn-login-cadastro');
  if (btnLoginCadastro) {
    btnLoginCadastro.addEventListener('click', () => {
      window.location.href = '/html/login.html';
    });
  }
});