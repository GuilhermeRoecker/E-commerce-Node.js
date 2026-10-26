class CarrinhoItem{
    constructor(id, carrinhoId, produtoId, quantidade){
        this.id = id;
        this.carrinhoId = carrinhoId;
        this.produtoId = produtoId;
        this.quantidade = quantidade;
    }
}

module.exports = CarrinhoItem;