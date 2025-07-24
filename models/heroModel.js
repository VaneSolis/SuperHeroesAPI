class Hero {
    constructor(id, name, alias, city, team, pet = null) {
        this.id = id
        this.name = name
        this.alias = alias
        this.city = city
        this.team = team 
        this.pet = pet // { nombre, tipo, edad, poderes }
    }
}

export default Hero