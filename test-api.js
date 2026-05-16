async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@example.com', password: '123456' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token:', token.substring(0, 10) + '...');

    console.log('Fetching tasks...');
    const taskRes = await fetch('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const taskData = await taskRes.json();
    console.log('Tasks fetched. Count:', taskData.length || taskData);

    console.log('Fetching projects...');
    const projRes = await fetch('http://localhost:5000/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const projData = await projRes.json();
    console.log('Projects fetched. Count:', projData.length || projData);

  } catch (err) {
    console.error('Error:', err);
  }
}

test();
