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