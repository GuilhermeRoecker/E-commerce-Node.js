async function verificarAcesso({ cargosPermitidos = [], checarEmpresa = false, empresaIdEsperado = null } = {}) {
  let usuario;

  try {
    const res = await fetch('/auth/me', {
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Usuário não autenticado');
    }

    usuario = await res.json();
  } catch (e) {
    alert('Você precisa estar logado');
    window.location.href = '/html/login.html';
    return false;
  }

  if (cargosPermitidos.length > 0 && !cargosPermitidos.includes(usuario.cargo)) {
    alert('Você não possui permissão para acessar esta página');
    window.location.href = '/html/inicio.html';
    return false;
  }

  if (checarEmpresa && empresaIdEsperado !== null) {
    const empresaUsuario = usuario.cargo === 'admin' ? 1 : usuario.empresaId;
    if (parseInt(empresaUsuario) !== parseInt(empresaIdEsperado)) {
      alert('Empresa inválida para este acesso');
      window.location.href = 'html/inicio.html';
      return false;
    }
  }

  return true;
}



// USO
/*

<script src="/js/functions/verificaAcesso.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jwt-decode@3.1.2/build/jwt-decode.min.js"></script>
<script>
  verificarAcesso({ cargosPermitidos: ['admin', 'dono-loja'] });
</script>

Validar empresa

verificarAcesso({
  cargosPermitidos: ['admin', 'dono-loja'],
  checarEmpresa: true,
  empresaIdEsperado: 5
});


*/