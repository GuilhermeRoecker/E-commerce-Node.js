// perfil.js
const toast = new ToastNotification({ position: 'bottom-right', duration: 5000 });

let usuarioLogado = null;
const formPerfil = document.getElementById('form-perfil');
const formEndereco = document.getElementById('form-endereco');
const modalEndereco = document.getElementById('modal-endereco');
const btnAdicionarEndereco = document.getElementById('btn-adicionar-endereco');
const btnFecharEndereco = document.getElementById('fechar-modal-endereco');
const btnCancelarEndereco = document.getElementById('cancelar-endereco');

// ============================
// UTILITÁRIOS
// ============================
function abrirModalEndereco() {
  formEndereco.reset();
  modalEndereco.classList.add('active');
  modalEndereco.setAttribute('aria-hidden', 'false');
}

function fecharModalEndereco() {
  modalEndereco.classList.remove('active');
  modalEndereco.setAttribute('aria-hidden', 'true');
}

// ============================
// BUSCAR USUÁRIO LOGADO
// ============================
async function getUsuarioLogado() {
  try {
    const res = await fetch('/auth/me', { credentials: 'include' });
    if (!res.ok) throw new Error('Não autenticado');
    return await res.json();
  } catch (err) {
    toast.error('Erro ao verificar usuário.');
    console.error(err);
    return null;
  }
}

// ============================
// CARREGAR PERFIL
// ============================
async function carregarPerfil() {
  try {
    const res = await fetch(`/pessoas/${usuarioLogado.id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao carregar dados do perfil');
    const pessoa = await res.json();

    formPerfil.nomeCompleto.value = pessoa.nomeCompleto || '';
    formPerfil.email.value = pessoa.email || '';
    formPerfil.telefone.value = pessoa.telefone || '';
    formPerfil.celular.value = pessoa.celular || '';
  } catch (err) {
    toast.error('Erro ao carregar informações do perfil.');
    console.error(err);
  }
}

// ============================
// SALVAR PERFIL
// ============================
formPerfil?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    nomeCompleto: formPerfil.nomeCompleto.value.trim(),
    email: formPerfil.email.value.trim(),
    telefone: formPerfil.telefone.value.trim(),
    celular: formPerfil.celular.value.trim(),
  };

  const novaSenha = formPerfil.novaSenha.value.trim();
  if (novaSenha) payload.senhaHash = novaSenha;

  try {
    const res = await fetch(`/pessoas/${usuarioLogado.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Erro ao atualizar perfil');
    toast.success('Perfil atualizado com sucesso!');
  } catch (err) {
    toast.error('Erro ao salvar perfil.');
    console.error(err);
  }
});

// ============================
// LISTAR ENDEREÇOS
// ============================
async function listarEnderecos() {
  try {
    const res = await fetch(`/endereco?pessoaId=${usuarioLogado.id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao buscar endereços');
    const enderecos = await res.json();

    const lista = document.getElementById('enderecos-lista');
    lista.innerHTML = '';

    if (enderecos.length === 0) {
      lista.innerHTML = '<p>Nenhum endereço cadastrado.</p>';
      return;
    }

    enderecos.forEach(end => {
      const div = document.createElement('div');
      div.className = 'endereco-card';

      div.innerHTML = `
        <div class="endereco-info">
          <p><strong>${end.rua}, ${end.numero}</strong>${end.complemento ? ' - ' + end.complemento : ''}</p>
          <p>${end.cidade} - ${end.estado}, ${end.CEP}</p>
        </div>
        <div class="endereco-actions">
          <button class="btn-icon btn-edit" title="Editar" data-id="${end.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-icon btn-delete" title="Excluir" data-id="${end.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

      div.querySelector('.btn-edit').addEventListener('click', () => editarEndereco(end));
      div.querySelector('.btn-delete').addEventListener('click', () => excluirEndereco(end.id));

      lista.appendChild(div);
    });
  } catch (err) {
    toast.error('Erro ao carregar endereços');
    console.error(err);
  }
}

// ============================
// EDITAR ENDEREÇO
// ============================

function editarEndereco(end) {
  formEndereco.rua.value = end.rua;
  formEndereco.numero.value = end.numero;
  formEndereco.complemento.value = end.complemento || '';
  formEndereco.cidade.value = end.cidade;
  formEndereco.estado.value = end.estado;
  formEndereco.CEP.value = end.CEP;
  formEndereco.dataset.editandoId = end.id;
  abrirModalEndereco();
}

// ============================
// SALVAR NOVO ENDEREÇO
// ============================
formEndereco?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const dados = {
    pessoaId: usuarioLogado.id,
    rua: formEndereco.rua.value.trim(),
    numero: formEndereco.numero.value.trim(),
    complemento: formEndereco.complemento.value.trim(),
    cidade: formEndereco.cidade.value.trim(),
    estado: formEndereco.estado.value.trim(),
    CEP: formEndereco.CEP.value.trim()
  };

  const idEditando = formEndereco.dataset.editandoId;
  const url = idEditando ? `/endereco/${idEditando}` : '/endereco';
  const method = idEditando ? 'PATCH' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dados)
    });

    if (!res.ok) throw new Error('Erro ao salvar endereço');

    toast.success(idEditando ? 'Endereço atualizado com sucesso!' : 'Endereço cadastrado com sucesso!');
    formEndereco.dataset.editandoId = '';
    fecharModalEndereco();
    listarEnderecos();
  } catch (err) {
    toast.error('Erro ao salvar endereço.');
    console.error(err);
  }
});


// ============================
// EXCLUIR ENDEREÇO
// ============================

async function excluirEndereco(id) {
  if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

  try {
    const res = await fetch(`/endereco/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) throw new Error('Erro ao excluir endereço');
    toast.success('Endereço excluído com sucesso!');
    listarEnderecos();
  } catch (err) {
    toast.error('Erro ao excluir endereço.');
    console.error(err);
  }
}


// ============================
// INICIALIZAÇÃO
// ============================
(async () => {
  usuarioLogado = await getUsuarioLogado();
  if (!usuarioLogado) {
    toast.error('Você precisa estar logado.');
    window.location.href = '/login.html';
    return;
  }

  carregarPerfil();
  listarEnderecos();
})();

btnAdicionarEndereco.addEventListener('click', abrirModalEndereco);
btnFecharEndereco.addEventListener('click', fecharModalEndereco);
btnCancelarEndereco.addEventListener('click', fecharModalEndereco);
document.getElementById('btn-voltar').addEventListener('click', () => {
  window.location.href = '/html/inicio.html';
});
