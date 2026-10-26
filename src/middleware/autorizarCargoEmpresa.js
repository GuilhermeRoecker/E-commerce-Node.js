function autorizarCargoEmpresa({ cargosPermitidos = [], permitirEmpresa = false } = {}) {
  return (req, res, next) => {
    const usuario = req.usuario;

    if (!usuario) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const cargoUsuario = usuario.cargo;
    const empresaIdUsuario = cargoUsuario === 'admin' ? 1 : usuario.empresaId;

    if (cargoUsuario === 'admin') {
      return next(); // Admin sempre passa
    }

    if (!cargosPermitidos.includes(cargoUsuario)) {
      return res.status(403).json({ error: 'Acesso negado: cargo insuficiente' });
    }

    // Ignora checagem de empresa na criação
    const isCriandoEmpresa = req.method === 'POST' && req.originalUrl.includes('/empresa');

    if (permitirEmpresa && !isCriandoEmpresa) {
      const empresaIdAlvo = req.body.empresaId || req.params.empresaId;

      if (!empresaIdAlvo || parseInt(empresaIdAlvo) !== parseInt(empresaIdUsuario)) {
        return res.status(403).json({ error: 'Acesso negado: empresa inválida' });
      }

      req.body.empresaId = empresaIdUsuario;
    }

    next();
  };
}


module.exports = autorizarCargoEmpresa;
