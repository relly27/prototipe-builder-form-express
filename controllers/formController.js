const formQueries = require('../queries/formQueries');

// Crear un nuevo template
const createTemplate = async (req, res) => {
  try {
    const { name, description, schema } = req.body;
    const template = await formQueries.createFormTemplate(name, description, schema);
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los templates
const getTemplates = async (req, res) => {
  try {
    const templates = await formQueries.getFormTemplates();
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un template por id
const getTemplateById = async (req, res) => {
  try {
    const template = await formQueries.getFormTemplateById(req.params.id);
    res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear respuesta (cotización)
const createResponse = async (req, res) => {
  try {
    const { templateId, data } = req.body;
    const response = await formQueries.createFormResponse(templateId, data);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener respuestas de un template
const getResponses = async (req, res) => {
  try {
    const responses = await formQueries.getResponsesByTemplate(req.params.id);
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  createResponse,
  getResponses
};
