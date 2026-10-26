class SegurancaConta {
  constructor(
    pessoaId,
    emailVerificado,
    tokenVerificacaoEmail,
    tentativasDeLoginFalhas,
    bloqueadoAte
  ) {
    this.pessoaId = pessoaId;
    this.emailVerificado = emailVerificado;
    this.tokenVerificacaoEmail = tokenVerificacaoEmail;
    this.tentativasDeLoginFalhas = tentativasDeLoginFalhas;
    this.bloqueadoAte = bloqueadoAte;
  }
}

module.exports = SegurancaConta;
