document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const produtoId = params.get('produtoId');
  const carrinhoId = params.get('carrinhoId');

  if (produtoId) {
    await carregarProdutoUnico(produtoId);
  } else if (carrinhoId) {
    await carregarCarrinho(carrinhoId);
  }

  await carregarEnderecos();
});

async function carregarProdutoUnico(produtoId) {
  const listaCarrinho = document.getElementById('lista-carrinho');
  listaCarrinho.innerHTML = '';

  const produtoRes = await fetch(`/produtos/${produtoId}`);
  if (!produtoRes.ok) {
    listaCarrinho.innerHTML = '<li>Erro ao buscar produto.</li>';
    return;
  }

  const produto = await produtoRes.json();
  const imagens = await listarImagens(produto.id);
  const imgUrl = imagens.length > 0 ? imagens[0].url || imagens[0].caminho_imagem : '/images/placeholder.png';

  const preco = Number(produto.preco);
  const li = document.createElement('li');
  li.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <img src="${imgUrl}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover;" />
      <div>
        <strong>${produto.nome}</strong><br>
        Preço: R$ ${preco.toFixed(2)}<br>
        Quantidade: 1
      </div>
    </div>
  `;

  document.querySelector('#vlr').textContent = `R$ ${preco.toFixed(2)}`;
  listaCarrinho.appendChild(li);
}

async function carregarCarrinho(carrinhoId) {
  const listaCarrinho = document.getElementById('lista-carrinho');
  listaCarrinho.innerHTML = '';
  let total = 0;

  const itensRes = await fetch(`/carrinho-items/${carrinhoId}`, { credentials: 'include' });
  if (!itensRes.ok) {
    listaCarrinho.innerHTML = '<li>Erro ao buscar itens do carrinho.</li>';
    return;
  }

  const itens = await itensRes.json();

  for (const item of itens) {
  const produtoRes = await fetch(`/produtos/${item.produtoId}`);
  if (!produtoRes.ok) continue;

  const produto = await produtoRes.json();
  const imagens = await listarImagens(produto.id);
  const imgUrl = imagens.length > 0 ? imagens[0].url || imagens[0].caminho_imagem : '/images/placeholder.png';

  const precoUnitario = Number(produto.preco);
  const precoTotalItem = precoUnitario * item.quantidade;
  total += precoTotalItem;

  const li = document.createElement('li');
  li.innerHTML = `
    <div style="display: flex; gap: 1rem; align-items: center;">
      <img src="${imgUrl}" alt="${produto.nome}" style="width: 50px; height: 50px; object-fit: cover;" />
      <div>
        <strong>${produto.nome}</strong><br>
        Preço unitário: R$ ${precoUnitario.toFixed(2)}<br>
        Quantidade: ${item.quantidade}<br>
        Total: R$ ${precoTotalItem.toFixed(2)}
      </div>
    </div>
  `;

  listaCarrinho.appendChild(li);
}

  document.querySelector('#vlr').textContent = `R$ ${total.toFixed(2)}`;
}
