import express from 'express';
const router = express.Router();
import { getEmployees, registerEmployee, getMyTasks, deleteEmployee } from '../controllers/employeeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, admin, getEmployees)
  .post(protect, admin, registerEmployee);


router.get('/tasks', protect, getMyTasks);

router.route('/:id')
  .delete(protect, admin, deleteEmployee);

export default router;
