import express from 'express';
import { prisma } from '../lib/prisma';

const router = express.Router();

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        startTime: 'desc',
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: req.params.id,
      },
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks/:id/retry
router.post('/:id/retry', async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: {
        id: req.params.id,
      },
      data: {
        status: 'pending',
      },
    });
    
    res.json({ message: 'Task queued for retry', task });
  } catch (error) {
    console.error('Error retrying task:', error);
    res.status(500).json({ error: 'Failed to retry task' });
  }
});

// POST /api/tasks (for testing)
router.post('/', async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: {
        type: req.body.type,
        status: 'pending',
        client: req.body.client,
        reward: req.body.reward,
      },
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

export default router;
