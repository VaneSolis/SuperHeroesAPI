// app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import heroController from './controllers/heroController.js';
import authController from './controllers/authController.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
const PORT = 3001;

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        message: '¡Bienvenido a la API de Superhéroes! 🦸‍♂️',
        version: '1.0.0',
        endpoints: {
            auth: '/auth',
            heroes: '/heroes',
            documentation: 'https://github.com/VaneSolis/SuperHeroesAPI'
        },
        features: [
            'Sistema de autenticación JWT',
            'Gestión de superhéroes',
            'Sistema de mascotas con cuidado',
            'CORS habilitado'
        ]
    });
});

// Rutas de autenticación (públicas)
app.use('/auth', authController);

// Rutas de héroes (protegidas con autenticación)
app.use('/heroes', authenticateToken, heroController);

// Servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🔐 Sistema de autenticación JWT habilitado`);
    console.log(`🌐 CORS habilitado para desarrollo`);
    console.log(`📚 Documentación: https://github.com/VaneSolis/SuperHeroesAPI`);
    console.log(`🌍 Interfaz web disponible en http://localhost:${PORT}/index.html`);
});

