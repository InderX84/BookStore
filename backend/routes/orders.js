import express from 'express';
import { validate, orderSchema } from '../utils/validation.js';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.post('/', authenticate, validate(orderSchema), orderController.createOrder);
router.get('/', authenticate, orderController.getOrders);
router.get('/:id', authenticate, orderController.getOrder);

export default router;