// ==============================
// FUNÇÕES DE AUTENTICAÇÃO
// ==============================
async function getUsuarioLogado() {
  try {
    const res = await fetch('/auth/me', {
      credentials: 'include'
    });
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

const toast = new ToastNotification({ position: 'bottom-right', duration: 5000 });

const modal = document.getElementById('modalNovoVendedor');
const btnNovo = document.getElementById('btn-novo-vendedor');
const empresaSelect = document.getElementById('empresa');
const selectCargo = document.getElementById('cargo');


btnNovo.addEventListener('click', async () => {
  setTimeout(() => modal.classList.add('active'), 0);

  const usuarioLogado = await getUsuarioLogado();
  if (!usuarioLogado) {
    toast.error('Usuário não autenticado.');
    fecharModal();
    return;
  }

  // Monta cargos permitidos
  const cargos = ['vendedor', 'dono-loja', 'admin'];
  if (usuarioLogado.cargo !== 'admin') {
    cargos.splice(cargos.indexOf('admin'), 1);
  }
  selectCargo.innerHTML = cargos.map(c => `<option value="${c}">${c}</option>`).join('');

  // Carregar empresas
  await carregarEmpresasParaSelect(usuarioLogado);
});

function fecharModal() {
  modal.classList.remove('active');
  document.getElementById('form-vendedor').reset();
  delete document.getElementById('form-vendedor').dataset.editId;
}

// ==============================
// CARREGAR USUÁRIOS
// ==============================
async function carregarUsuarios() {
  try {
    const res = await fetch('/pessoas/usuarios', { credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao carregar usuários');
    const agrupados = await res.json();

    const content = document.getElementById('content');
    content.innerHTML = '';

    for (const [empresa, usuarios] of Object.entries(agrupados)) {
      const containerEmpresa = document.createElement('div');
      containerEmpresa.classList.add('empresa-container');

      const titulo = document.createElement('h3');
      titulo.textContent = empresa;
      containerEmpresa.appendChild(titulo);

      const tabela = document.createElement('table');
      tabela.innerHTML = `
        <thead>
          <tr>
            <th>Nome Completo</th>
            <th>Usuário</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;

      const tbody = tabela.querySelector('tbody');
      usuarios.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${u.nomeCompleto}</td>
          <td>${u.nomeUsuario || u.nomeDeUsuario || ''}</td>
          <td>${u.email}</td>
          <td>${u.cargo}</td>
          <td>
            <button data-id="${u.id}" class="btn-editar">Editar</button>
            <button data-id="${u.id}" class="btn-deletar">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      containerEmpresa.appendChild(tabela);
      content.appendChild(containerEmpresa);
    }

    document.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', e => abrirModalEdicao(e.target.dataset.id));
    });

    document.querySelectorAll('.btn-deletar').forEach(btn => {
      btn.addEventListener('click', async e => {
        const id = e.target.dataset.id;
        const nome = e.target.closest('tr').querySelector('td').textContent;
        confirmarRemocao(nome, async () => {
          await deletarVendedor(id);
          await carregarUsuarios();
        });
      });
    });

  } catch (err) {
    toast.error(err.message || 'Erro ao carregar usuários');
  }
}

// ==============================
// MODAL DE EDIÇÃO
// ==============================
async function abrirModalEdicao(id) {
  const usuarioLogado = await getUsuarioLogado();
  if (!usuarioLogado) {
    toast.error('Usuário não autenticado.');
    return;
  }

  await carregarEmpresasParaSelect(usuarioLogado);
  try {
    const res = await fetch(`/pessoas/${id}`, { credentials: 'include' });
    if (!res.ok) throw new Error('Erro ao carregar vendedor');
    const vendedor = await res.json();

    const form = document.getElementById('form-vendedor');

    form.nomeCompleto.value = vendedor.nomeCompleto || '';
    form.nomeUsuario.value = vendedor.nomeUsuario || vendedor.nomeDeUsuario || '';
    form.email.value = vendedor.email || '';
    form.CPF.value = vendedor.CPF || vendedor.CPF_CNPJ || '';
    form.dataNascimento.value = vendedor.dataNascimento?.split('T')[0] || '';
    form.telefone.value = vendedor.telefone || '';
    form.senhaHash.value = '';
    form.cargo.value = vendedor.cargo || 'vendedor';
    form.empresaId.value = vendedor.empresaId || '';
    form.celular.value = vendedor.celular || '';

    form.dataset.editId = id;
    modal.classList.add('active');
  } catch (err) {
    toast.error(err.message || 'Erro ao carregar dados do vendedor');
  }
}

async function carregarEmpresasParaSelect(usuarioLogado) {
  empresaSelect.innerHTML = '<option disabled selected>Carregando...</option>';
  try {
    let empresas = [];
    if (usuarioLogado.cargo === 'admin') {
      const res = await fetch('/empresa', { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao carregar empresas');
      empresas = await res.json();
    } else {
      empresas = [{
        id: usuarioLogado.empresaId,
        nomeFantasia: 'Minha Empresa'
      }];
    }
    empresaSelect.innerHTML = empresas.map(emp => `<option value="${emp.id}">${emp.nomeFantasia}</option>`).join('');
  } catch (err) {
    empresaSelect.innerHTML = '<option disabled>Erro ao carregar</option>';
  }
}

// ==============================
// SUBMISSÃO DO FORMULÁRIO
// ==============================
document.getElementById('form-vendedor').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  const dados = {
    nomeCompleto: form.nomeCompleto.value,
    dataNascimento: form.dataNascimento.value,
    CPF_CNPJ: form.CPF.value,
    nomeUsuario: form.nomeUsuario.value,
    email: form.email.value,
    senhaHash: form.senhaHash.value,
    tipoPessoa: 'fisica',
    telefone: form.telefone.value,
    celular: form.celular?.value || '',
    cargo: form.cargo.value,
    empresaId: parseInt(form.empresaId.value)
  };

  try {
    const id = form.dataset.editId;
    if (id) {
      if (!dados.senhaHash) delete dados.senhaHash;
      await editarVendedor(dados, id);
    } else {
      const res = await fetch('/pessoas', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao cadastrar.');
      }

      toast.success('Vendedor cadastrado com sucesso!');
      fecharModal();
      carregarUsuarios();
    }
  } catch (err) {
    toast.error(err.message);
  }
});

async function editarVendedor(dados, id) {
  try {
    const res = await fetch(`/pessoas/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao atualizar vendedor');
    }

    toast.success('Vendedor atualizado com sucesso!');
    fecharModal();
    carregarUsuarios();
  } catch (err) {
    toast.error(err.message);
  }
}

async function deletarVendedor(id) {
  try {
    const res = await fetch(`/pessoas/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao deletar vendedor');
    }
    toast.success('Vendedor excluído com sucesso!');
  } catch (err) {
    toast.error(err.message);
  }
}

// ==============================
// CONFIRMAÇÃO DE REMOÇÃO
// ==============================
function confirmarRemocao(nome, onConfirm) {
  const container = document.createElement('div');
  container.className = 'toast-confirm';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.background = 'var(--bg-color-1)';
  container.style.color = 'var(--fg-color-1)';
  container.style.padding = '1rem';
  container.style.borderRadius = '8px';
  container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  container.style.zIndex = 10000;

  container.innerHTML = `
    <div>Confirma a exclusão do vendedor "<strong>${nome}</strong>"? Essa ação não pode ser desfeita.</div>
    <div style="margin-top:0.5rem; display:flex; gap:0.5rem; justify-content:flex-end;">
      <button id="btn-sim" class="btn btn-secondary">Sim</button>
      <button id="btn-nao" class="btn btn-outline">Não</button>
    </div>
  `;

  document.body.appendChild(container);

  container.querySelector('#btn-sim').onclick = () => {
    onConfirm();
    document.body.removeChild(container);
  };
  container.querySelector('#btn-nao').onclick = () => {
    document.body.removeChild(container);
  };
}

window.addEventListener('DOMContentLoaded', carregarUsuarios);

// Fecha o modal ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
  if (!modal.classList.contains('active')) return;

  const modalContent = modal.querySelector('.modal-content');
  if (modalContent && !modalContent.contains(e.target)) {
    fecharModal();
  }
});
