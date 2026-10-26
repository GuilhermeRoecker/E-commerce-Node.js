const toast = new ToastNotification({
    position: 'bottom-right',
    duration: 5000
});

async function login() {
  const data = {
    email: document.getElementById('email').value,
    senha: document.getElementById('pass').value,
  };

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      toast.error('Erro ao autenticar credenciais');
      return;
    }

    const responseData = await response.json();
    const decoded = jwt_decode(responseData.token);

    console.log('Empresa ID:', decoded.empresaId);
    console.log('Cargo:', decoded.cargo);

    toast.success('Credenciais autenticadas, redirecionando');
    window.location.href = 'http://localhost:3000/html/inicio.html';

  } catch (error) {
    toast.warning(`Erro: ${error.message || error}`);
  }
}

async function cadastrar() {
  const nomeCompleto = document.getElementById('cadastro-nome').value.trim();
  const dataNascimento = document.getElementById('cadastro-nascimento').value;
  const CPF = document.getElementById('cadastro-cpf').value.trim();
  const nomeUsuario = document.getElementById('cadastro-nome-usuario').value.trim();
  const email = document.getElementById('cadastro-email').value.trim();
  const telefone = document.getElementById('cadastro-telefone').value.trim();
  const celular = document.getElementById('cadastro-celular').value.trim();
  const tipoPessoa = document.getElementById('cadastro-tipo').value;
  const senha = document.getElementById('cadastro-senha').value;
  const senhaConfirm = document.getElementById('cadastro-senha-confirm').value;
  const codigoDigitado = document.getElementById('cadastro-codigo').value.trim();

  if (!nomeCompleto || !CPF || !email || !senha || !nomeUsuario) {
    toast.warning('Preencha todos os campos obrigatórios');
    return;
  }

  if (senha !== senhaConfirm) {
    toast.warning('As senhas não coincidem');
    return;
  }
  
  if (parseInt(codigoDigitado) !== codigoVerificacao) {
  toast.error('Código de verificação inválido!');
  return;
  }

  if (parseInt(codigoDigitado) !== codigoVerificacao) {
    toast.error('Código inválido!');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/pessoas/publico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeCompleto,
        dataNascimento,
        CPF,
        nomeUsuario,
        email,
        senhaHash: senha,
        tipoPessoa,
        telefone,
        celular,
        cargo: 'cliente',
        empresaId: null
      })
    });

    if (response.ok) {
      toast.success('Cadastro realizado com sucesso!');
      document.getElementById('tab-login').click();
    } else {
      const erro = await response.json();
      if (erro?.error) {
        toast.error(erro.error);
      } else {
        toast.error('Erro inesperado no cadastro.');
      }
    }

  } catch (err) {
    toast.error(`Erro de conexão: ${err.message}`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabCadastro = document.getElementById('tab-cadastro');
  const contentLogin = document.getElementById('content-login');
  const contentCadastro = document.getElementById('content-cadastro');

  const loginInputs = document.querySelectorAll('#content-login input');
  const cadastroInputs = document.querySelectorAll('#content-cadastro input, #content-cadastro select');
  const btnLogin = document.getElementById('login-button');
  const btnCadastrar = document.getElementById('btn-cadastrar');

  function ativarLogin() {
    tabLogin.classList.add('active');
    tabCadastro.classList.remove('active');
    contentLogin.classList.add('active');
    contentCadastro.classList.remove('active');
  }

  function ativarCadastro() {
    tabCadastro.classList.add('active');
    tabLogin.classList.remove('active');
    contentCadastro.classList.add('active');
    contentLogin.classList.remove('active');
  }

  tabLogin.addEventListener('click', ativarLogin);
  tabCadastro.addEventListener('click', ativarCadastro);

    // Adiciona evento para login (Enter nos inputs da aba login)
  loginInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // evita enviar formulário padrão
        btnLogin.click();
      }
    });
  });
  //Codigo para o email (confirmar email)
  document.getElementById('btn-enviar-codigo').addEventListener('click', async () => {
  const email = document.getElementById('cadastro-email').value.trim();

  if (!email) {
    toast.error('Preencha o campo de e-mail primeiro!');
    return;
  }

  codigoVerificacao = Math.floor(100000 + Math.random() * 900000);

  try {
    const response = await fetch('http://localhost:3000/verificacao/enviar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, codigo: codigoVerificacao })
    });

    if (response.ok) {
      toast.success('Código de verificação enviado!');
    } else {
      toast.error('Erro ao enviar o código');
    }
  } catch (err) {
    toast.error('Erro ao enviar código');
  }
});


  // Adiciona evento para cadastro (Enter nos inputs da aba cadastro)
  cadastroInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        btnCadastrar.click();
      }
    });
  });
});