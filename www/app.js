import { auth } from "./auth-storage.js";
import { CONFIG } from "./conf.js";

// ======================= Состояние =======================
const data = {
    appName: 'Tasker',
    title: 'Добро пожаловать',
    user: {},
    tasks: [],
};

let tasks = [];
let currentFilter = 'all'; // all | active | completed
let searchQuery = '';

let API_BASE = CONFIG.API_BASE;
let tokens = null;
let authenticated = false;
let authReady = false;
let startupError = '';

// ======================= Роутинг =======================
const routes = {
    '/': 'home.html',
    '/profile': 'profile.html',
    '/login': 'auth/login.html',
    '/register': 'auth/reg.html',
    '/profile/': 'profile.html',
    '/login/': 'auth/login.html',
    '/register/': 'auth/reg.html',
};

const titles = {
    '/': 'Задачи',
    '/profile': 'Профиль',
    '/login': 'Вход',
    '/register': 'Регистрация',
};

// ======================= Ошибки =======================
class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// ======================= Токены =======================
async function readTokens() {
    return auth.load();
}

async function saveTokens(value) {
    tokens = value;
    await auth.save(value);
}

async function clearTokens() {
    tokens = null;
    await auth.clear();
}

// ======================= Базовый HTTP =======================
async function apiRequest(path, options = {}, accessToken = '') {
    if (!API_BASE) {
        throw new ApiError('Сервер API не найден в локальной сети', 0);
    }

    const isFormData = options.body instanceof FormData;

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...options.headers,
            },
        });
    } catch {
        throw new ApiError(`Не удалось подключиться к серверу ${API_BASE}`, 0);
    }

    const body = response.status === 204 || response.status === 205
        ? null
        : await response.json().catch(() => null);

    if (!response.ok) {
        let message = '';
        if (body && typeof body === 'object') {
            message = Object.values(body).flat().join(' ');
        }
        throw new ApiError(message || `Ошибка сервера (${response.status})`, response.status);
    }
    return body;
}

async function refreshTokens() {
    if (!tokens?.refresh) throw new ApiError('Сессия завершена', 401);
    const refreshed = await apiRequest('/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: tokens.refresh }),
    });
    await saveTokens({
        access: refreshed.access,
        refresh: refreshed.refresh || tokens.refresh,
    });
}

async function authenticatedRequest(path, options = {}) {
    try {
        return await apiRequest(path, options, tokens.access);
    } catch (error) {
        if (error.status === 401 && tokens?.refresh) {
            await refreshTokens();
            return await apiRequest(path, options, tokens.access);
        }
        if (error.status === 401) {
            await clearTokens();
            authenticated = false;
            location.hash = '#/login';
        }
        throw error;
    }
}

// ======================= Auth =======================
async function loadProfile() {
    return authenticatedRequest('/profile/');
}

async function login(username, password) {
    const result = await apiRequest('/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    await saveTokens({ access: result.access, refresh: result.refresh });
    data.user = await loadProfile();
    authenticated = true;
    startupError = '';
    await loadTasks();
}

async function register(user) {
    await apiRequest('/register/', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    await login(user.username, user.password);
}

async function logout() {
    if (tokens?.refresh) {
        try {
            await apiRequest('/logout/', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: tokens.refresh }),
            }, tokens.access);
        } catch {
            // чистим локальную сессию, даже если сервер недоступен
        }
    }
    await clearTokens();
    authenticated = false;
    data.user = {};
    tasks = [];
    data.tasks = [];
    location.hash = '#/login';
}

// ======================= Задачи: CRUD =======================
async function loadTasks() {
    try {
        tasks = await authenticatedRequest('/tasks/');
        data.tasks = getFilteredTasks();
        render();
    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
    }
}

async function createTask(taskData) {
    const isFormData = taskData instanceof FormData;
    return authenticatedRequest('/tasks/', {
        method: 'POST',
        body: isFormData ? taskData : JSON.stringify(taskData),
    });
}

async function createTaskWithImage(title, description, file, dueDate = null) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (file) formData.append('img', file);
    if (dueDate) formData.append('due_date', dueDate);
    return createTask(formData);
}

async function updateTask(taskId, updates) {
    return authenticatedRequest(`/tasks/${taskId}/`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

async function deleteTask(taskId) {
    return authenticatedRequest(`/tasks/${taskId}/`, {
        method: 'DELETE',
    });
}

async function completeTask(taskId) {
    return authenticatedRequest(`/tasks/${taskId}/`, {
        method: 'POST',
        body: JSON.stringify({ action: 'complete' }),
    });
}

// ======================= Фильтрация =======================
function getFilteredTasks() {
    let filtered = [...tasks];

    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(t => (t.title || '').toLowerCase().includes(q));
    }

    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
    });

    return filtered;
}

