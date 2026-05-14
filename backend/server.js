require('dotenv').config();
const app  = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    // Verificar conexión a la BD antes de arrancar
    await pool.query('SELECT 1');
    console.log('✅ Conexión a PostgreSQL establecida');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ No se pudo conectar a la base de datos:', err.message);
    console.error('   Verifica que DATABASE_URL en tu .env es correcto.');
    process.exit(1);
  }
}

start();
