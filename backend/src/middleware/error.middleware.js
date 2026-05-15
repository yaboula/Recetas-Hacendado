function errorMiddleware(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  const status  = err.status  || 500;
  const message = err.message || 'Error interno del servidor.';
  const code    = err.code    || 'INTERNAL_ERROR';

  res.status(status).json({ error: message, code });
}

module.exports = errorMiddleware;
