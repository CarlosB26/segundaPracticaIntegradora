import express from 'express';
const router = express.Router();


router.get('/', async(req, res) => {
  try {
    res.render('realTimeProducts', {});
} catch (error) {
    res.status(500).json({ error: 'Error al cargar productos' });
}
});

export default router;