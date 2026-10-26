// ==============================
// PRODUTOS
// ==============================
async function buscarProdutos() {
  try {
    const res = await fetch('/produtos');
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function buscarProdutoPorId(id) {
  try {
    const res = await fetch(`/produtos/${id}`);
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function criarProduto(produto) {
  try {
    const res = await fetch('/produtos', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(produto)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function atualizarProduto(id, produto) {
  try {
    const res = await fetch(`/produtos/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(produto)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function listarImagens(produtoId) {
  try {
    const res = await fetch(`/produto-imagens/${produtoId}`, { credentials: 'include' });
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error('Erro ao listar imagens:', err);
    return [];
  }
}

async function renderizarProdutos(produtos) {
  const container = document.getElementById('content');
  container.innerHTML = '';

  if (produtos.length === 0) {
    container.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  for (const produto of produtos) {
    const imagens = await listarImagens(produto.id);
    const imagemPrincipal = imagens.length > 0 
      ? imagens[0].url
      : '/img/placeholder.png';

    const precoFormatado = produto.preco?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }) || 'R$ --';

    const estoque = produto.estoque ?? 'Indisponível';

    const card = document.createElement('div');
    card.classList.add('produto-card');

    card.innerHTML = `
      <img src="${imagemPrincipal}" alt="${produto.nome}" />
      <div class="produto-texto">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <p><strong>Preço:</strong> ${precoFormatado}</p>
        <p><strong>Estoque:</strong> ${estoque}</p>
      </div>
      <div class="card-buttons">
        <button class="btn-comprar" onclick="comprarProduto(${produto.id})">Comprar</button>
        <button class="btn-carrinho" onclick="adicionarAoCarrinho(${produto.id})">+ Carrinho</button>
      </div>
    `;

    container.appendChild(card);
  }
}


// Redireciona para a página de compra com o ID do produto
async function comprarProduto(produtoId) {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      toast.error('Você precisa estar logado para comprar produtos');
      return;
    }

    // Usuário está logado, redireciona
    window.location.href = `/html/compra.html?produtoId=${produtoId}`;
  } catch (error) {
    console.error('Erro ao verificar usuário logado:', error);
    toast.error('Erro ao verificar login. Tente novamente.');
  }
}

async function excluirProduto(id) {
  try {
    const res = await fetch(`/produtos/${id}`, { method: 'DELETE' });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

