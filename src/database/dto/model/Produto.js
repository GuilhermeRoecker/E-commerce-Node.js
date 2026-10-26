class Produto {
  constructor(
    id,
    nome,
    descricao,
    preco,
    estoque,
    empresaId,
    categoriaId,
    ativo
  ) {
    this.id = id;
    this.nome = nome;
    this.descricao = descricao;
    this.preco = preco;
    this.estoque = estoque;
    this.empresaId = empresaId;
    this.categoriaId = categoriaId;
    this.ativo = ativo;
  }
}

module.exports = Produto;
