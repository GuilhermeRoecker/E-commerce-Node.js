const toast = new ToastNotification({
  position: 'bottom-right',
  duration: 5000
});

// ==============================
// CARRINHO
// ==============================

async function buscarCarrinho(id) {
  try {
    const res = await fetch(`/carrinhos/${id}`, { credentials: 'include' });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function buscarCarrinhoPorPessoaId(pessoaId) {
  try {
    const res = await fetch(`/carrinhos/pessoa/${pessoaId}`, { credentials: 'include' });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function criarCarrinho(carrinho) {
  try {
    const res = await fetch('/carrinhos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(carrinho)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ==============================
// ITENS DO CARRINHO
// ==============================

async function listarItensCarrinho(carrinhoId) {
  try {
    const res = await fetch(`/carrinho-items/${carrinhoId}`, {
      credentials: 'include'
    });
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function criarItemCarrinho(item) {
  try {
    const res = await fetch('/carrinho-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(item)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function atualizarItemCarrinho(id, dados) {
  try {
    const res = await fetch(`/carrinho-items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(dados)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ==============================
// ADICIONAR AO CARRINHO
// ==============================

// Variável para evitar chamadas duplicadas enquanto a requisição está em andamento
let adicionandoAoCarrinho = false;

async function adicionarAoCarrinho(produtoId) {
  if (adicionandoAoCarrinho) {
    toast.info('Adição ao carrinho em progresso. Aguarde...');
    return;
  }
  adicionandoAoCarrinho = true;

  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      toast.error('Você precisa estar logado para adicionar ao carrinho');
      return;
    }

    // Busca carrinho do usuário, cria se não existir
    let carrinho = await buscarCarrinhoPorPessoaId(usuario.id);
    if (!carrinho) {
      carrinho = await criarCarrinho({ pessoaId: usuario.id, dataCriacao: new Date().toISOString() });
    }

    if (!carrinho || !carrinho.id) {
      toast.error('Erro ao criar ou buscar carrinho');
      return;
    }

    // Buscar dados do produto para verificar estoque
    const produtoRes = await fetch(`/produtos/${produtoId}`, { credentials: 'include' });
    if (!produtoRes.ok) {
      toast.error('Erro ao buscar informações do produto.');
      return;
    }
    const produto = await produtoRes.json();

    // Listar itens atuais do carrinho
    const itens = await listarItensCarrinho(carrinho.id);
    const itemExistente = itens.find(item => item.produtoId === produtoId);

    const qtdAtual = itemExistente ? itemExistente.quantidade : 0;
    const novaQtd = qtdAtual + 1;

    if (novaQtd > produto.estoque) {
      toast.error(`Estoque insuficiente. Máximo disponível: ${produto.estoque}`);
      return;
    }

    if (itemExistente) {
      const atualizado = await atualizarItemCarrinho(itemExistente.id, { quantidade: novaQtd });
      if (atualizado) {
        toast.success('Quantidade do produto atualizada no carrinho!');
      } else {
        toast.error('Erro ao atualizar quantidade do produto.');
      }
    } else {
      const criado = await criarItemCarrinho({
        carrinhoId: carrinho.id,
        produtoId: produtoId,
        quantidade: 1
      });
      if (criado) {
        toast.success('Produto adicionado ao carrinho com sucesso!');
      } else {
        toast.error('Erro ao adicionar produto ao carrinho.');
      }
    }
  } catch (err) {
    console.error(err);
    toast.error('Erro inesperado ao adicionar ao carrinho.');
  } finally {
    adicionandoAoCarrinho = false;
  }
}
