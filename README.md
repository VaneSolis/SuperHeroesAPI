# API de Superhéroes con Sistema de Mascotas

Esta API permite gestionar superhéroes y sus mascotas con un sistema completo de cuidado.

## Endpoints de Héroes

### Obtener todos los héroes
```
GET /heroes
```

### Crear un nuevo héroe
```
POST /heroes
Content-Type: application/json

{
  "name": "Peter Parker",
  "alias": "Spider-Man",
  "city": "New York",
  "team": "Avengers"
}
```

### Actualizar un héroe
```
PUT /heroes/:id
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
```

### Buscar héroes por ciudad
```
GET /heroes/city/:city
```

### Enfrentar a un villano
```
POST /heroes/:id/enfrentar
Content-Type: application/json

{
  "villain": "Green Goblin"
}
```

## Endpoints de Mascotas

### Adoptar una mascota
```
POST /heroes/:id/adoptar-mascota
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
```
**Efectos:**
- Reduce el hambre en 30 puntos
- Aumenta la vida en 10 puntos
- Actualiza el timestamp de última alimentación

### Jugar con mascota
```
POST /heroes/:id/mascota/jugar
```
**Efectos:**
- Aumenta la felicidad en 25 puntos
- Aumenta la vida en 15 puntos
- Actualiza el timestamp de último juego

### Bañar mascota
```
POST /heroes/:id/mascota/banar
```
**Efectos:**
- Restaura la higiene al 100%
- Aumenta la vida en 5 puntos
- Actualiza el timestamp de último baño

### Obtener estado de la mascota
```
GET /heroes/:id/mascota/estado
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

## Ejemplos de Uso

### Adoptar una mascota
```bash
curl -X POST http://localhost:3001/heroes/1/adoptar-mascota \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Luna",
    "tipo": "Gato",
    "edad": 2,
    "poderes": ["visión nocturna", "agilidad"]
  }'
```

### Alimentar la mascota
```bash
curl -X POST http://localhost:3001/heroes/1/mascota/alimentar
```

### Ver estado de la mascota
```bash
curl http://localhost:3001/heroes/1/mascota/estado
``` 