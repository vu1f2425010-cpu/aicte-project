const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const progressValueEl = document.getElementById('progressValue');

let tasks = JSON.parse(localStorage.getItem('studentTasks')) || [
  { id: 1, text: 'Complete AI assignment', completed: false },
  { id: 2, text: 'Prepare mini project demo', completed: true },
  { id: 3, text: 'Review lecture notes', completed: false }
];

function saveTasks() {
  localStorage.setItem('studentTasks', JSON.stringify(tasks));
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
  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="empty-state">No tasks yet. Add one to get started.</li>';
    updateDashboard();
    return;
  }

  taskList.innerHTML = tasks
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

renderTasks();
