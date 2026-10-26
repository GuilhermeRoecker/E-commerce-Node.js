class Pessoa {
  constructor(
    id,
    nomeCompleto,
    dataNascimento,
    CPF,
    nomeUsuario,
    email,
    senhaHash,
    tipoPessoa,
    telefone,
    celular,
    cargo,
    empresaId
  ) {
    this.id = id;
    this.nomeCompleto = nomeCompleto;
    this.dataNascimento = dataNascimento;
    this.CPF = CPF;
    this.nomeUsuario = nomeUsuario;
    this.email = email;
    this.senhaHash = senhaHash;
    this.tipoPessoa = tipoPessoa;
    this.telefone = telefone;
    this.celular = celular;
    this.cargo = cargo;
    this.empresaId = empresaId;
  }
}

module.exports = Pessoa;
