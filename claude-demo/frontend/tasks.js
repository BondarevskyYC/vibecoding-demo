const API_URL = 'http://localhost:8000/tasks/?limit=100';

// DOM refs
const btnRefresh   = document.getElementById('btn-refresh');
const taskCount    = document.getElementById('task-count');
const stateLoading = document.getElementById('state-loading');
const stateError   = document.getElementById('state-error');
const errorMsg     = document.getElementById('error-msg');
const stateTable   = document.getElementById('state-table');
const tasksBody    = document.getElementById('tasks-body');

// Helpers
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

// State switchers
function showLoading() {
  stateLoading.hidden = false;
  stateError.hidden   = true;
  stateTable.hidden   = true;
  taskCount.textContent = '';
}

function showError(msg) {
  stateLoading.hidden = true;
  stateError.hidden   = false;
  stateTable.hidden   = true;
  errorMsg.textContent = msg;
  taskCount.textContent = '';
}

function showTable(tasks) {
  stateLoading.hidden = true;
  stateError.hidden   = true;
  stateTable.hidden   = false;
  taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
  renderTasks(tasks);
}

// Render
function renderTasks(tasks) {
  if (tasks.length === 0) {
    tasksBody.innerHTML =
      '<tr><td colspan="5" class="empty-row">No tasks yet. Add one via <a href="http://localhost:8000/docs" target="_blank">/docs</a>.</td></tr>';
    return;
  }

  tasksBody.innerHTML = tasks.map((task, i) => {
    const isDone  = String(task.status).toLowerCase() === 'done';
    const badge   = isDone
      ? '<span class="badge badge-done">Done</span>'
      : '<span class="badge badge-pending">Pending</span>';

    return `<tr>
      <td class="col-num">${i + 1}</td>
      <td>${escapeHtml(task.title)}</td>
      <td class="col-desc">${escapeHtml(task.description)}</td>
      <td>${badge}</td>
      <td class="col-date">${formatDate(task.created_at)}</td>
    </tr>`;
  }).join('');
}

// Fetch
async function loadTasks() {
  btnRefresh.disabled = true;
  showLoading();

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tasks = await res.json();
    showTable(tasks);
  } catch {
    showError('Could not reach the API. Is the server running on http://localhost:8000?');
  } finally {
    btnRefresh.disabled = false;
  }
}

// Event wiring
btnRefresh.addEventListener('click', loadTasks);

// Init
loadTasks();
