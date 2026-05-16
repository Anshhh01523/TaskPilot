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
      { title: 'Implement JWT Auth', description: 'Set up JSON Web Token authentication with refresh token rotation and secure cookie storage for the API layer.', status: 'DONE', priority: 'High', assignedTo: member5.id, projectId: p1.id, dueDate: new Date('2026-05-10'), comments: JSON.stringify([{ _id: 'c1', text: 'Auth flow is working end-to-end. Merging to main.', author: { name: 'Rahul Backend' } }]) },
      { title: 'Real-time WebSockets', description: 'Integrate Socket.io for live task updates, typing indicators, and presence detection across the platform.', status: 'IN_PROGRESS', priority: 'High', assignedTo: member1.id, projectId: p1.id, dueDate: new Date('2026-05-25'), comments: JSON.stringify([{ _id: 'c2', text: 'Event listeners are set up. Working on reconnection logic now.', author: { name: 'John Member' } }]) },
      { title: 'Database Optimization', description: 'Analyze slow queries, add composite indexes, and implement connection pooling to improve API response times under load.', status: 'TODO', priority: 'Medium', assignedTo: admin.id, projectId: p1.id, dueDate: new Date('2026-06-01') },
      { title: 'Redis Caching Layer', description: 'Implement Redis-based caching for frequently accessed endpoints including project lists, user profiles, and task summaries.', status: 'IN_PROGRESS', priority: 'Medium', assignedTo: admin.id, projectId: p3.id, dueDate: new Date('2026-05-28'), comments: JSON.stringify([{ _id: 'c3', text: 'Cache invalidation strategy decided — using TTL + event-based purge.', author: { name: 'Ansh Mahendru' } }]) },
      { title: 'App Architecture Review', description: 'Conduct a full architecture audit of the monorepo structure, identify coupling issues, and propose a clean modular boundary.', status: 'TODO', priority: 'High', assignedTo: admin.id, projectId: p1.id, dueDate: new Date('2026-06-05') },
      { title: 'Team Sync: Q3 Goals', description: 'Prepare and present Q3 OKRs for the engineering and design teams. Align deliverables with the product roadmap.', status: 'DONE', priority: 'Medium', assignedTo: admin.id, projectId: p4.id, dueDate: new Date('2026-05-08'), comments: JSON.stringify([{ _id: 'c4', text: 'Deck presented. All stakeholders aligned on priorities.', author: { name: 'Ansh Mahendru' } }, { _id: 'c5', text: 'Action items documented in Confluence.', author: { name: 'Emma Manager' } }]) },
      { title: 'Security Patch Deployment', description: 'Apply critical CVE patches to all Node.js dependencies and validate with automated regression tests before production rollout.', status: 'IN_PROGRESS', priority: 'High', assignedTo: admin.id, projectId: p5.id, dueDate: new Date('2026-05-22') },
      { title: 'Infrastructure Monitoring', description: 'Set up Grafana dashboards with Prometheus metrics for CPU, memory, request latency, and error rate tracking.', status: 'TODO', priority: 'Low', assignedTo: admin.id, projectId: p3.id, dueDate: new Date('2026-06-15') },
      { title: 'New Member Onboarding', description: 'Create a structured 2-week onboarding guide for new engineers including codebase walkthroughs, tooling setup, and shadowing schedule.', status: 'TODO', priority: 'Medium', assignedTo: admin.id, projectId: p2.id, dueDate: new Date('2026-06-10') },
      { title: 'Social Media Kit', description: 'Design branded social media templates for LinkedIn, Twitter, and Instagram covering product launch announcements.', status: 'TODO', priority: 'Medium', assignedTo: member4.id, projectId: p4.id, dueDate: new Date('2026-06-03') },
      { title: 'Email Blast V1', description: 'Draft and design the first email campaign targeting early adopters with feature highlights and a call-to-action for beta signup.', status: 'TODO', priority: 'High', assignedTo: member2.id, projectId: p4.id, dueDate: new Date('2026-05-30') },
      { title: 'Penetration Testing', description: 'Run OWASP ZAP and Burp Suite scans against staging APIs. Document all findings and prioritize by CVSS score.', status: 'IN_PROGRESS', priority: 'High', assignedTo: member5.id, projectId: p5.id, dueDate: new Date('2026-05-26'), comments: JSON.stringify([{ _id: 'c6', text: 'Found 2 medium-severity XSS vectors. Fixes in progress.', author: { name: 'Rahul Backend' } }]) },
      { title: 'SSL Certificate Renewal', description: 'Renew wildcard SSL certificates for *.taskpilot.com and configure auto-renewal via Certbot cron job.', status: 'DONE', priority: 'Medium', assignedTo: member1.id, projectId: p5.id, dueDate: new Date('2026-05-12') },
      { title: 'Mobile Push Notifications', description: 'Integrate Firebase Cloud Messaging for real-time push notifications on task assignments, comments, and deadline reminders.', status: 'TODO', priority: 'High', assignedTo: member7.id, projectId: p2.id, dueDate: new Date('2026-06-08') },
      { title: 'Dockerize Backend', description: 'Create multi-stage Dockerfile for the Node.js backend. Set up docker-compose for local dev with hot-reload support.', status: 'DONE', priority: 'Medium', assignedTo: member7.id, projectId: p3.id, dueDate: new Date('2026-05-14'), comments: JSON.stringify([{ _id: 'c7', text: 'Image size optimized to 180MB. Pushed to Docker Hub.', author: { name: 'Alex DevOps' } }]) },
      { title: 'SEO Optimization', description: 'Implement server-side rendering for landing pages, add structured data markup, and optimize Core Web Vitals scores.', status: 'IN_PROGRESS', priority: 'Low', assignedTo: member6.id, projectId: p1.id, dueDate: new Date('2026-06-02') },
      { title: 'Bug Fix: Login Timeout', description: 'Investigate and fix the intermittent 408 timeout error on the login endpoint caused by connection pool exhaustion under high load.', status: 'TODO', priority: 'High', assignedTo: member6.id, projectId: p1.id, dueDate: new Date('2026-05-20') },
      { title: 'API Documentation', description: 'Write comprehensive Swagger/OpenAPI 3.0 documentation for all REST endpoints with request/response examples and auth headers.', status: 'TODO', priority: 'Medium', assignedTo: member1.id, projectId: p1.id, dueDate: new Date('2026-06-12') },
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
