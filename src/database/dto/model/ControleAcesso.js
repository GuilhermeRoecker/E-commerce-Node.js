class ControleAcesso{
    constructor(pessoaId, dataCriacaoConta, ultimoLogin, statusConta){
        this.pessoaId = pessoaId;
        this.dataCriacaoConta = dataCriacaoConta;
        this.ultimoLogin = ultimoLogin;
        this.statusConta = statusConta;
    }
}

module.exports = ControleAcesso;