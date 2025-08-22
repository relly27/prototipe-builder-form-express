-- Tabla para los tipos de formularios (productos: TRI, TT, RCG, etc.)
CREATE TABLE form_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,       -- Ej: "TRI", "TT", "RCG"
    description TEXT,
    schema JSONB NOT NULL,            -- Estructura dinámica del formulario en JSON
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ejemplo de schema JSON en form_templates.schema
-- {
--   "fields": [
--     { "name": "nombre_cliente", "label": "Nombre del Cliente", "type": "text", "required": true },
--     { "name": "monto", "label": "Monto Asegurado", "type": "number", "required": true },
--     { "name": "fecha_inicio", "label": "Fecha de Inicio", "type": "date", "required": true }
--   ]
-- }

-- Tabla para respuestas de formularios (cotizaciones hechas)
CREATE TABLE form_responses (
    id SERIAL PRIMARY KEY,
    template_id INT REFERENCES form_templates(id) ON DELETE CASCADE,
    data JSONB NOT NULL,              -- Respuestas dinámicas al formulario
    created_at TIMESTAMP DEFAULT NOW()
);

-- Ejemplo de data JSON en form_responses.data
-- {
--   "nombre_cliente": "Juan Pérez",
--   "monto": 50000,
--   "fecha_inicio": "2025-09-01"
-- }
