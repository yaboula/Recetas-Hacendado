const pool = require('./src/config/database');
pool.query("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'chk_seccion'")
  .then(r => console.log(r.rows))
  .finally(() => pool.end());
