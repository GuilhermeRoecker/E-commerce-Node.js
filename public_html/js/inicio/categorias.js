// ==============================
// CATEGORIAS DE PRODUTOS
// ==============================
async function listarCategorias() {
  try {
    const res = await fetch('/categorias-produto');
    return res.ok ? await res.json() : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function buscarCategoriaPorId(id) {
  try {
    const res = await fetch(`/categorias-produto/${id}`);
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function criarCategoria(categoria) {
  try {
    const res = await fetch('/categorias-produto', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(categoria)
    });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function atualizarCategoria(id, dados) {
  try {
    const res = await fetch(`/categorias-produto/${id}`, {
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

async function excluirCategoria(id) {
  try {
    const res = await fetch(`/categorias-produto/${id}`, { method: 'DELETE' });
    return res.ok ? await res.json() : null;
  } catch (err) {
    console.error(err);
    return null;
  }
}