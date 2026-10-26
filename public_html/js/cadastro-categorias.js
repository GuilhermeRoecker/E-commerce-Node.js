document.addEventListener('DOMContentLoaded', () => {
  const toast = new ToastNotification({ position: 'bottom-right', duration: 5000 });

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

  // Elementos do modal
  const btnNovaCategoria = document.getElementById('btn-nova-categoria');
  const modal = document.getElementById('modal-categoria');
  const btnFecharModal = document.getElementById('btn-fechar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const formCategoria = document.getElementById('form-categoria');
  const modalTitle = document.getElementById('modal-categoria-title');
  const content = document.getElementById('content');

  let editandoCategoriaId = null;

  // Abrir modal nova categoria
  btnNovaCategoria.addEventListener('click', () => {
    editandoCategoriaId = null;
    modalTitle.textContent = 'Nova Categoria';
    formCategoria.reset();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });

  function fecharModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  btnFecharModal.addEventListener('click', fecharModal);
  btnCancelar.addEventListener('click', fecharModal);

  // Listar categorias
  async function carregarCategorias() {
    try {
      const res = await fetch('/categorias-produto', { credentials: 'include' }); // Note sem /api
      if (!res.ok) throw new Error('Erro ao buscar categorias');
      const categorias = await res.json();

      content.innerHTML = '';
      if (categorias.length === 0) {
        content.innerHTML = '<p>Nenhuma categoria cadastrada.</p>';
        return;
      }

      categorias.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'categoria-card';
        div.innerHTML = `
          <h3>${cat.nome}</h3>
          <p>${cat.descricao || ''}</p>
          <div class="card-buttons">
            <button class="btn btn-edit">Editar</button>
            <button class="btn btn-delete">Excluir</button>
          </div>
        `;

        // Editar
        div.querySelector('.btn-edit').addEventListener('click', () => abrirModalEditar(cat.id));

        // Excluir
        div.querySelector('.btn-delete').addEventListener('click', () => confirmarRemocao(cat.nome, () => removerCategoria(cat.id)));

        content.appendChild(div);
      });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar categorias');
    }
  }

  // Abrir modal para editar categoria
  async function abrirModalEditar(id) {
    try {
      const res = await fetch(`/categorias-produto/${id}`, { credentials: 'include' }); // Note sem /api
      if (!res.ok) throw new Error('Categoria não encontrada');
      const categoria = await res.json();

      editandoCategoriaId = id;
      modalTitle.textContent = 'Editar Categoria';

      formCategoria.nomeCategoria.value = categoria.nome || '';
      formCategoria.descricaoCategoria.value = categoria.descricao || '';

      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar categoria para edição');
    }
  }

  // Confirmar remoção com toast customizado
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
      <div>Confirma a exclusão da categoria "<strong>${nome}</strong>"? Essa ação não pode ser desfeita.</div>
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

  // Remover categoria
  async function removerCategoria(id) {
    try {
      const res = await fetch(`/categorias-produto/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Erro ao excluir categoria');
      toast.success('Categoria excluída com sucesso!');
      carregarCategorias();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao remover categoria');
    }
  }

  // Envio do formulário (novo / editar)
  formCategoria.addEventListener('submit', async e => {
    e.preventDefault();

    const nome = formCategoria.nomeCategoria.value.trim();
    const descricao = formCategoria.descricaoCategoria.value.trim();

    if (!nome) {
      toast.warning('O nome da categoria é obrigatório.');
      return;
    }

    try {
      let res;
      if (editandoCategoriaId) {
        // Atualizar
        res = await fetch(`/categorias-produto/${editandoCategoriaId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ nome, descricao }),
        });
      } else {
        // Criar
        res = await fetch('/categorias-produto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ nome, descricao }),
        });
      }

      if (!res.ok) throw new Error('Erro ao salvar categoria');

      toast.success(editandoCategoriaId ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!');
      fecharModal();
      carregarCategorias();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar categoria');
    }
  });

  // Inicialização
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
    carregarCategorias();
  })();

  const btnVoltar = document.getElementById('btn-voltar');
btnVoltar.addEventListener('click', () => {
  window.location.href = '/html/inicio.html';
});
});
