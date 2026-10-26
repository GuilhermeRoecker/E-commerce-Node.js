// ==============================
// IMAGENS DE PRODUTOS
// ==============================
async function listarImagens(produtoId) {
  try {
    const res = await fetch(`/produto-imagens/${produtoId}`);
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function criarImagemProduto(imagem) {
  try {
    const res = await fetch('/produto-imagens', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(imagem)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function atualizarImagemProduto(id, dados) {
  try {
    const res = await fetch(`/produto-imagens/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(dados)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function excluirImagemProduto(id) {
  try {
    const res = await fetch(`/produto-imagens/${id}`, { method: 'DELETE' });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
