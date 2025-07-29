import fs from 'fs-extra'
import Hero, { Pet } from '../models/heroModel.js'

const filePath = './data/superheroes.json'

// Leer héroes desde el archivo JSON
async function getHeroes() {
  try {
    const data = await fs.readJSON(filePath)
    return data.map(hero => {
      // Si hay una mascota, crear una instancia de Pet con todos sus datos
      let pet = null;
      if (hero.pet) {
        pet = new Pet(
          hero.pet.nombre,
          hero.pet.tipo,
          hero.pet.edad,
          hero.pet.poderes
        );
        
        // Restaurar los timestamps y estados si existen
        if (hero.pet.ultimaAlimentacion) {
          pet.ultimaAlimentacion = hero.pet.ultimaAlimentacion;
        }
        if (hero.pet.ultimoJuego) {
          pet.ultimoJuego = hero.pet.ultimoJuego;
        }
        if (hero.pet.ultimoBano) {
          pet.ultimoBano = hero.pet.ultimoBano;
        }
        if (hero.pet.vida !== undefined) {
          pet.vida = hero.pet.vida;
        }
        if (hero.pet.hambre !== undefined) {
          pet.hambre = hero.pet.hambre;
        }
        if (hero.pet.felicidad !== undefined) {
          pet.felicidad = hero.pet.felicidad;
        }
        if (hero.pet.higiene !== undefined) {
          pet.higiene = hero.pet.higiene;
        }
      }
      
      return new Hero(
        hero.id,
        hero.name,
        hero.alias,
        hero.city,
        hero.team,
        pet
      )
    })
  } catch (error) {
    console.error('Error leyendo héroes:', error)
    return []
  }
}

// Guardar héroes en el archivo JSON
async function saveHeroes(heroes) {
  try {
    // Convertir las instancias de Pet a objetos planos para JSON
    const heroesData = heroes.map(hero => {
      const heroData = {
        id: hero.id,
        name: hero.name,
        alias: hero.alias,
        city: hero.city,
        team: hero.team
      };
      
      if (hero.pet) {
        heroData.pet = {
          nombre: hero.pet.nombre,
          tipo: hero.pet.tipo,
          edad: hero.pet.edad,
          poderes: hero.pet.poderes,
          vida: hero.pet.vida,
          hambre: hero.pet.hambre,
          felicidad: hero.pet.felicidad,
          higiene: hero.pet.higiene,
          ultimaAlimentacion: hero.pet.ultimaAlimentacion,
          ultimoJuego: hero.pet.ultimoJuego,
          ultimoBano: hero.pet.ultimoBano
        };
      }
      
      return heroData;
    });
    
    await fs.writeJSON(filePath, heroesData, { spaces: 2 })
  } catch (error) {
    console.error('Error guardando héroes:', error)
  }
}

export default {
  getHeroes,
  saveHeroes
}
