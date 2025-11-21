const tasks = [
  { id: 1, title: 'Mettre à jour le README', completed: false },
  { id: 2, title: 'Corriger le bug du formulaire', completed: true },
  { id: 3, title: 'Revoir les PRs en attente', completed: false },
  { id: 4, title: 'Nettoyer le CSS', completed: true }
];

const tasksListEl = document.querySelector('#tasks-list');
const emptyStateEl = document.querySelector('#empty-state');

let currentFilter = 'all';

function filterTasks(filter) {
  if (filter === 'active') return tasks.filter(task => !task.completed);
  if (filter === 'completed') return tasks.filter(task => task.completed);
  return tasks;
}

function getEmptyMessage(filter) {
  if (filter === 'active') return 'Aucune tâche en cours.';
  if (filter === 'completed') return 'Aucune tâche terminée.';
  return 'Aucune tâche à afficher.';
}

function renderTasks(filter = currentFilter) {
  const filteredTasks = filterTasks(filter);
  
  tasksListEl.innerHTML = '';
  
  if (filteredTasks.length === 0) {
    emptyStateEl.textContent = getEmptyMessage(filter);
    emptyStateEl.style.display = 'block';
    return;
  }
  
  emptyStateEl.style.display = 'none';
  
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('task-completed');
    
    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;
    
    li.appendChild(titleSpan);
    tasksListEl.appendChild(li);
  });
}

document.querySelector('#filter-all-btn').addEventListener('click', () => {
  currentFilter = 'all';
  renderTasks();
});

document.querySelector('#filter-active-btn').addEventListener('click', () => {
  currentFilter = 'active';
  renderTasks();
});

document.querySelector('#filter-completed-btn').addEventListener('click', () => {
  currentFilter = 'completed';
  renderTasks();
});

renderTasks();