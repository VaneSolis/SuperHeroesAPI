import express from "express";
import { check, validationResult } from 'express-validator';
import heroService from "../services/heroService.js";
import Hero from "../models/heroModel.js";

const router = express.Router();

router.get("/heroes", async (req, res) => {
    try {
        const heroes = await heroService.getAllHeroes();
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/heroes",
    [
        check('name').not().isEmpty().withMessage('El nombre es requerido'),
        check('alias').not().isEmpty().withMessage('El alias es requerido')
    ], 
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ error : errors.args()})
        }

        try {
            const { name, alias, city, team } = req.body;
            const newHero = new Hero(null, name, alias, city, team);
            const addedHero = await heroService.addHero(newHero);

            res.status(201).json(addedHero);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
});

router.put("/heroes/:id", async (req, res) => {
    try {
        const updatedHero = await heroService.updateHero(req.params.id, req.body);
        res.json(updatedHero);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/heroes/:id', async (req, res) => {
    try {
        const result = await heroService.deleteHero(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/heroes/city/:city', async (req, res) => {
  try {
    const heroes = await heroService.findHeroesByCity(req.params.city);
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/heroes/:id/enfrentar', async (req, res) => {
  try {
    const result = await heroService.faceVillain(req.params.id, req.body.villain);
    res.json({ message: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post('/heroes/:id/adoptar-mascota', async (req, res) => {
  try {
    const hero = await heroService.adoptPet(req.params.id, req.body);
    res.json(hero);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Nuevos endpoints para el cuidado de mascotas
router.post('/heroes/:id/mascota/alimentar', async (req, res) => {
  try {
    const hero = await heroService.alimentarMascota(req.params.id);
    res.json({ 
      message: `¡${hero.pet.nombre} ha sido alimentado!`,
      estado: hero.pet.obtenerEstado()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/heroes/:id/mascota/jugar', async (req, res) => {
  try {
    const hero = await heroService.jugarConMascota(req.params.id);
    res.json({ 
      message: `¡Has jugado con ${hero.pet.nombre}!`,
      estado: hero.pet.obtenerEstado()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/heroes/:id/mascota/banar', async (req, res) => {
  try {
    const hero = await heroService.banarMascota(req.params.id);
    res.json({ 
      message: `¡${hero.pet.nombre} ha sido bañado!`,
      estado: hero.pet.obtenerEstado()
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/heroes/:id/mascota/estado', async (req, res) => {
  try {
    const estado = await heroService.obtenerEstadoMascota(req.params.id);
    res.json(estado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;