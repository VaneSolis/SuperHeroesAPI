import express from "express";
import bcrypt from 'bcryptjs';
import { check, validationResult } from 'express-validator';
import { generateToken } from '../middleware/auth.js';
import fs from 'fs-extra';

const router = express.Router();
const USERS_FILE = './data/users.json';

// Función para leer usuarios
async function getUsers() {
    try {
        const data = await fs.readJSON(USERS_FILE);
        return data;
    } catch (error) {
        // Si el archivo no existe, crear uno con un usuario por defecto
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                role: 'admin'
            }
        ];
        await fs.writeJSON(USERS_FILE, defaultUsers, { spaces: 2 });
        return defaultUsers;
    }
}

// Función para guardar usuarios
async function saveUsers(users) {
    await fs.writeJSON(USERS_FILE, users, { spaces: 2 });
}

// Login
router.post('/login', [
    check('username').not().isEmpty().withMessage('El nombre de usuario es requerido'),
    check('password').not().isEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const { username, password } = req.body;
        const users = await getUsers();
        const user = users.find(u => u.username === username);

        if (!user) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        const token = generateToken(user);
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registro
router.post('/register', [
    check('username').isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }

    try {
        const { username, password } = req.body;
        const users = await getUsers();

        // Verificar si el usuario ya existe
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Usuario ya existe',
                message: 'El nombre de usuario ya está registrado'
            });
        }

        // Crear nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            username,
            password: hashedPassword,
            role: 'user'
        };

        users.push(newUser);
        await saveUsers(users);

        const token = generateToken(newUser);
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Verificar token
router.get('/verify', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                error: 'Token no proporcionado',
                valid: false
            });
        }

        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro_2024';
        
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ 
                    error: 'Token inválido',
                    valid: false
                });
            }
            res.json({ 
                message: 'Token válido',
                valid: true,
                user: decoded
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 