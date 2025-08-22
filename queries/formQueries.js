const pool = require('../db/db');

// Crear un nuevo template de formulario
const createFormTemplate = async (name, description, schema) => {
  const result = await pool.query(
    `INSERT INTO form_templates (name, description, schema) 
     VALUES ($1, $2, $3) RETURNING *`,
    [name, description, schema]
  );
  return result.rows[0];
};

// Obtener todos los templates
const getFormTemplates = async () => {
  const result = await pool.query(`SELECT * FROM form_templates ORDER BY id DESC`);
  return result.rows;
};

// Obtener un template por id
const getFormTemplateById = async (id) => {
  const result = await pool.query(`SELECT * FROM form_templates WHERE id = $1`, [id]);
  return result.rows[0];
};

// Crear una respuesta de formulario
const createFormResponse = async (templateId, data) => {
  const result = await pool.query(
    `INSERT INTO form_responses (template_id, data) 
     VALUES ($1, $2) RETURNING *`,
    [templateId, data]
  );
  return result.rows[0];
};

// Obtener respuestas por template
const getResponsesByTemplate = async (templateId) => {
  const result = await pool.query(
    `SELECT * FROM form_responses WHERE template_id = $1 ORDER BY id DESC`,
    [templateId]
  );
  return result.rows;
};

module.exports = {
  createFormTemplate,
  getFormTemplates,
  getFormTemplateById,
  createFormResponse,
  getResponsesByTemplate
};
