const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const loginForm = document.getElementById('loginForm');
const loginScreen = document.getElementById('loginScreen');
const appShell = document.getElementById('appShell');
const userBadge = document.getElementById('userBadge');
const logoutBtn = document.getElementById('logoutBtn');
const filterButtons = document.querySelectorAll('.filter-btn');

const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const progressValueEl = document.getElementById('progressValue');

let currentUser = JSON.parse(localStorage.getItem('studentAuth')) || null;
let currentFilter = 'all';

let tasks = JSON.parse(localStorage.getItem('studentTasks')) || [
  { id: 1, text: 'Complete AI assignment', completed: false },
  { id: 2, text: 'Prepare mini project demo', completed: true },
  { id: 3, text: 'Review lecture notes', completed: false }
];

function saveTasks() {
  localStorage.setItem('studentTasks', JSON.stringify(tasks));
}

function saveAuth(user) {
  localStorage.setItem('studentAuth', JSON.stringify(user));
}

function getVisibleTasks() {
  if (currentFilter === 'pending') {
    return tasks.filter(task => !task.completed);
  }
  if (currentFilter === 'completed') {
    return tasks.filter(task => task.completed);
  }
  return tasks;
}

function updateDashboard() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
  progressValueEl.textContent = `${progress}%`;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No tasks in this filter.</li>';
    updateDashboard();
    return;
  }

  taskList.innerHTML = visibleTasks
    .map(
      task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="task-left">
            <input type="checkbox" ${task.completed ? 'checked' : ''} />
            <span class="task-text">${task.text}</span>
          </div>
          <div class="task-actions">
            <button class="delete-btn" type="button">Delete</button>
          </div>
        </li>
      `
    )
    .join('');

  updateDashboard();
}

function showApp() {
  loginScreen.classList.add('hidden');
  appShell.classList.remove('hidden');
  userBadge.textContent = `Welcome, ${currentUser?.name || 'Student'}`;
  renderTasks();
}

function showLogin() {
  appShell.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginForm.reset();
}

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!name || !password) {
    return;
  }

  currentUser = { name, password };
  saveAuth(currentUser);
  showApp();
});

logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('studentAuth');
  showLogin();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

taskForm.addEventListener('submit', event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskInput.focus();
});

taskList.addEventListener('click', event => {
  const deleteBtn = event.target.closest('.delete-btn');
  const taskItem = event.target.closest('.task-item');

  if (deleteBtn && taskItem) {
    const id = Number(taskItem.dataset.id);
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener('change', event => {
  const checkbox = event.target.closest('input[type="checkbox"]');
  if (!checkbox) return;

  const taskItem = checkbox.closest('.task-item');
  if (!taskItem) return;

  const id = Number(taskItem.dataset.id);
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: checkbox.checked } : task
  );

  saveTasks();
  renderTasks();
});

if (currentUser) {
  showApp();
} else {
  showLogin();
}
