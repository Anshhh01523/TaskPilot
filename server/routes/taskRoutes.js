const express = require('express');
const router = express.Router();
const { Task, User, Project } = require('../models');
const { protect, admin } = require('../middleware/auth');
const { Op } = require('sequelize');

// Helper to map response for frontend
const mapTask = (task) => {
  const t = task.toJSON();
  return {
    ...t,
    _id: t.id,
    assignedTo: t.Assignee ? { ...t.Assignee, _id: t.Assignee.id } : null,
    // Note: comments author mapping would happen here if we used a separate model
    // But for JSON simplicity, we'll keep it as is or map if needed.
  };
};

// Get all tasks (can filter by projectId)
router.get('/', protect, async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'Member') {
      where.assignedTo = req.user.id;
    }
    if (req.query.projectId) {
      where.projectId = req.query.projectId;
    }
    
    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(tasks.map(mapTask));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a task (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;
    
    const task = await Task.create({
      title,
      description,
      status: status || 'TODO',
      priority: priority || 'Medium',
      dueDate,
      assignedTo,
      projectId,
      comments: []
    });

    const populatedTask = await Task.findByPk(task.id, {
      include: [{ model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }]
    });

    res.status(201).json(mapTask(populatedTask));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (task) {
      if (req.user.role === 'Member') {
        if (req.body.title || req.body.description || req.body.dueDate || req.body.priority || req.body.assignedTo || req.body.projectId) {
           return res.status(403).json({ message: 'Members can only update task status' });
        }
        task.status = req.body.status || task.status;
      } else {
        task.title = req.body.title || task.title;
        task.description = req.body.description !== undefined ? req.body.description : task.description;
        task.status = req.body.status || task.status;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
        task.assignedTo = req.body.assignedTo !== undefined ? req.body.assignedTo : task.assignedTo;
        task.projectId = req.body.projectId || task.projectId;
      }

      await task.save();
      const populatedTask = await Task.findByPk(task.id, {
        include: [{ model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }]
      });
      res.json(mapTask(populatedTask));
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a task (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment to a task
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Member' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to comment on this task' });
    }

    const comments = task.comments || [];
    comments.push({
      text,
      author: {
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar
      },
      createdAt: new Date()
    });

    task.comments = comments;
    await Task.update({ comments }, { where: { id: task.id } });

    const populatedTask = await Task.findByPk(task.id, {
      include: [{ model: User, as: 'Assignee', attributes: ['id', 'name', 'email'] }]
    });
    res.status(201).json(mapTask(populatedTask));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
