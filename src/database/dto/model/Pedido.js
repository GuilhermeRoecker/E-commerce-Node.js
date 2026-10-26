class Pedido{
    constructor(id, pessoaId, dataPedido, status, total){
        this.id = id;
        this.pessoaId = pessoaId;
        this.dataPedido = dataPedido;
        this.status = status;
        this.total = total;
    }
}

module.exports = Pedido;