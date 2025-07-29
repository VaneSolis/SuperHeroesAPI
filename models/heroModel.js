class Pet {
    constructor(nombre, tipo, edad = null, poderes = []) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.edad = edad;
        this.poderes = poderes;
        this.vida = 100; // Nivel de vida (0-100)
        this.hambre = 0; // Nivel de hambre (0-100)
        this.felicidad = 100; // Nivel de felicidad (0-100)
        this.higiene = 100; // Nivel de higiene (0-100)
        this.ultimaAlimentacion = Date.now();
        this.ultimoJuego = Date.now();
        this.ultimoBano = Date.now();
    }

    // Métodos para cuidar la mascota
    alimentar() {
        this.hambre = Math.max(0, this.hambre - 30);
        this.vida = Math.min(100, this.vida + 10);
        this.ultimaAlimentacion = Date.now();
        return this;
    }

    jugar() {
        this.felicidad = Math.min(100, this.felicidad + 25);
        this.vida = Math.min(100, this.vida + 15);
        this.ultimoJuego = Date.now();
        return this;
    }

    banar() {
        this.higiene = 100;
        this.vida = Math.min(100, this.vida + 5);
        this.ultimoBano = Date.now();
        return this;
    }

    // Actualizar estado basado en el tiempo transcurrido
    actualizarEstado() {
        const ahora = Date.now();
        const tiempoTranscurrido = ahora - Math.min(this.ultimaAlimentacion, this.ultimoJuego, this.ultimoBano);
        const horasTranscurridas = tiempoTranscurrido / (1000 * 60 * 60); // Convertir a horas

        // Disminuir hambre cada hora
        this.hambre = Math.min(100, this.hambre + (horasTranscurridas * 5));
        
        // Disminuir felicidad cada 2 horas
        this.felicidad = Math.max(0, this.felicidad - (horasTranscurridas * 2.5));
        
        // Disminuir higiene cada 3 horas
        this.higiene = Math.max(0, this.higiene - (horasTranscurridas * 1.67));
        
        // Disminuir vida si las necesidades no están satisfechas
        if (this.hambre > 80 || this.felicidad < 20 || this.higiene < 20) {
            this.vida = Math.max(0, this.vida - (horasTranscurridas * 3));
        }

        return this;
    }

    // Verificar si la mascota está viva
    estaViva() {
        return this.vida > 0;
    }

    // Obtener estado general
    obtenerEstado() {
        this.actualizarEstado();
        return {
            nombre: this.nombre,
            tipo: this.tipo,
            edad: this.edad,
            poderes: this.poderes,
            vida: Math.round(this.vida),
            hambre: Math.round(this.hambre),
            felicidad: Math.round(this.felicidad),
            higiene: Math.round(this.higiene),
            estaViva: this.estaViva()
        };
    }
}

class Hero {
    constructor(id, name, alias, city, team, pet = null) {
        this.id = id
        this.name = name
        this.alias = alias
        this.city = city
        this.team = team 
        this.pet = pet instanceof Pet ? pet : (pet ? new Pet(pet.nombre, pet.tipo, pet.edad, pet.poderes) : null)
    }
}

export { Pet }
export default Hero