// ======================= Экспорт для inline-скриптов =======================
window.taskflowAuth = { login, register, logout };
window.logout = logout;
window.taskflowTasks = {
    loadTasks,
    createTask,
    createTaskWithImage,
    updateTask,
    deleteTask,
    completeTask,
    getFilteredTasks,
};
window.navigate = (path) => {
    location.hash = `#${path.startsWith('/') ? path : `/${path}`}`;
};

// ======================= Роутинг =======================
function getCurrentPath() {
    if (location.hash && location.hash.startsWith('#/')) {
        return location.hash.slice(1) || '/';
    }
    return location.pathname || '/';
}

function render() {
    if (!authReady) return;

    const path = getCurrentPath();
    const isPublicRoute =
        path === '/login' || path === '/login/' ||
        path === '/register' || path === '/register/';

    if (!authenticated && !isPublicRoute) {
        location.hash = '#/login';
        return;
    }

    data.title = titles[path] || data.appName;

    const template = routes[path] || 'home.html';
    const html = window.renderPage(template, data);
    const root = document.getElementById('root');
    root.innerHTML = html;

    // Пересоздаём <script> внутри вставленного HTML
    root.querySelectorAll('script').forEach((oldScript) => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        oldScript.replaceWith(newScript);
    });

    // Логаут-формы
    root.querySelectorAll('form[action="/logout/"]').forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            logout();
        });
    });

    // Ошибка старта на странице логина
    if (path.includes('login') && startupError) {
        const alert = root.querySelector('#nonFieldAlert');
        const text = root.querySelector('#nonFieldText');
        if (alert && text) {
            text.textContent = startupError;
            alert.classList.remove('d-none');
            alert.classList.add('d-flex');
        }
    }

    attachTaskHandlers(root);
}

function attachTaskHandlers(root) {
    // 1. Чекбокс: выполнено / не выполнено
    root.querySelectorAll('.task-toggle').forEach((checkbox) => {
        checkbox.addEventListener('change', async (e) => {
            const item = e.target.closest('[data-task-id]');
            const taskId = item?.dataset.taskId;
            if (!taskId) return;
            try {
                if (e.target.checked) {
                    await completeTask(taskId);
                } else {
                    await updateTask(taskId, { completed: false });
                }
                await loadTasks();
            } catch (error) {
                e.target.checked = !e.target.checked; // Откат при ошибке
                alert(error.message);
            }
        });
    });

    // 2. Удаление задачи
    root.querySelectorAll('.task-delete').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            const item = e.target.closest('[data-task-id]');
            const taskId = item?.dataset.taskId;
            if (!taskId) return;
            if (!confirm('Удалить эту задачу?')) return;
            try {
                await deleteTask(taskId);
                await loadTasks();
            } catch (error) {
                alert(error.message);
            }
        });
    });

    // 3. Открытие модального окна создания задачи
    const btnNew = root.querySelector('#btnNewTask');
    if (btnNew) {
        btnNew.addEventListener('click', () => {
            const modalEl = root.querySelector('#createTaskModal');
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        });
    }

    // 4. Обработка отправки формы создания задачи
    const form = root.querySelector('#createTaskForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const fileInput = form.querySelector('input[name="img"]');
            const file = fileInput.files.length > 0 ? fileInput.files[0] : null;

            try {
                await window.taskflowTasks.createTaskWithImage(
                    formData.get('title'),
                    formData.get('description'),
                    file,
                    formData.get('due_date') || null
                );
                
                // Закрываем модалку, очищаем форму и перезагружаем список
                const modalEl = root.querySelector('#createTaskModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();
                form.reset();
                await loadTasks();
            } catch (error) {
                alert('Ошибка создания: ' + error.message);
            }
        });
    }

    // 5. Поиск задач
    const searchInput = root.querySelector('#taskSearch');
    if (searchInput) {
        searchInput.value = searchQuery;
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            data.tasks = getFilteredTasks();
            render(); // Перерисовываем список
        });
    }

    // 6. Фильтры (Все / Активные / Выполненные)
    root.querySelectorAll('[data-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            root.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            // Добавляем нажатой
            btn.classList.add('active');
            
            currentFilter = btn.dataset.filter;
            data.tasks = getFilteredTasks();
            render(); // Перерисовываем список
        });
    });
}


// ======================= Инициализация =======================
async function initialize() {
    try {
        tokens = await readTokens();
        if (tokens?.access) {
            data.user = await loadProfile();
            authenticated = true;
            await loadTasks();
        }
    } catch (error) {
        if (error.status === 401) {
            await clearTokens();
        } else {
            startupError = error.message;
        }
    }
    authReady = true;
    render();
}

window.addEventListener('hashchange', render);
window.addEventListener('popstate', render);

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}

// Для отладки из DevTools
window.__debug = {
    loadTasks,
    loadProfile,
    login,
    logout,
    getTasks: () => tasks,
    getData: () => data,
};