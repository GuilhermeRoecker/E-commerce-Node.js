const toast = new ToastNotification({ position: 'bottom-right', duration: 5000 });

// ==============================
// FUNÇÕES DE AUTENTICAÇÃO
// ==============================
async function getUsuarioLogado() {
  try {
    const res = await fetch('/auth/me', { credentials: 'include' });
    if (res.status === 401 || !res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function logout() {
  fetch('/auth/logout', { method: 'POST', credentials: 'include' })
    .then(() => location.reload())
    .catch(() => location.reload());
}

async function verificarAdmin() {
  try {
    const res = await fetch('/auth/me', { credentials: 'include' });
    if (!res.ok) return false;
    const usuario = await res.json();
    return usuario.cargo && usuario.cargo.toLowerCase() === 'admin';
  } catch {
    return false;
  }
}

const modal = document.getElementById('modal-empresa');
const btnNova = document.getElementById('btn-nova-empresa');
const btnFechar = document.getElementById('btn-fechar-modal');
const btnCancelar = document.getElementById('btn-cancelar');
const formEmpresa = document.getElementById('form-empresa');
const modalTitle = document.getElementById('modal-title');

let editandoEmpresaId = null;

btnNova.addEventListener('click', () => {
  editandoEmpresaId = null;
  modalTitle.textContent = 'Nova Empresa';
  formEmpresa.reset();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
});

function fecharModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
}
btnFechar.addEventListener('click', fecharModal);
btnCancelar.addEventListener('click', fecharModal);

async function listarEmpresas() {
  const lista = document.getElementById('lista-empresas');
  lista.innerHTML = '';

  try {
    const res = await fetch('/empresa', { credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao carregar empresas');
    const empresas = await res.json();

    if (empresas.length === 0) {
      lista.innerHTML = '<li>Nenhuma empresa cadastrada.</li>';
      return;
    }

    empresas.forEach(e => {
      const li = document.createElement('li');
      li.classList.add('empresa-card');

      const info = document.createElement('div');
      info.className = 'empresa-info';
      info.textContent = `${e.razaoSocial} (${e.nomeFantasia || 'Sem nome fantasia'})`;

      const botoes = document.createElement('div');
      botoes.className = 'empresa-buttons';

      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar';
      btnEditar.className = 'edit';
      btnEditar.addEventListener('click', () => abrirModalEditar(e.id));

      const btnRemover = document.createElement('button');
      btnRemover.textContent = 'Remover';
      btnRemover.className = 'delete';
      btnRemover.addEventListener('click', () => removerEmpresa(e.id, e.razaoSocial));

      botoes.appendChild(btnEditar);
      botoes.appendChild(btnRemover);

      li.appendChild(info);
      li.appendChild(botoes);
      lista.appendChild(li);
    });
  } catch (error) {
    toast.error('Erro ao carregar empresas.');
    console.error(error);
  }
}

async function abrirModalEditar(id) {
  try {
    const resEmpresa = await fetch(`/empresa/${id}`, { credentials: 'include' });
    if (!resEmpresa.ok) throw new Error('Empresa não encontrada');
    const empresa = await resEmpresa.json();

    // Aqui troque 'idEmpresa' por 'id'
    const resEndereco = await fetch(`/endereco?empresaId=${id}`, { credentials: 'include' });  
    let endereco = {};
    if (resEndereco.ok) {
      const enderecos = await resEndereco.json();
      if (enderecos.length > 0) endereco = enderecos[0];
    }

    editandoEmpresaId = id;
    modalTitle.textContent = 'Editar Empresa';

    formEmpresa.razaoSocial.value = empresa.razaoSocial || '';
    formEmpresa.nomeFantasia.value = empresa.nomeFantasia || '';
    formEmpresa.inscricaoEstadual.value = empresa.inscricaoEstadual || '';
    formEmpresa.site.value = empresa.site || '';

    formEmpresa.rua.value = endereco.rua || '';
    formEmpresa.numero.value = endereco.numero || '';
    formEmpresa.complemento.value = endereco.complemento || '';
    formEmpresa.cidade.value = endereco.cidade || '';
    formEmpresa.estado.value = endereco.estado || '';
    formEmpresa.cep.value = endereco.CEP || '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  } catch (error) {
    toast.error('Erro ao carregar dados da empresa e endereço.');
    console.error(error);
  }
}

function confirmarRemocao(nome, onConfirm) {
  const container = document.createElement('div');
  container.className = 'toast-confirm';

  container.innerHTML = `
    <div>Confirma a exclusão da empresa "${nome}"? Essa ação não pode ser desfeita.</div>
    <div class="toast-buttons">
      <button id="sim">Sim</button>
      <button id="nao">Não</button>
    </div>
  `;

  document.body.appendChild(container);

  container.querySelector('#sim').onclick = () => {
    onConfirm();
    document.body.removeChild(container);
  };
  container.querySelector('#nao').onclick = () => {
    document.body.removeChild(container);
  };
}

function removerEmpresa(id, nome) {
  confirmarRemocao(nome, async () => {
    try {
      const res = await fetch(`/empresa/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Erro ao excluir empresa');
      toast.success('Empresa removida com sucesso!');
      listarEmpresas();
    } catch (error) {
      toast.error('Erro ao remover empresa.');
      console.error(error);
    }
  });
}

formEmpresa.addEventListener('submit', async e => {
  e.preventDefault();

  const dadosEmpresa = {
    razaoSocial: formEmpresa.razaoSocial.value.trim(),
    nomeFantasia: formEmpresa.nomeFantasia.value.trim(),
    inscricaoEstadual: formEmpresa.inscricaoEstadual.value.trim(),
    site: formEmpresa.site.value.trim(),
  };

  const dadosEndereco = {
    rua: formEmpresa.rua.value.trim(),
    numero: formEmpresa.numero.value.trim(),
    complemento: formEmpresa.complemento.value.trim(),
    cidade: formEmpresa.cidade.value.trim(),
    estado: formEmpresa.estado.value.trim(),
    CEP: formEmpresa.cep.value.trim(),
  };

  if (!dadosEmpresa.razaoSocial || !dadosEmpresa.nomeFantasia) {
    toast.warning('Razão Social e Nome Fantasia são obrigatórios.');
    return;
  }

  try {
    let resEmpresa;
    let idEmpresa;

    if (editandoEmpresaId) {
      resEmpresa = await fetch(`/empresa/${editandoEmpresaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dadosEmpresa),
      });
      idEmpresa = editandoEmpresaId;
    } else {
      resEmpresa = await fetch('/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dadosEmpresa),
      });
      const novaEmpresa = await resEmpresa.json();
      idEmpresa = novaEmpresa.id;
    }

    if (!resEmpresa.ok) throw new Error('Erro ao salvar empresa');

    const resEndereco = await fetch(`/endereco?empresaId=${idEmpresa}`, {
      credentials: 'include',
    });

    let enderecoExistente = [];
    if (resEndereco.ok) enderecoExistente = await resEndereco.json();

    const metodoEndereco = enderecoExistente.length > 0 ? 'PATCH' : 'POST';
    const urlEndereco = enderecoExistente.length > 0
      ? `/endereco/${enderecoExistente[0].id}`
      : `/endereco`;

    const resSalvarEndereco = await fetch(urlEndereco, {
      method: metodoEndereco,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        empresaId: idEmpresa,
        pessoaId: null,        
        ...dadosEndereco
      }),
    })

    if (!resSalvarEndereco.ok) throw new Error('Erro ao salvar endereço');

    toast.success(editandoEmpresaId ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!');
    fecharModal();
    listarEmpresas();
  } catch (error) {
    toast.error('Erro ao salvar empresa e endereço.');
    console.error(error);
  }
});

(async () => {
  const isAdmin = await verificarAdmin();
  if (!isAdmin) {
    document.body.innerHTML = '';
    const acessoNegado = document.createElement('div');
    acessoNegado.id = 'acesso-negado';
    acessoNegado.textContent = 'Acesso negado. Você precisa ser administrador para acessar esta página.';
    document.body.appendChild(acessoNegado);
    return;
  }
  listarEmpresas();
})();

document.getElementById('btn-voltar').addEventListener('click', () => {
  window.location.href = '/html/inicio.html';
});