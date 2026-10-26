async function carregarEnderecos() {
  const usuario = await getUsuarioLogado();
  const selectEndereco = document.getElementById('enderecos-entrega');
  const divSemEnd = document.getElementById('sem-enderecos');
  const btnCadastrar = document.getElementById('btn-cadastrar-endereco');

  if (!usuario) return;

  const res = await fetch(`/endereco?pessoaId=${usuario.id}`, { credentials: 'include' });
  if (!res.ok) {
    selectEndereco.innerHTML = '<option>Erro ao buscar endereços</option>';
    return;
  }

  const enderecos = await res.json();

  if (enderecos.length === 0) {
    selectEndereco.style.display = 'none';
    divSemEnd.style.display = 'block';
    btnCadastrar.addEventListener('click', () => {
      window.location.href = '/html/perfil.html'; // ou outro modal/form direto
    });
    return;
  }

  divSemEnd.style.display = 'none';
  selectEndereco.innerHTML = '';

  enderecos.forEach((end) => {
    const option = document.createElement('option');
    option.value = end.id;
    option.textContent = `${end.rua}, ${end.numero} - ${end.cidade} (${end.estado})`;
    selectEndereco.appendChild(option);
  });
  
}

  document.getElementById('btn-voltar')?.addEventListener('click', () => {
    window.location.href = '/html/inicio.html';
  });