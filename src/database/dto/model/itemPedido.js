class itemPedido{
    constructor(id, pedidoId, produtoId, quantidade, precoUnitario){
        this.id = id;
        this.pedidoId = pedidoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
        this.precoUnitario = precoUnitario;
        }
}

module.exports = itemPedido;