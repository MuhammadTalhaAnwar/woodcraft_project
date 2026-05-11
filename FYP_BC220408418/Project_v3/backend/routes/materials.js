import express from 'express';
const router = express.Router();
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, admin, getMaterials)
  .post(protect, admin, createMaterial);

router.route('/:id')
  .put(protect, admin, updateMaterial)
  .delete(protect, admin, deleteMaterial);

export default router;
