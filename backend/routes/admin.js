import express from 'express';
import multer from 'multer';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as bulkImportController from '../controllers/bulkImportController.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/stats', authenticate, authorize('admin'), adminController.getStats);
router.get('/orders', authenticate, authorize('admin'), adminController.getAllOrders);
router.patch('/orders/:id/status', authenticate, authorize('admin'), adminController.updateOrderStatus);
router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.patch('/users/:id/suspend', authenticate, authorize('admin'), adminController.suspendUser);

// Category routes
router.get('/categories', authenticate, authorize('admin'), categoryController.getCategories);
router.post('/categories', authenticate, authorize('admin'), categoryController.createCategory);
router.put('/categories/:id', authenticate, authorize('admin'), categoryController.updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), categoryController.deleteCategory);

// Bulk import routes
router.post('/bulk-import/books', authenticate, authorize('admin'), upload.single('file'), bulkImportController.bulkImportBooks);
router.post('/bulk-import/categories', authenticate, authorize('admin'), upload.single('file'), bulkImportController.bulkImportCategories);
router.post('/bulk-import-json/books', authenticate, authorize('admin'), bulkImportController.bulkImportBooksJSON);
router.post('/bulk-import-json/categories', authenticate, authorize('admin'), bulkImportController.bulkImportCategoriesJSON);
router.get('/template/:type', authenticate, authorize('admin'), bulkImportController.downloadTemplate);

export default router;