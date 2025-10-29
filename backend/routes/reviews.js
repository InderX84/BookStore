import express from 'express';
import { validate, reviewSchema } from '../utils/validation.js';
import { authenticate } from '../middleware/auth.js';
import * as reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.post('/:bookId', authenticate, validate(reviewSchema), reviewController.createReview);
router.put('/:id', authenticate, validate(reviewSchema), reviewController.updateReview);
router.delete('/:id', authenticate, reviewController.deleteReview);
router.get('/book/:bookId', reviewController.getBookReviews);

export default router;