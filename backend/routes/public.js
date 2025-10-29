import express from 'express';
import * as publicController from '../controllers/publicController.js';

const router = express.Router();

router.get('/stats', publicController.getPublicStats);

export default router;