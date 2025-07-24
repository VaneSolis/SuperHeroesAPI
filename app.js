// app.js
import express from 'express';
import heroController from './controllers/heroController.js';

const app = express();
const PORT = 3001;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/', heroController);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

