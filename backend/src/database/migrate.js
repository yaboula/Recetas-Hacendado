/**
 * Runner de migraciones
 * Ejecuta todos los archivos .sql de /migrations en orden numérico.
 * Uso: node src/database/migrate.js
 */

const fs   = require('fs');
const path = require('path');
const pool = require('../config/database');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigrations() {
  const client = await pool.connect();

  try {
    console.log('🚀 Iniciando migraciones...\n');

    // Obtener los archivos .sql ordenados numéricamente
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      console.log(`  ▶ Ejecutando: ${file}`);
      await client.query(sql);
      console.log(`  ✅ OK: ${file}`);
    }

    console.log('\n✅ Todas las migraciones completadas correctamente.');
  } catch (err) {
    console.error('\n❌ Error durante la migración:', err.message);
    console.error('   Detalle:', err.detail || '');
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
