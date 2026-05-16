const express = require('express');
const router = express.Router();
const { Project, User } = require('../models');
const { protect, admin } = require('../middleware/auth');

// Helper to map response for frontend
const mapProject = (project) => {
  const p = project.toJSON();
  return {
    ...p,
    _id: p.id,
    members: p.Members ? p.Members.map(m => ({ ...m, _id: m.id })) : [],
    createdBy: p.Creator ? { ...p.Creator, _id: p.Creator.id } : null
  };
};

// Get all projects
router.get('/', protect, async (req, res) => {
  try {
    const options = {
      include: [
        { model: User, as: 'Members', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'Creator', attributes: ['id', 'name'] }
      ]
    };

    if (req.user.role === 'Member') {
      // Find projects where user is a member
      const user = await User.findByPk(req.user.id, {
        include: [{ 
          model: Project, 
          as: 'Projects',
          include: [
            { model: User, as: 'Members', attributes: ['id', 'name', 'email'] },
            { model: User, as: 'Creator', attributes: ['id', 'name'] }
          ]
        }]
      });
      return res.json((user.Projects || []).map(mapProject));
    }

    const projects = await Project.findAll(options);
    res.json(projects.map(mapProject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a project (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description, members } = req.body;
    
    const project = await Project.create({
      title,
      description,
      createdBy: req.user.id
    });

    if (members && members.length > 0) {
      await project.setMembers(members);
    }

    const populated = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'Members', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'Creator', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json(mapProject(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a project (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const { title, description, members } = req.body;

    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    
    await project.save();

    if (members) {
      await project.setMembers(members);
    }

    const populated = await Project.findByPk(project.id, {
      include: [
        { model: User, as: 'Members', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'Creator', attributes: ['id', 'name'] }
      ]
    });
    res.json(mapProject(populated));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a project (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (project) {
      await project.destroy();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
