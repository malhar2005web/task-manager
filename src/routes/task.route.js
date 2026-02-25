import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/", protectRoute, createTask);
router.get("/", protectRoute, getTasks);
router.put("/:id", protectRoute, updateTask);
router.delete("/:id", protectRoute, deleteTask);

export default router;
