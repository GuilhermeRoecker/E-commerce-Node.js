class Endereco{
    constructor(id, pessoaId, rua, numero, complemento, cidade, estado, CEP, empresaID){
        this.id = id;
        this.pessoaId = pessoaId;
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.cidade = cidade;
        this.estado = estado;
        this.CEP = CEP;
        this.empresaID = empresaID;
    }
}

module.exports = Endereco;