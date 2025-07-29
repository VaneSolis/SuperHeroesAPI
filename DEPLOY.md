# 🚀 Guía de Deploy - API de Superhéroes

## 🌟 Opciones Gratuitas Recomendadas

### 1. **Render (Más Fácil)**
1. Ve a [render.com](https://render.com)
2. Crea cuenta gratuita
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Name:** `superheroes-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node app.js`
6. Click en "Create Web Service"
7. ¡Listo! Tu API estará disponible en `https://tu-app.onrender.com`

### 2. **Railway**
1. Ve a [railway.app](https://railway.app)
2. Conecta tu GitHub
3. Selecciona tu repositorio
4. Deploy automático
5. ¡Listo! Tu API estará disponible en `https://tu-app.railway.app`

### 3. **Heroku**
1. Ve a [heroku.com](https://heroku.com)
2. Crea cuenta gratuita
3. Instala Heroku CLI
4. Ejecuta:
   ```bash
   heroku create tu-app-superheroes
   git push heroku main
   ```
5. ¡Listo! Tu API estará disponible en `https://tu-app-superheroes.herokuapp.com`

## 🔧 Configuración Requerida

### Variables de Entorno (Opcional)
- `PORT`: Puerto del servidor (automático)
- `JWT_SECRET`: Secreto para JWT (opcional, tiene valor por defecto)

### Estructura del Proyecto
```
SuperHeroes/
├── app.js              # Servidor principal
├── package.json        # Dependencias
├── Procfile           # Para Heroku
├── public/            # Archivos estáticos
│   ├── index.html     # Interfaz web
│   ├── styles.css     # Estilos
│   └── app.js         # JavaScript frontend
├── controllers/       # Controladores
├── models/           # Modelos
├── services/         # Servicios
├── repositories/     # Repositorios
├── middleware/       # Middleware
└── data/            # Datos JSON
```

## 🌐 URLs de Acceso

### API Endpoints
- **Base URL:** `https://tu-app.onrender.com`
- **API Docs:** `https://tu-app.onrender.com/`
- **Interfaz Web:** `https://tu-app.onrender.com/index.html`

### Endpoints Principales
- `GET /` - Información de la API
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `GET /heroes` - Listar héroes (requiere JWT)
- `POST /heroes` - Crear héroe (requiere JWT)
- `POST /heroes/:id/adoptar-mascota` - Adoptar mascota
- `POST /heroes/:id/mascota/alimentar` - Alimentar mascota
- `POST /heroes/:id/mascota/jugar` - Jugar con mascota
- `POST /heroes/:id/mascota/banar` - Bañar mascota

## 🔐 Credenciales por Defecto
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## 📱 Características del Deploy
- ✅ **SSL automático** (HTTPS)
- ✅ **CORS habilitado** para desarrollo
- ✅ **Autenticación JWT** funcional
- ✅ **Interfaz web** responsive
- ✅ **Sistema de mascotas** completo
- ✅ **Deploy automático** desde GitHub

## 🐛 Solución de Problemas

### Error: "Cannot find module"
- Verifica que `package.json` tenga todas las dependencias
- Ejecuta `npm install` localmente para probar

### Error: "Port already in use"
- El deploy automático maneja el puerto
- No necesitas configurar puerto manualmente

### Error: "CORS"
- CORS está configurado para desarrollo
- En producción, ajusta los orígenes permitidos

## 🎯 Próximos Pasos
1. Haz deploy en Render (más fácil)
2. Prueba la API con Postman
3. Accede a la interfaz web
4. ¡Disfruta tu API en producción! 🚀 