import heroRepository from '../repositories/heroRepository.js';
import { Pet } from '../models/heroModel.js';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }

    const heroes = await heroRepository.getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId };

    heroes.push(newHero);
    await heroRepository.saveHeroes(heroes);

    return newHero;
}

async function updateHero(id, updatedHero) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    delete updatedHero.id;
    heroes[index] = { ...heroes[index], ...updatedHero };

    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function deleteHero(id) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(id));

    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }

    const filteredHeroes = heroes.filter(hero => hero.id !== parseInt(id));
    await heroRepository.saveHeroes(filteredHeroes);
    return { message: 'Héroe eliminado' };
}

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    return heroes.filter(hero => hero.city.toLowerCase() === city.toLowerCase());
}

async function faceVillain(heroId, villain) {
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(hero => hero.id === parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

async function adoptPet(heroId, petData) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(heroId));
    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }
    // Validar datos de la mascota
    if (!petData || !petData.nombre || !petData.tipo) {
        throw new Error('La mascota debe tener al menos nombre y tipo');
    }
    
    // Crear una nueva instancia de Pet con el sistema de vida
    const nuevaMascota = new Pet(
        petData.nombre,
        petData.tipo,
        petData.edad || null,
        petData.poderes || []
    );
    
    heroes[index].pet = nuevaMascota;
    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function alimentarMascota(heroId) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(heroId));
    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }
    
    if (!heroes[index].pet) {
        throw new Error('El héroe no tiene una mascota');
    }
    
    if (!heroes[index].pet.estaViva()) {
        throw new Error('La mascota ha fallecido');
    }
    
    heroes[index].pet.alimentar();
    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function jugarConMascota(heroId) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(heroId));
    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }
    
    if (!heroes[index].pet) {
        throw new Error('El héroe no tiene una mascota');
    }
    
    if (!heroes[index].pet.estaViva()) {
        throw new Error('La mascota ha fallecido');
    }
    
    heroes[index].pet.jugar();
    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function banarMascota(heroId) {
    const heroes = await heroRepository.getHeroes();
    const index = heroes.findIndex(hero => hero.id === parseInt(heroId));
    if (index === -1) {
        throw new Error('Héroe no encontrado');
    }
    
    if (!heroes[index].pet) {
        throw new Error('El héroe no tiene una mascota');
    }
    
    if (!heroes[index].pet.estaViva()) {
        throw new Error('La mascota ha fallecido');
    }
    
    heroes[index].pet.banar();
    await heroRepository.saveHeroes(heroes);
    return heroes[index];
}

async function obtenerEstadoMascota(heroId) {
    const heroes = await heroRepository.getHeroes();
    const hero = heroes.find(hero => hero.id === parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    
    if (!hero.pet) {
        throw new Error('El héroe no tiene una mascota');
    }
    
    return hero.pet.obtenerEstado();
}

// ✅ Exportar todo en un solo objeto
export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain,
    adoptPet,
    alimentarMascota,
    jugarConMascota,
    banarMascota,
    obtenerEstadoMascota
};

