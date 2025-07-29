# API de Superhéroes con Sistema de Mascotas y Autenticación JWT

Esta API permite gestionar superhéroes y sus mascotas con un sistema completo de cuidado, autenticación JWT y CORS habilitado.

## 🔐 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Todas las rutas de héroes requieren un token válido.

### Endpoints de Autenticación

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

#### Registro
```
POST /auth/register
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "password": "contraseña123",
  "email": "usuario@ejemplo.com"
}
```

#### Verificar Token
```
GET /auth/verify
Authorization: Bearer <tu_token_jwt>
```

## 🦸‍♂️ Endpoints de Héroes (Requieren Autenticación)

**Nota:** Todos los endpoints de héroes requieren el header `Authorization: Bearer <token>`

### Obtener todos los héroes
```
GET /heroes
Authorization: Bearer <token>
```

### Crear un nuevo héroe
```
POST /heroes
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bruce Wayne",
  "alias": "Batman",
  "city": "Gotham",
  "team": "Justice League"
}
```

### Actualizar un héroe
```
PUT /heroes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Peter Parker",
  "alias": "Spider-Man",
  "city": "New York",
  "team": "Avengers"
}
```

### Eliminar un héroe
```
DELETE /heroes/:id
Authorization: Bearer <token>
```

### Buscar héroes por ciudad
```
GET /heroes/city/:city
Authorization: Bearer <token>
```

### Enfrentar a un villano
```
POST /heroes/:id/enfrentar
Authorization: Bearer <token>
Content-Type: application/json

{
  "villain": "Green Goblin"
}
```

## 🐾 Endpoints de Mascotas (Requieren Autenticación)

### Adoptar una mascota
```
POST /heroes/:id/adoptar-mascota
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Krypto",
  "tipo": "Perro",
  "edad": 3,
  "poderes": ["vuelo", "fuerza sobrehumana"]
}
```

### Alimentar mascota
```
POST /heroes/:id/mascota/alimentar
Authorization: Bearer <token>
```
**Efectos:**
- Reduce el hambre en 30 puntos
- Aumenta la vida en 10 puntos
- Actualiza el timestamp de última alimentación

### Jugar con mascota
```
POST /heroes/:id/mascota/jugar
Authorization: Bearer <token>
```
**Efectos:**
- Aumenta la felicidad en 25 puntos
- Aumenta la vida en 15 puntos
- Actualiza el timestamp de último juego

### Bañar mascota
```
POST /heroes/:id/mascota/banar
Authorization: Bearer <token>
```
**Efectos:**
- Restaura la higiene al 100%
- Aumenta la vida en 5 puntos
- Actualiza el timestamp de último baño

### Obtener estado de la mascota
```
GET /heroes/:id/mascota/estado
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "nombre": "Krypto",
  "tipo": "Perro",
  "edad": 3,
  "poderes": ["vuelo", "fuerza sobrehumana"],
  "vida": 85,
  "hambre": 15,
  "felicidad": 90,
  "higiene": 75,
  "estaViva": true
}
```

## 🌐 CORS

La API tiene CORS habilitado para los siguientes orígenes:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:3001`

## Sistema de Vida de Mascotas

Las mascotas tienen un sistema de vida que se ve afectado por el tiempo:

### Estados de la mascota:
- **Vida**: 0-100 (si llega a 0, la mascota fallece)
- **Hambre**: 0-100 (aumenta con el tiempo)
- **Felicidad**: 0-100 (disminuye con el tiempo)
- **Higiene**: 0-100 (disminuye con el tiempo)

### Degradación temporal:
- **Hambre**: Aumenta 5 puntos por hora
- **Felicidad**: Disminuye 2.5 puntos por hora
- **Higiene**: Disminuye 1.67 puntos por hora
- **Vida**: Disminuye 3 puntos por hora si hambre > 80, felicidad < 20, o higiene < 20

### Acciones que mejoran la vida:
- **Alimentar**: Reduce hambre, aumenta vida
- **Jugar**: Aumenta felicidad y vida
- **Bañar**: Restaura higiene y aumenta vida

## Instalación y Uso

1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar el servidor:
```bash
node app.js
```

3. El servidor estará disponible en `http://localhost:3001`

## Usuario por Defecto

Al iniciar la aplicación por primera vez, se crea automáticamente un usuario administrador:

- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`

## Ejemplos de Uso

### 1. Login para obtener token
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Usar el token para acceder a héroes
```bash
curl -X GET http://localhost:3001/heroes \
  -H "Authorization: Bearer <token_obtenido_del_login>"
```

### 3. Adoptar una mascota
```bash
curl -X POST http://localhost:3001/heroes/1/adoptar-mascota \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Luna",
    "tipo": "Gato",
    "edad": 2,
    "poderes": ["visión nocturna", "agilidad"]
  }'
```

### 4. Alimentar la mascota
```bash
curl -X POST http://localhost:3001/heroes/1/mascota/alimentar \
  -H "Authorization: Bearer <token>"
```

## Variables de Entorno

Puedes configurar las siguientes variables de entorno:

- `JWT_SECRET`: Secreto para firmar los tokens JWT (por defecto: 'tu_secreto_super_seguro_2024')
- `PORT`: Puerto del servidor (por defecto: 3001)

## Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Tokens JWT con expiración de 24 horas
- ✅ Validación de datos de entrada
- ✅ CORS configurado para desarrollo
- ✅ Middleware de autenticación en todas las rutas protegidas 