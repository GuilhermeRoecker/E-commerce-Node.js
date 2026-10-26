class Entrega {
  constructor(
    id,
    pedidoId,
    enderecoEntregaId,
    transportadora,
    codigoRastreamento,
    status,
    dataEnvio,
    dataEntrega
  ) {
    this.id = id;
    this.pedidoId = pedidoId;
    this.enderecoEntregaId = enderecoEntregaId;
    this.transportadora = transportadora;
    this.codigoRastreamento = codigoRastreamento;
    this.status = status;
    this.dataEnvio = dataEnvio;
    this.dataEntrega = dataEntrega;
  }
}

module.exports = Entrega;
