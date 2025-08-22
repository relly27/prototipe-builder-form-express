require('dotenv').config();
const express = require('express');
const listEndpoints = require("express-list-endpoints");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const formController = require('./controllers/formController');

const app = express();
app.use(bodyParser.json());

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


app.post('/api/forms', formController.createTemplate);          // Crear nuevo formulario
app.get('/api/forms', formController.getTemplates);             // Listar todos
app.get('/api/forms/:id', formController.getTemplateById);      // Ver uno por ID
app.post('/api/forms/responses', formController.createResponse); // Crear respuesta
app.get('/api/forms/:id/responses', formController.getResponses); // Ver respuestas

console.log("Endpoints disponibles:");
console.table(listEndpoints(app));

const host = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

//dev mode 
app.listen(PORT, host, () => {
  console.log(`Servidor corriendo en http://${host}:${PORT}`);
});
