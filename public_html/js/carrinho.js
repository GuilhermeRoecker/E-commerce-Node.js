const toast = new ToastNotification({
  position: 'bottom-right',
  duration: 5000
});

document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    document.getElementById('btn-voltar').addEventListener('click', () => {
        window.location.href = '/html/inicio.html';
    });
});

document.getElementById('btn-concluir').addEventListener('click', async () => {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
        toast.error('Você precisa estar logado para concluir a compra.');
        return;
    }

    const carrinhoRes = await fetch(`/carrinhos/pessoa/${usuario.id}`, { credentials: 'include' });
    if (!carrinhoRes.ok) {
        toast.error('Erro ao buscar carrinho.');
        return;
    }

    const carrinho = await carrinhoRes.json();

    const itensRes = await fetch(`/carrinho-items/${carrinho.id}`, { credentials: 'include' });
    const itens = await itensRes.json();

    if (itens.length === 0) {
        toast.warning('Seu carrinho está vazio.');
        return;
    }

    const confirmar = confirm('Deseja ir para a finalização da compra?');
    if (!confirmar) return;

    window.location.href = `/html/compra.html?carrinhoId=${carrinho.id}`;

    await fetch(`/carrinho-items/${carrinho.id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    carregarCarrinho();
});

// ==============================
// FUNÇÕES DE AUTENTICAÇÃO
// ==============================
async function getUsuarioLogado() {
  try {
    const res = await fetch('/auth/me', {
      credentials: 'include' // para enviar cookies
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

async function carregarCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';

    const usuario = await getUsuarioLogado();
    if (!usuario) {
        listaCarrinho.innerHTML = '<li>Você precisa estar logado para ver o carrinho.</li>';
        return;
    }

    const carrinhoRes = await fetch(`/carrinhos/pessoa/${usuario.id}`, {
        credentials: 'include'
    });

    if (!carrinhoRes.ok) {
        listaCarrinho.innerHTML = '<li>Erro ao buscar carrinho.</li>';
        return;
    }

    const carrinho = await carrinhoRes.json();

    const itensRes = await fetch(`/carrinho-items/${carrinho.id}`, {
        credentials: 'include'
    });

    if (!itensRes.ok) {
        listaCarrinho.innerHTML = '<li>Erro ao buscar itens do carrinho.</li>';
        return;
    }

    let itens = await itensRes.json();

    if (itens.length === 0) {
        listaCarrinho.innerHTML = '<li>O carrinho está vazio.</li>';
        return;
    }

    // Cria o elemento do total geral antes do loop para poder atualizar depois
    const totalElement = document.createElement('p');
    totalElement.style.marginTop = '1rem';
    totalElement.style.fontWeight = 'bold';

    // Variável total inicializada em 0
    let total = 0;

    // Função para atualizar o total geral mostrado
    function atualizarTotalGeral() {
        // Recalcula o total com base nos itens atuais
        total = 0;
        for (const item of itens) {
            total += item.precoUnitario * item.quantidade;
        }
        totalElement.textContent = `Total: R$${total.toFixed(2)}`;
    }

for (const item of itens) {
    const produtoRes = await fetch(`/produtos/${item.produtoId}`);
    if (!produtoRes.ok) continue;
    const produto = await produtoRes.json();

    let imagens = [];
    try {
      const imagensRes = await fetch(`/produto-imagens/${produto.id}`, { credentials: 'include' });
      if (imagensRes.ok) imagens = await imagensRes.json();
    } catch (e) {
      console.error('Erro ao buscar imagens do produto', e);
    }

     const imgUrl = imagens.length > 0 ? imagens[0].url || imagens[0].caminho_imagem : '/images/placeholder.png';

    const preco = Number(produto.preco);
    const precoTotal = preco * item.quantidade;

    item.precoUnitario = preco;

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '1rem';

    // --- Miniatura da imagem ---
    const imgMiniatura = document.createElement('img');
    imgMiniatura.src = imgUrl;
    imgMiniatura.alt = produto.nome;
    imgMiniatura.style.width = '50px';
    imgMiniatura.style.height = '50px';
    imgMiniatura.style.objectFit = 'cover';
    imgMiniatura.style.borderRadius = '4px';
    imgMiniatura.style.marginRight = '1rem'

    // Container que vai segurar imagem + info (nome + preço)
    const infoContainer = document.createElement('div');
    infoContainer.style.display = 'flex';
    infoContainer.style.alignItems = 'center';
    infoContainer.style.flex = '2'; // para ocupar espaço proporcional
    infoContainer.appendChild(imgMiniatura);

    const info = document.createElement('span');
    info.innerHTML = `<strong>${produto.nome}</strong><br>Preço: R$${preco.toFixed(2)} x `;
    infoContainer.appendChild(info);

    // Container dos controles de quantidade
    const qtdContainer = document.createElement('div');
    qtdContainer.style.display = 'flex';
    qtdContainer.style.alignItems = 'center';
    qtdContainer.style.gap = '0.5rem';
    qtdContainer.style.flex = '1';

    const btnMinus = document.createElement('button');
    btnMinus.textContent = '-';
    btnMinus.className = 'button-1 rounded';
    btnMinus.style.minWidth = '30px';
    btnMinus.style.height = '30px';

    const spanQtd = document.createElement('span');
    spanQtd.textContent = item.quantidade;
    spanQtd.style.minWidth = '20px';
    spanQtd.style.textAlign = 'center';

    const btnPlus = document.createElement('button');
    btnPlus.textContent = '+';
    btnPlus.className = 'button-1 rounded';
    btnPlus.style.minWidth = '30px';
    btnPlus.style.height = '30px';

    qtdContainer.appendChild(btnMinus);
    qtdContainer.appendChild(spanQtd);
    qtdContainer.appendChild(btnPlus);

    const totalItem = document.createElement('span');
    totalItem.textContent = `= R$${precoTotal.toFixed(2)}`;
    totalItem.style.flex = '1';
    totalItem.style.textAlign = 'right';
    totalItem.style.minWidth = '100px';

    const btnExcluir = document.createElement('button');
btnExcluir.textContent = 'Remover';
btnExcluir.className = 'button-1 rounded btn-remover';
// Remova marginLeft auto para evitar ocupar espaço extra
// btnExcluir.style.marginLeft = 'auto'; // Remover essa linha
btnExcluir.style.minWidth = '40px';
btnExcluir.style.height = '24px';
btnExcluir.style.padding = '2px 6px';
btnExcluir.style.fontSize = '0.75rem';
btnExcluir.style.flexShrink = '0'; // garante que o botão não estique nem encolha
btnExcluir.style.width = 'auto';   // só o tamanho do texto

    // Eventos de clique (mantém o que você já tinha)

    async function atualizarQuantidade(novaQtd) {
        if (novaQtd < 0) return;

        if (novaQtd === 0) {
            const res = await fetch(`/carrinho-items/${item.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                toast.success('Produto removido do carrinho.');
                li.remove();
                itens = itens.filter(i => i.id !== item.id);
                atualizarTotalGeral();
            } else {
                toast.error('Erro ao remover produto.');
            }
            return;
        }

        if (novaQtd > produto.estoque) {
            toast.error(`Estoque insuficiente. Máximo: ${produto.estoque}`);
            return;
        }

        const res = await fetch(`/carrinho-items/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ quantidade: novaQtd })
        });

        if (res.ok) {
            toast.success('Quantidade atualizada com sucesso!');
            spanQtd.textContent = novaQtd;
            totalItem.textContent = `= R$${(preco * novaQtd).toFixed(2)}`;

            const itemAtualizado = itens.find(i => i.id === item.id);
            if (itemAtualizado) {
                itemAtualizado.quantidade = novaQtd;
            }

            atualizarTotalGeral();
        } else {
            toast.error('Erro ao atualizar item.');
        }
    }

    btnMinus.addEventListener('click', async () => {
        let qtdAtual = Number(spanQtd.textContent);
        if (qtdAtual > 0) {
            await atualizarQuantidade(qtdAtual - 1);
        }
    });

    btnPlus.addEventListener('click', async () => {
        let qtdAtual = Number(spanQtd.textContent);
        await atualizarQuantidade(qtdAtual + 1);
    });

    btnExcluir.addEventListener('click', async () => {
        const res = await fetch(`/carrinho-items/${item.id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (res.ok) {
            toast.success('Produto removido do carrinho.');
            li.remove();
            itens = itens.filter(i => i.id !== item.id);
            atualizarTotalGeral();
        } else {
            toast.error('Erro ao remover produto.');
        }
    });

    li.appendChild(infoContainer);
    li.appendChild(qtdContainer);
    li.appendChild(totalItem);
    li.appendChild(btnExcluir);

    listaCarrinho.appendChild(li);
}


    atualizarTotalGeral();
    listaCarrinho.appendChild(totalElement);
}
