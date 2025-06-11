CREATE TABLE IF NOT EXISTS eventos (
  id TEXT PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK(tipo IN ('MEJORA', 'AUDITORIA')),
  fecha_inicio TEXT NOT NULL,
  fecha_fin TEXT NOT NULL,
  mejora_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(mejora_id) REFERENCES mejoras(id)
);
