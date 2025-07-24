import fs from 'fs-extra'
import Hero from '../models/heroModel.js'

const filePath = './data/superheroes.json'

// Leer héroes desde el archivo JSON
async function getHeroes() {
  try {
    const data = await fs.readJSON(filePath)
    return data.map(hero => new Hero(
      hero.id,
      hero.name,
      hero.alias,
      hero.city,
      hero.team,
      hero.pet // Puede ser undefined o un objeto
    ))
  } catch (error) {
    console.error('Error leyendo héroes:', error)
    return []
  }
}

// Guardar héroes en el archivo JSON
async function saveHeroes(heroes) {
  try {
    await fs.writeJSON(filePath, heroes, { spaces: 2 })
  } catch (error) {
    console.error('Error guardando héroes:', error)
  }
}

export default {
  getHeroes,
  saveHeroes
}
