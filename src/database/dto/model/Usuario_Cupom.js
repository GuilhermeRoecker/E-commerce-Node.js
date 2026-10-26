class Usuario_Cupom {
  constructor(
    id,
    cupom_id,
    pessoa_id,
    usado,
    data_uso
  ) {
    this.id = id;
    this.cupom_id = cupom_id;
    this.pessoa_id = pessoa_id;
    this.usado = usado;
    this.data_uso = data_uso;
  }
}

module.exports = Usuario_Cupom;