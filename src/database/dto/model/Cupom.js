class Cupom {
  constructor(
    id,
    codigo,
    descricao,
    tipo,
    desconto,
    percentual,
    data_expiracao,
    limite_uso,
    uso_total
  ) {
    this.id = id;
    this.codigo = codigo;
    this.descricao = descricao;
    this.tipo = tipo;
    this.desconto = desconto;
    this.percentual = percentual;
    this.data_expiracao = data_expiracao;
    this.limite_uso = limite_uso;
    this.uso_total = uso_total;
  }
}

module.exports = Cupom;