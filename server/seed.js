const { sequelize, User, Project, Task } = require('./models');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const importData = async () => {
  try {
    // Sync database (force: true to clear tables)
    await sequelize.sync({ force: true });
    console.log('SQLite Database Synced for Seeding...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    // Create Users
    const usersData = [
      { name: 'Ansh Mahendru', email: 'ansh@taskpilot.com', password, role: 'Admin' },
      { name: 'John Member', email: 'john@taskpilot.com', password, role: 'Member' },
      { name: 'Sarah Developer', email: 'sarah@taskpilot.com', password, role: 'Member' },
      { name: 'Michael Designer', email: 'michael@taskpilot.com', password, role: 'Member' },
      { name: 'Emma Manager', email: 'emma@taskpilot.com', password, role: 'Member' },
      { name: 'Rahul Backend', email: 'rahul@taskpilot.com', password, role: 'Member' },
      { name: 'Priya Frontend', email: 'priya@taskpilot.com', password, role: 'Member' },
      { name: 'Alex DevOps', email: 'alex@taskpilot.com', password, role: 'Member' },
    ];

    const createdUsers = await Promise.all(usersData.map(u => User.create(u)));
    
    const admin = createdUsers[0];
    const member1 = createdUsers[1];
    const member2 = createdUsers[2];
    const member3 = createdUsers[3];
    const member4 = createdUsers[4];
    const member5 = createdUsers[5];
    const member6 = createdUsers[6];
    const member7 = createdUsers[7];

    // Create Projects
    const projectsData = [
      { title: 'TaskSync Platform', description: 'Next-gen enterprise collaboration suite.', createdBy: admin.id, members: [admin, member1, member2, member5, member6] },
      { title: 'Mobile App Redesign', description: 'Reimagining the mobile experience.', createdBy: admin.id, members: [admin, member3, member4, member7] },
      { title: 'Cloud Infrastructure', description: 'Scaling our services.', createdBy: admin.id, members: [admin, member5, member7] },
      { title: 'Marketing Campaign', description: 'Global launch strategy.', createdBy: admin.id, members: [admin, member2, member4, member6] },
      { title: 'Security Audit', description: 'Annual security compliance review.', createdBy: admin.id, members: [admin, member5, member1] },
    ];

    const createdProjects = [];
    for (const p of projectsData) {
      const project = await Project.create({
        title: p.title,
        description: p.description,
        createdBy: p.createdBy
      });
      await project.setMembers(p.members.map(m => m.id));
      createdProjects.push(project);
    }

    const p1 = createdProjects[0];
    const p2 = createdProjects[1];
    const p3 = createdProjects[2];
    const p4 = createdProjects[3];
    const p5 = createdProjects[4];

    // Create Tasks
    const tasksData = [
      { title: 'Implement JWT Auth', status: 'DONE', priority: 'High', assignedTo: member5.id, projectId: p1.id },
      { title: 'Real-time WebSockets', status: 'IN_PROGRESS', priority: 'High', assignedTo: member1.id, projectId: p1.id },
      { title: 'Database Optimization', status: 'TODO', priority: 'Medium', assignedTo: admin.id, projectId: p1.id },
      { title: 'Redis Caching', status: 'IN_PROGRESS', priority: 'Medium', assignedTo: admin.id, projectId: p3.id },
      { title: 'App Architecture Review', status: 'TODO', priority: 'High', assignedTo: admin.id, projectId: p1.id },
      { title: 'Team Sync: Q3 Goals', status: 'DONE', priority: 'Medium', assignedTo: admin.id, projectId: p4.id },
      { title: 'Security Patch Deployment', status: 'IN_PROGRESS', priority: 'High', assignedTo: admin.id, projectId: p5.id },
      { title: 'Infrastructure Monitoring', status: 'TODO', priority: 'Low', assignedTo: admin.id, projectId: p3.id },
      { title: 'New Member Onboarding', status: 'TODO', priority: 'Medium', assignedTo: admin.id, projectId: p2.id },
      { title: 'Social Media Kit', status: 'TODO', priority: 'Medium', assignedTo: member4.id, projectId: p4.id },
      { title: 'Email Blast V1', status: 'TODO', priority: 'High', assignedTo: member2.id, projectId: p4.id },
      { title: 'Penetration Testing', status: 'IN_PROGRESS', priority: 'High', assignedTo: member5.id, projectId: p5.id },
      { title: 'SSL Certificate Renewal', status: 'DONE', priority: 'Medium', assignedTo: member1.id, projectId: p5.id },
      { title: 'Mobile Push Notifications', status: 'TODO', priority: 'High', assignedTo: member7.id, projectId: p2.id },
      { title: 'Dockerize Backend', status: 'DONE', priority: 'Medium', assignedTo: member7.id, projectId: p3.id },
      { title: 'SEO Optimization', status: 'IN_PROGRESS', priority: 'Low', assignedTo: member6.id, projectId: p1.id },
      { title: 'Bug Fix: Login Timeout', status: 'TODO', priority: 'High', assignedTo: member6.id, projectId: p1.id },
      { title: 'API Documentation', status: 'TODO', priority: 'Medium', assignedTo: member1.id, projectId: p1.id },
    ];

    await Promise.all(tasksData.map(t => Task.create(t)));

    console.log('✅ Success: SQLite data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
