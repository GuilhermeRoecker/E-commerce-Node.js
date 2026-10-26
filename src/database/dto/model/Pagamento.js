class Pagamento {
    constructor(id, pedidoId, forma, status, dataPagamento){
        this.id = id;
        this.pedidoId = pedidoId;
        this.forma = forma;
        this.status = status;
        this.dataPagamento = dataPagamento;
    }
}

module.exports = Pagamento;