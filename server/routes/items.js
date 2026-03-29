import express from 'express'
import * as items from '../controllers/itemsTable.js'

const router = express.Router()

// Exteriors
router.get('/exteriors', async (req, res) => {
  try {
    const rows = await items.getAllExteriors()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/exteriors/:id', async (req, res) => {
  try {
    const row = await items.getExteriorById(req.params.id)
    if (!row) return res.status(404).json({ error: 'not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Wheels
router.get('/wheels', async (req, res) => {
  try {
    const rows = await items.getAllWheels()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/wheels/:id', async (req, res) => {
  try {
    const row = await items.getWheelById(req.params.id)
    if (!row) return res.status(404).json({ error: 'not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Roofs
router.get('/roofs', async (req, res) => {
  try {
    const rows = await items.getAllRoofs()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/roofs/:id', async (req, res) => {
  try {
    const row = await items.getRoofById(req.params.id)
    if (!row) return res.status(404).json({ error: 'not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Interiors
router.get('/interiors', async (req, res) => {
  try {
    const rows = await items.getAllInteriors()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/interiors/:id', async (req, res) => {
  try {
    const row = await items.getInteriorById(req.params.id)
    if (!row) return res.status(404).json({ error: 'not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Cars
router.get('/cars', async (req, res) => {
  try {
    const rows = await items.getAllCars()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/cars/:id', async (req, res) => {
  try {
    const row = await items.getCarById(req.params.id)
    if (!row) return res.status(404).json({ error: 'not found' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/cars', async (req, res) => {
  try {
    const created = await items.createCar(req.body)
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/cars/:id', async (req, res) => {
  try {
    const updated = await items.updateCar(req.params.id, req.body)
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/cars/:id', async (req, res) => {
  try {
    const deleted = await items.deleteCar(req.params.id)
    res.json(deleted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
