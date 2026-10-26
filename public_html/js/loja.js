async function inicializa() {
    const produtos = await buscarProdutos();
    renderizarProdutos(produtos);
}

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

     document.addEventListener('DOMContentLoaded', async () => {
      const toast = new ToastNotification({ position: 'bottom-right', duration: 5000 });

      const modal = document.querySelector('.modal-overlay');
      const btnNova = document.getElementById('btn-novo-produto');
      const btnFechar = document.getElementById('btn-fechar-modal');
      const btnCancelar = document.getElementById('cancelBtn');
      const formNome = document.getElementById('nome');
      const formDescricao = document.getElementById('descricao');
      const formPreco = document.getElementById('preco');
      const formEstoque = document.getElementById('estoque');
      const formCategoria = document.getElementById('categoria-select');
      const formImagens = document.getElementById('images-input');
      const formConfirma = document.getElementById('addBtn');
      const content = document.getElementById('content');
      let editandoProdutoId = null;

      async function getUsuarioLogado() {
        const res = await fetch('/auth/me', { credentials: 'include' });
        return res.ok ? res.json() : null;
      }

      async function buscarProdutos() {
        const user = await getUsuarioLogado();
        const res = await fetch('/produtos', { credentials: 'include' });
        const produtos = await res.json();
        return produtos.filter(p => p.empresaId == user.empresaId);
      }

      async function carregarCategorias() {
        const res = await fetch('/categorias-produto', { credentials: 'include' });
        const categorias = await res.json();
        formCategoria.innerHTML = '<option disabled selected>Selecione</option>';
        categorias.forEach(c => {
          formCategoria.innerHTML += `<option value="${c.id}">${c.nome}</option>`;
        });
      }

async function renderizarProdutos(produtos) {
  const lista = await Promise.all(produtos.map(async (p) => {
    const res = await fetch(`/produto-imagens/${p.id}`, { credentials: 'include' });
    const imagens = await res.json();
    const img = imagens.length > 0 ? imagens[0].url : '../img/no-image.png';

    return `
      <div class="produto-card">
        <img src="${img}" alt="Imagem do produto ${p.nome}" />
        <div class="produto-texto">
          <h3>${p.nome}</h3>
          <p>${p.descricao}</p>
          <p>R$ ${Number(p.preco).toFixed(2)}</p>
          <p>Estoque: ${p.estoque}</p>
        </div>
        <div class="card-buttons">
          <button class="btn-carrinho" onclick="editarProduto(${p.id})">Editar</button>
          <button class="btn-comprar" onclick="removerProduto(${p.id}, '${p.nome}')">Excluir</button>
        </div>
      </div>
    `;
  }));

  content.innerHTML = lista.join('');
}


      async function inicializa() {
        await carregarCategorias();
        const produtos = await buscarProdutos();
        renderizarProdutos(produtos);
      }

      btnNova.onclick = () => {
        editandoProdutoId = null;
        formNome.value = '';
        formDescricao.value = '';
        formPreco.value = '';
        formEstoque.value = '';
        formCategoria.value = '';
        formImagens.value = '';
        modal.classList.add('active');
      };

      btnFechar.onclick = fecharModal;
      btnCancelar.onclick = fecharModal;
      function fecharModal() { modal.classList.remove('active'); }

      window.editarProduto = async (id) => {
        const res = await fetch(`/produtos/${id}`, { credentials: 'include' });
        const prod = await res.json();
        editandoProdutoId = id;
        formNome.value = prod.nome;
        formDescricao.value = prod.descricao;
        formPreco.value = prod.preco;
        formEstoque.value = prod.estoque;
        formCategoria.value = prod.categoriaId;
        modal.classList.add('active');
      };

      window.removerProduto = (id, nome) => {
        if (confirm(`Excluir o produto "${nome}"?`)) {
          fetch(`/produtos/${id}`, {
            method: 'DELETE', credentials: 'include'
          }).then(() => inicializa());
        }
      };

      formConfirma.onclick = async () => {
        const user = await getUsuarioLogado();
        const produto = {
          nome: formNome.value,
          descricao: formDescricao.value,
          preco: parseFloat(formPreco.value),
          estoque: parseInt(formEstoque.value),
          empresaId: user?.empresaId,
          categoriaId: parseInt(formCategoria.value),
          ativo: true
        };

        if (!produto.nome || !produto.descricao || !produto.categoriaId) {
          return toast.warning('Preencha os campos obrigatórios.');
        }

        const metodo = editandoProdutoId ? 'PATCH' : 'POST';
        const url = editandoProdutoId ? `/produtos/${editandoProdutoId}` : '/produtos';

        const res = await fetch(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(produto)
        });

        const novo = await res.json();
        const idProduto = editandoProdutoId || novo.id;

        if (!editandoProdutoId) {
          const imagens = formImagens.files;
          if (imagens.length > 5) return toast.warning('Limite de 5 imagens.');

          const formData = new FormData();
          formData.append('produtoId', idProduto);
          [...imagens].forEach(img => formData.append('images', img));

          await fetch('/produto-imagens', {
            method: 'POST', credentials: 'include', body: formData
          });
        }

        toast.success('Produto salvo com sucesso!');
        fecharModal();
        inicializa();
      };

      inicializa();
    });

    document.getElementById("btn-voltar").addEventListener("click", () => {
  window.location.href = "/html/inicio.html";
});