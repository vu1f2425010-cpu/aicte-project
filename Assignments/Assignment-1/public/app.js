const API_URL = 'http://localhost:5001/api/tasks';
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const userInput = document.getElementById('userInput');
const loginBtn = document.getElementById('loginBtn');

let tasks = [];

async function loadTasks() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    tasks = data;
    renderTasks();
  } catch (error) {
    taskList.innerHTML = '<li class="empty-state">Unable to load tasks. Start the API server first.</li>';
  }
}

function renderTasks() {
  if (!tasks.length) {
    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one to begin.</li>';
    return;
  }

  taskList.innerHTML = tasks
    .map(
      task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task._id}">
          <div class="task-left">
            <input type="checkbox" ${task.completed ? 'checked' : ''} />
            <span class="task-text">${task.title}</span>
          </div>
          <div class="task-actions">
            <button class="complete-btn" type="button">${task.completed ? 'Undo' : 'Done'}</button>
            <button class="delete-btn" type="button">Delete</button>
          </div>
        </li>
      `
    )
    .join('');
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: 'Created from UI', completed: false })
    });

    taskInput.value = '';
    await loadTasks();
  } catch (error) {
    alert('Failed to add task.');
  }
});

taskList.addEventListener('click', async (event) => {
  const taskItem = event.target.closest('.task-item');
  if (!taskItem) return;

  const id = taskItem.dataset.id;

  if (event.target.classList.contains('delete-btn')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await loadTasks();
  }

  if (event.target.classList.contains('complete-btn')) {
    const task = tasks.find(item => item._id === id);
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    });
    await loadTasks();
  }
});

taskList.addEventListener('change', async (event) => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;

  const taskItem = checkbox.closest('.task-item');
  const id = taskItem.dataset.id;
  const task = tasks.find(item => item._id === id);

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !task.completed })
  });

  await loadTasks();
});

loginBtn.addEventListener('click', () => {
  const name = userInput.value.trim();
  if (!name) {
    alert('Please enter your name first.');
    return;
  }
  alert(`Welcome, ${name}!`);
});

loadTasks();
