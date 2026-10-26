const toast = new ToastNotification({ position: 'bottom-right', duration: 5000 });

document.getElementById('btn-concluir')?.addEventListener('click', async () => {
  const usuario = await getUsuarioLogado();

  const params = new URLSearchParams(window.location.search);
  const produtoId = params.get('produtoId');
  let carrinhoId = params.get('carrinhoId');

  const enderecoId = document.getElementById('enderecos-entrega')?.value;
  const formaPagamento = document.getElementById('forma-pagamento')?.value;

  if (!enderecoId || !formaPagamento) {
    toast.error('Preencha todos os campos obrigatórios');
    return;
  }

  // Garantir que carrinhoId seja inteiro (se existir)
  if (carrinhoId) {
    carrinhoId = parseInt(carrinhoId);
  }

  // Caso venha apenas com produtoId, criar um carrinho temporário
  if (produtoId && !carrinhoId) {
    const novoCarrinho = await criarCarrinho({
      pessoaId: usuario.id,
      dataCriacao: new Date().toISOString()
    });

    if (!novoCarrinho || !novoCarrinho.id) {
      toast.error('Erro ao criar carrinho temporário');
      return;
    }

    const produtoRes = await fetch(`/produtos/${produtoId}`);
    const produto = await produtoRes.json();

    const itemCriado = await criarItemCarrinho({
      carrinhoId: novoCarrinho.id,
      produtoId: produtoId,
      quantidade: 1
    });

    if (!itemCriado) {
      toast.error('Erro ao adicionar item ao carrinho temporário');
      return;
    }

    carrinhoId = novoCarrinho.id;
  }

  if (!carrinhoId) {
    toast.error('Nenhum produto ou carrinho válido informado');
    return;
  }

  const body = {
    pessoaId: usuario.id,
    enderecoId,
    pagamento: formaPagamento,
    carrinhoId
  };

  console.log('Enviando corpo para finalizar-compra:', body);

  const res = await fetch('/finalizar-compra', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body)
  });

  const data = await res.json();

if (res.ok) {
  toast.success('Compra finalizada!');
  setTimeout(() => {
    window.location.href = '/html/inicio.html';
  }, 2000);
  } else {
    toast.error(data.erro || 'Erro ao finalizar compra');
  }
});
