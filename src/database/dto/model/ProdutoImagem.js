class ProdutoImagem {
  constructor(id, produtoId, url, legenda, ordem) {
    this.id = id;
    this.produtoId = produtoId;
    this.url = url;
    this.legenda = legenda;
    this.ordem = ordem;
  }
}

module.exports = ProdutoImagem;
