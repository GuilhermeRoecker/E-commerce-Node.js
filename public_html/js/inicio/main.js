// ==============================
// INICIALIZAÇÃO
// ==============================
async function initializeApp() {
  await ajustarInterface();
  const produtos = await buscarProdutos();
  renderizarProdutos(produtos);
}
document.addEventListener('DOMContentLoaded', initializeApp);
setInterval(ajustarInterface, 5 * 60 * 1000);