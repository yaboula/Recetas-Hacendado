const express       = require('express');
const cors          = require('cors');
const errorHandler  = require('./middleware/error.middleware');
require('dotenv').config();

const app = express();

const allowedOrigins = new Set([
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean));

function isAllowedDevOrigin(origin) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(origin);
}

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || isAllowedDevOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '12mb' }));

// ── Health check ───────────────────────────────────────────────
app.get('/api/v1/health', async (req, res) => {
  const pool = require('./config/database');
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// ── Rutas — Sprint 1 ───────────────────────────────────────────
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));

// Sprint 2:
app.use('/api/v1/recetas', require('./modules/recetas/recetas.routes'));

// Sprint 3:
app.use('/api/v1/lista',     require('./modules/lista/lista.routes'));

// Sprint 4:
app.use('/api/v1/favoritos', require('./modules/favoritos/favoritos.routes'));
app.use('/api/v1/ai', require('./modules/ai/ai.routes'));

// ── Manejador global de errores (siempre al final) ─────────────
app.use(errorHandler);

module.exports = app;
