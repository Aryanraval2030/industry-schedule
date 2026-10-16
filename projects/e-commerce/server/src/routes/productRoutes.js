import express from 'express';
import {
  getProducts,
  getCategories,
  getFeaturedProducts,
  getProductByIdentifier,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/:identifier', getProductByIdentifier);

export default router;
