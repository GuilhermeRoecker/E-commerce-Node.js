const bcrypt = require('bcrypt');
const validator = require('validator');
const { validarCPF, validarCNPJ } = require('../utils/documentos');
const db = require('../database/db');

// GET pessoa por ID
async function getPessoa(req, res) {
  const { id } = req.params;
  const [rows] = await db.query('SELECT * FROM pessoa WHERE id = ?', [id]);

  if (rows.length === 0) return res.status(404).json({ error: 'Pessoa não encontrada' });
  res.json(rows[0]);
}

// LISTALL
async function listAllPessoas(req, res) {
  const [rows] = await db.query('SELECT * FROM pessoa');
  res.json(rows);
}

// POST
async function createPessoa(req, res) {
  const {
    nomeCompleto,
    dataNascimento,
    CPF_CNPJ,
    nomeUsuario,
    email,
    senhaHash,
    tipoPessoa,
    telefone,
    celular,
    cargo,
    empresaId
  } = req.body;

  if (!nomeCompleto || !CPF_CNPJ || !nomeUsuario || !email || !senhaHash || !tipoPessoa) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  // Valida idade
  if (dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    const dia = hoje.getDate() - nascimento.getDate();
    const idadeFinal = mes < 0 || (mes === 0 && dia < 0) ? idade - 1 : idade;

    if (idadeFinal < 16) {
      return res.status(400).json({ error: 'É necessário ter pelo menos 16 anos para se cadastrar.' });
    }
    if (idadeFinal > 100) {
      return res.status(400).json({ error: 'Idade acima do limite permitido (100 anos).' });
    }
  }

  // Valida CPF ou CNPJ
  if (tipoPessoa === 'fisica' && !validarCPF(CPF_CNPJ)) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }
  if (tipoPessoa === 'juridica' && !validarCNPJ(CPF_CNPJ)) {
    return res.status(400).json({ error: 'CNPJ inválido.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  try {
    const [[cpfExiste]] = await db.query(
      `SELECT id FROM pessoa WHERE CPF_CNPJ = ?`,
      [CPF_CNPJ]
    );
    if (cpfExiste) return res.status(400).json({ error: 'CPF/CNPJ já cadastrado.' });

    const [[usuarioExiste]] = await db.query(
      `SELECT id FROM pessoa WHERE nomeDeUsuario = ?`,
      [nomeUsuario]
    );
    if (usuarioExiste) return res.status(400).json({ error: 'Nome de usuário já em uso.' });

    const [[emailExiste]] = await db.query(
      `SELECT id FROM pessoa WHERE email = ?`,
      [email]
    );
    if (emailExiste) return res.status(400).json({ error: 'Email já cadastrado.' });

    const senhaHasheada = await bcrypt.hash(senhaHash, 10);

    const [result] = await db.query(
      `INSERT INTO pessoa 
      (nomeCompleto, dataNascimento, CPF_CNPJ, nomeDeUsuario, email, senhaHash, tipoPessoa, telefone, celular, cargo, empresaId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nomeCompleto, dataNascimento, CPF_CNPJ, nomeUsuario, email, senhaHasheada, tipoPessoa, telefone, celular, cargo, empresaId]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao criar a conta.' });
  }
}


async function createPessoaPublica(req, res) {
  const {
    nomeCompleto,
    dataNascimento,
    CPF,
    nomeUsuario,
    email,
    senhaHash,
    tipoPessoa,
    telefone,
    celular
  } = req.body;

  if (!nomeCompleto || !CPF || !nomeUsuario || !email || !senhaHash || !tipoPessoa) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  // Valida idade
  if (dataNascimento) {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    const dia = hoje.getDate() - nascimento.getDate();
    const idadeFinal = mes < 0 || (mes === 0 && dia < 0) ? idade - 1 : idade;

    if (idadeFinal < 16) {
      return res.status(400).json({ error: 'É necessário ter pelo menos 16 anos para se cadastrar.' });
    }
    if (idadeFinal > 100) {
      return res.status(400).json({ error: 'Idade acima do limite permitido (100 anos).' });
    }
  }

  // Valida CPF ou CNPJ
  if (tipoPessoa === 'fisica' && !validarCPF(CPF)) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }

  if (tipoPessoa === 'juridica' && !validarCNPJ(CPF)) {
    return res.status(400).json({ error: 'CNPJ inválido.' });
  }

  // Valida e-mail
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  try {
    // Verifica duplicidades
    const [[cpfExiste]] = await db.query(
      `SELECT id FROM pessoa WHERE CPF_CNPJ = ?`,
      [CPF]
    );
    if (cpfExiste) return res.status(400).json({ error: 'CPF/CNPJ já cadastrado.' });

    const [[usuarioExiste]] = await db.query(
      `SELECT id FROM pessoa WHERE nomeDeUsuario = ?`,
      [nomeUsuario]
    );
    if (usuarioExiste) return res.status(400).json({ error: 'Nome de usuário já em uso.' });

    const [[emailExiste]] = await db.query(
      `SELECT id FROM pessoa WHERE email = ?`,
      [email]
    );
    if (emailExiste) return res.status(400).json({ error: 'Email já cadastrado.' });

    const senhaHasheada = await bcrypt.hash(senhaHash, 10);

    const [result] = await db.query(
      `INSERT INTO pessoa 
        (nomeCompleto, dataNascimento, CPF_CNPJ, nomeDeUsuario, email, senhaHash, tipoPessoa, telefone, celular, cargo, empresaId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'cliente', NULL)`,
      [nomeCompleto, dataNascimento, CPF, nomeUsuario, email, senhaHasheada, tipoPessoa, telefone, celular]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao criar a conta.' });
  }
}


// PATCH
async function updatePessoa(req, res) {
  const { id } = req.params;
  const fields = { ...req.body };
  const keys = Object.keys(fields);

  if (keys.length === 0) return res.status(400).json({ error: 'Nada para atualizar' });

  try {
    // Validação de duplicidade para CPF, email e nomeDeUsuario
    if (fields.CPF_CNPJ) {
      const [[cpfExiste]] = await db.query(
        `SELECT id FROM pessoa WHERE CPF_CNPJ = ? AND id != ?`,
        [fields.CPF_CNPJ, id]
      );
      if (cpfExiste) return res.status(400).json({ error: 'CPF/CNPJ já cadastrado por outro usuário.' });
    }

    if (fields.email) {
      const [[emailExiste]] = await db.query(
        `SELECT id FROM pessoa WHERE email = ? AND id != ?`,
        [fields.email, id]
      );
      if (emailExiste) return res.status(400).json({ error: 'Email já cadastrado por outro usuário.' });
    }

    if (fields.nomeUsuario || fields.nomeDeUsuario) {
      const nomeUsuario = fields.nomeUsuario || fields.nomeDeUsuario;
      const [[usuarioExiste]] = await db.query(
        `SELECT id FROM pessoa WHERE nomeDeUsuario = ? AND id != ?`,
        [nomeUsuario, id]
      );
      if (usuarioExiste) return res.status(400).json({ error: 'Nome de usuário já em uso por outro usuário.' });

      fields.nomeDeUsuario = nomeUsuario;
      delete fields.nomeUsuario; // normaliza o campo
    }

    // Hash da nova senha se fornecida
    if (fields.senhaHash) {
      fields.senhaHash = await bcrypt.hash(fields.senhaHash, 10);
    }

    // Montar query dinâmica
    const setClause = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(fields);

    await db.query(
      `UPDATE pessoa SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    res.json({ message: 'Pessoa atualizada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno ao atualizar a pessoa.' });
  }
}

// DELETE
async function deletePessoa(req, res) {
  const { id } = req.params;
  const [result] = await db.query('DELETE FROM pessoa WHERE id = ?', [id]);
  res.json({ message: 'Pessoa removida com sucesso' });
}

//listUsuariosPorCargo
async function listUsuariosPorCargo(req, res) {
  try {
    const usuarioLogado = req.usuario; // Middleware auth deve preencher req.usuario
    if (!usuarioLogado) return res.status(401).json({ error: 'Não autenticado' });

    let query = `
      SELECT p.*, e.nomeFantasia AS empresaNome
      FROM pessoa p
      LEFT JOIN empresa e ON p.empresaId = e.id
    `;

    let params = [];

    if (usuarioLogado.cargo === 'admin') {
      // Sem filtro para admin
    } else if (usuarioLogado.cargo === 'dono-loja') {
      query += ` WHERE p.empresaId = ?`;
      params.push(usuarioLogado.empresaId);
    } else {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const [rows] = await db.query(query, params);

    const agrupados = {};
    for (const user of rows) {
      const empNome = user.empresaNome || 'Sem Empresa';
      if (!agrupados[empNome]) agrupados[empNome] = [];
      agrupados[empNome].push(user);
    }

    res.json(agrupados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno' });
  }
}

module.exports = {
  getPessoa,
  listAllPessoas,
  createPessoaPublica,
  createPessoa,
  updatePessoa,
  deletePessoa,
  listUsuariosPorCargo
};