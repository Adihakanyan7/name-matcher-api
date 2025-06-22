import express from 'express';

const router = express.Router();

router.post('/', (req, res) =>{
    const {text, names} = req.body;
    if (!text || !names || !Array.isArray(names)) {
        return res.status(400).json({ error: 'Invalid input - Must provide text and an array of names' });
    }

});

export default router;
