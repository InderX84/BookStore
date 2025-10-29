import express from 'express';
import { validate, bookSchema } from '../utils/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import * as bookController from '../controllers/bookController.js';

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/meta/categories', bookController.getCategories);
router.get('/:id', bookController.getBook);
router.post('/', authenticate, authorize('admin'), validate(bookSchema), bookController.createBook);
router.put('/:id', authenticate, authorize('admin'), validate(bookSchema), bookController.updateBook);
router.delete('/:id', authenticate, authorize('admin'), bookController.deleteBook);

export default router;