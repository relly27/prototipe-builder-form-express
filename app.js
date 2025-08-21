require('dotenv').config();
const express = require('express');
const listEndpoints = require("express-list-endpoints");
const morgan = require("morgan");
const cors = require("cors");
const constructor = require('./controllers/constructorController');

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());


app.get('/api/prueba', (req, res) => {
  res.json({ message: 'Api funcionando' });
});

console.log("Endpoints disponibles:");
console.table(listEndpoints(app));

const host = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

//dev mode 
app.listen(PORT, host, () => {
  console.log(`Servidor corriendo en http://${host}:${PORT}`);
});
