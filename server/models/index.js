const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// Associations
User.hasMany(Project, { as: 'CreatedProjects', foreignKey: 'createdBy' });
Project.belongsTo(User, { as: 'Creator', foreignKey: 'createdBy' });

User.belongsToMany(Project, { through: 'ProjectMembers', as: 'Projects' });
Project.belongsToMany(User, { through: 'ProjectMembers', as: 'Members' });

Project.hasMany(Task, { as: 'Tasks', foreignKey: 'projectId' });
Task.belongsTo(Project, { as: 'Project', foreignKey: 'projectId' });

User.hasMany(Task, { as: 'Tasks', foreignKey: 'assignedTo' });
Task.belongsTo(User, { as: 'Assignee', foreignKey: 'assignedTo' });

module.exports = {
  sequelize,
  User,
  Project,
  Task
};
