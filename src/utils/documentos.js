function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let t = cnpj.length - 2;
  let d = cnpj.substring(t);
  let d1 = parseInt(d.charAt(0));
  let d2 = parseInt(d.charAt(1));
  let calc = x => {
    let n = 0;
    for (let i = 0, j = x === 12 ? 5 : 6; i < x; i++, j--) {
      n += parseInt(cnpj.charAt(i)) * j;
      if (j === 2) j = 9;
    }
    let r = n % 11;
    return r < 2 ? 0 : 11 - r;
  };

  return calc(12) === d1 && calc(13) === d2;
}

module.exports = { validarCPF, validarCNPJ };
