import { auth } from "./auth-storage.js";
import { CONFIG } from "./conf.js";

/* ======================= Константы ======================= */

const SORTS = [
    { value: 'due_asc', label: 'Срок: ближайшие' },
    { value: 'due_desc', label: 'Срок: поздние' },
    { value: 'title_asc', label: 'Название: А → Я' },
    { value: 'title_desc', label: 'Название: Я → А' },
    { value: 'newest', label: 'Сначала новые' },
    { value: 'oldest', label: 'Сначала старые' },
];

const collator = new Intl.Collator('ru', { sensitivity: 'base', numeric: true });

/* ======================= Состояние ======================= */

const data = {
    appName: 'Tasker',
    title: 'Задачи',
    authenticated: false,
    user: {},
    tasks: [],
    stats: { total: 0, active: 0, completed: 0, overdue: 0, donePercent: 0 },
    filters: { all: 0, active: 0, completed: 0 },
    sorts: SORTS,
    currentFilter: 'all',
    currentSort: 'due_asc',
    searchQuery: '',
    hasSearch: false,
    selectedCount: 0,
    allSelected: false,
    loading: false,
    busy: false,
};

let tasks = [];
let selected = new Set();
let searchQuery = '';
let currentFilter = 'all';
let currentSort = 'due_asc';
let editingTaskId = null;

let API_BASE = CONFIG.API_BASE;
let tokens = null;
let authenticated = false;
let authReady = false;
let startupError = '';

let lastRender = '';
let pendingRender = 0;

/* ======================= Роутинг ======================= */

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

const PUBLIC_ROUTES = ['/login', '/login/', '/register', '/register/'];

/* ======================= Ошибки ======================= */

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// DRF отдаёт ошибки вложенной структурой — разворачиваем в читаемую строку
function flattenMessages(value) {
    if (value === null || value === undefined) return [];
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(flattenMessages);
    if (typeof value === 'object') return Object.values(value).flatMap(flattenMessages);
    return [String(value)];
}

/* ======================= Мелкие утилиты ======================= */

function pad2(n) {
    return String(n).padStart(2, '0');
}

function todayPart() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

// "2026-12-31", "2026-12-31T00:00:00Z" -> "2026-12-31"
function datePart(value) {
    if (!value) return '';
    const m = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
    return m ? m[1] : '';
}

function formatDue(part) {
    if (!part) return '';
    const d = new Date(`${part}T00:00:00`);
    if (Number.isNaN(d.getTime())) return part;
    return d.toLocaleDateString('ru-RU');
}

// Сервер принимает срок как ISO-метку (см. десктоп-клиент: 2026-12-31T00:00:00Z)
function toApiDate(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.includes('T')) return raw;
    const part = datePart(raw);
    return part ? `${part}T00:00:00Z` : raw;
}

function apiOrigin() {
    return API_BASE.replace(/\/api\/?$/, '');
}

// Аналог Api.absolute_url() из десктоп-клиента:
// http://... -> как есть, иначе приклеиваем origin API
function absoluteMediaUrl(url) {
    if (!url) return '';
    const value = String(url).trim();
    if (!value) return '';
    if (/^(https?:|data:|blob:)/i.test(value)) return value;
    const origin = apiOrigin();
    return value.startsWith('/') ? `${origin}${value}` : `${origin}/${value}`;
}

/* ======================= Токены ======================= */

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

/* ======================= Базовый HTTP ======================= */

async function apiRequest(path, options = {}, accessToken = '') {
    if (!API_BASE) {
        throw new ApiError('Сервер API не найден в локальной сети', 0);
    }

    const isFormData = options.body instanceof FormData;
    const hasBody = options.body !== undefined && options.body !== null;

    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                // Content-Type ставим только когда есть тело — иначе лишний CORS-preflight
                ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
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
        const message = body ? flattenMessages(body).join(' ') : '';
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

async function sessionExpired() {
    await clearTokens();
    authenticated = false;
    data.authenticated = false;
    data.user = {};
    redirect('/login');
}

async function authenticatedRequest(path, options = {}) {
    try {
        return await apiRequest(path, options, tokens?.access || '');
    } catch (error) {
        if (error.status === 401 && tokens?.refresh) {
            try {
                await refreshTokens();
            } catch (refreshError) {
                await sessionExpired();
                throw refreshError;
            }
            return await apiRequest(path, options, tokens?.access || '');
        }
        if (error.status === 401) {
            await sessionExpired();
        }
        throw error;
    }
}

/* ======================= Поиск API в локальной сети ======================= */

async function probeBase(base, timeout = 900) {
    if (!base) return false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        // GET /api/ отвечает 404 + {"error": "Not found"} — этого достаточно,
        // чтобы понять, что сервер жив (ping-endpoint'а на бэке нет).
        await fetch(`${base}/`, { method: 'GET', cache: 'no-store', signal: controller.signal });
        return true;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
    }
}

async function detectApiBase() {
    if (await probeBase(API_BASE)) return true;
    const bridge = window.authStorage;
    if (!bridge || typeof bridge.findApiBase !== 'function') return false;
    try {
        const found = await bridge.findApiBase();
        if (found) {
            API_BASE = found;
            console.info('API найден в локальной сети:', found);
            return true;
        }
    } catch (error) {
        console.warn('Автоопределение API не удалось:', error);
    }
    return false;
}

/* ======================= Auth ======================= */

function normalizeUser(profile) {
    const user = { ...(profile && typeof profile === 'object' ? profile : {}) };
    const first = String(user.first_name || '').trim();
    const last = String(user.last_name || '').trim();
    const username = String(user.username || '').trim();

    const base = first || username || '?';
    const second = last || (first ? '' : username);
    user.initial = (base.charAt(0) || '?').toUpperCase();
    user.initials = `${base.charAt(0)}${second ? second.charAt(0) : ''}`.toUpperCase() || '?';

    user.date_joined_label = '';
    if (user.date_joined) {
        const d = new Date(user.date_joined);
        user.date_joined_label = Number.isNaN(d.getTime())
            ? String(user.date_joined)
            : d.toLocaleDateString('ru-RU');
    }
    return user;
}

async function loadProfile() {
    return normalizeUser(await authenticatedRequest('/profile/'));
}

async function login(username, password) {
    const result = await apiRequest('/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
    await saveTokens({ access: result.access, refresh: result.refresh });
    data.user = await loadProfile();
    authenticated = true;
    data.authenticated = true;
    startupError = '';
    await loadTasks({ silent: true });
}

async function register(user) {
    await apiRequest('/register/', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    await login(user.username, user.password);
}

async function logout() {
    const refresh = tokens?.refresh;
    if (refresh) {
        try {
            await apiRequest('/logout/', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: refresh }),
            }, tokens?.access || '');
        } catch {
            // сервер может быть недоступен — локальную сессию чистим в любом случае
        }
    }
    await clearTokens();
    authenticated = false;
    data.authenticated = false;
    data.user = {};
    tasks = [];
    selected.clear();
    searchQuery = '';
    currentFilter = 'all';
    syncTaskData();
    redirect('/login');
}

/* ======================= Задачи: CRUD ======================= */

function normalizeTask(raw) {
    const src = raw && typeof raw === 'object' ? raw : {};
    return {
        ...src,
        id: src.id ?? src.pk ?? src.task_id,
        title: src.title || '',
        description: src.description || '',
        completed: src.completed === true || src.completed === 1 || src.completed === 'true',
        due_date: src.due_date || '',
        imgUrl: absoluteMediaUrl(src.img ?? src.image ?? src.image_url ?? src.photo ?? ''),
    };
}

async function loadTasks({ silent = false } = {}) {
    if (!silent) {
        data.loading = true;
        renderTasksUI();
    }
    try {
        const payload = await authenticatedRequest('/tasks/');
        tasks = (Array.isArray(payload) ? payload : []).map(normalizeTask);

        const alive = new Set(tasks.map((t) => String(t.id)));
        for (const id of [...selected]) {
            if (!alive.has(id)) selected.delete(id);
        }
    } catch (error) {
        console.error('Не удалось загрузить задачи:', error);
        notify(error.message || 'Не удалось загрузить задачи', 'danger');
    } finally {
        data.loading = false;
        syncTaskData();
        renderTasksUI();
    }
}

async function createTask(body) {
    const isFormData = body instanceof FormData;
    return authenticatedRequest('/tasks/', {
        method: 'POST',
        body: isFormData ? body : JSON.stringify(body),
    });
}

async function createTaskWithImage(title, description, file, dueDate = '') {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description || '');
    if (dueDate) formData.append('due_date', toApiDate(dueDate));
    if (file) formData.append('img', file);
    return createTask(formData);
}

async function updateTask(taskId, updates) {
    const isFormData = updates instanceof FormData;
    return authenticatedRequest(`/tasks/${taskId}/`, {
        method: 'PUT',
        body: isFormData ? updates : JSON.stringify(updates),
    });
}

async function deleteTask(taskId) {
    return authenticatedRequest(`/tasks/${taskId}/`, { method: 'DELETE' });
}

async function completeTask(taskId) {
    return authenticatedRequest(`/tasks/${taskId}/`, {
        method: 'POST',
        body: JSON.stringify({ action: 'complete' }),
    });
}

/* ======================= Выборка, сортировка, фильтры ======================= */

function cmpDone(a, b) {
    return Number(!!a.completed) - Number(!!b.completed);
}

// dir = 1 → по возрастанию (ближайшие впереди), -1 → по убыванию
function cmpDue(dir) {
    return (a, b) => {
        const da = a.duePart;
        const db = b.duePart;
        if (!da && !db) return 0;
        if (!da) return 1;  // без срока — в конец всегда
        if (!db) return -1;
        if (da === db) return 0;
        return da < db ? -dir : dir;
    };
}

function cmpTitle(dir) {
    return (a, b) => collator.compare(a.title || '', b.title || '') * dir;
}

// created_at приходит из Task.to_dict(); откатываемся на id, если поля нет
function cmpCreated(dir) {
    return (a, b) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        if (ca && cb && ca !== cb) return ca < cb ? -dir : dir;
        if (ca && !cb) return -dir;
        if (!ca && cb) return dir;
        return (Number(a.id) - Number(b.id)) * dir;
    };
}

function cmpId(dir) {
    return (a, b) => (Number(a.id) - Number(b.id)) * dir;
}

const COMPARATORS = {
    due_asc: [cmpDone, cmpDue(1), cmpTitle(1), cmpId(-1)],
    due_desc: [cmpDone, cmpDue(-1), cmpTitle(1), cmpId(-1)],
    title_asc: [cmpTitle(1), cmpId(-1)],
    title_desc: [cmpTitle(-1), cmpId(-1)],
    newest: [cmpCreated(-1), cmpId(-1)],
    oldest: [cmpCreated(1), cmpId(-1)],
};

function getFilteredTasks() {
    let list = tasks.slice();

    if (currentFilter === 'active') list = list.filter((t) => !t.completed);
    else if (currentFilter === 'completed') list = list.filter((t) => t.completed);

    const q = searchQuery.trim().toLowerCase();
    if (q) {
        list = list.filter(
            (t) =>
                String(t.title).toLowerCase().includes(q) ||
                String(t.description).toLowerCase().includes(q),
        );
    }

    const chain = COMPARATORS[currentSort] || COMPARATORS.due_asc;
    list.sort((a, b) => {
        for (const cmp of chain) {
            const r = cmp(a, b);
            if (r) return r;
        }
        return 0;
    });
    return list;
}

function refreshDerived() {
    const today = todayPart();
    let active = 0;
    let completed = 0;
    let overdue = 0;

    for (const t of tasks) {
        t.duePart = datePart(t.due_date);
        t.dueLabel = formatDue(t.duePart);
        t.overdue = !t.completed && !!t.duePart && t.duePart < today;
        t.dueToday = !t.completed && !!t.duePart && t.duePart === today;
        t.selected = selected.has(String(t.id));

        if (t.completed) {
            completed += 1;
        } else {
            active += 1;
            if (t.overdue) overdue += 1;
        }
    }

    data.stats = {
        total: tasks.length,
        active,
        completed,
        overdue,
        donePercent: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    };
    data.filters = { all: tasks.length, active, completed };
}

function syncTaskData() {
    refreshDerived();
    data.tasks = getFilteredTasks();
    data.selectedCount = selected.size;
    data.allSelected =
        data.tasks.length > 0 && data.tasks.every((t) => selected.has(String(t.id)));
    data.searchQuery = searchQuery;
    data.hasSearch = !!searchQuery;
    data.currentFilter = currentFilter;
    data.currentSort = currentSort;
    data.authenticated = authenticated;
}

/* ======================= UI: уведомления и подтверждения ======================= */

function notify(message, variant = 'primary') {
    const host = document.getElementById('toastHost');
    if (!host) {
        console.log(`[${variant}] ${message}`);
        return;
    }
    const el = document.createElement('div');
    el.className = `toast align-items-center text-bg-${variant} border-0`;
    el.setAttribute('role', 'alert');
    el.innerHTML =
        '<div class="d-flex"><div class="toast-body"></div>' +
        '<button type="button" class="btn-close btn-close-white me-2 m-auto" ' +
        'data-bs-dismiss="toast" aria-label="Закрыть"></button></div>';
    el.querySelector('.toast-body').textContent = message;
    host.appendChild(el);

    const B = window.bootstrap;
    if (!B) return;
    const toast = new B.Toast(el, { delay: 4000 });
    el.addEventListener('hidden.bs.toast', () => el.remove());
    toast.show();
}

function confirmDialog({ title, body, confirmText = 'Удалить', variant = 'danger' }) {
    return new Promise((resolve) => {
        const modalEl = document.getElementById('confirmModal');
        const okBtn = document.getElementById('confirmModalOk');
        const B = window.bootstrap;

        if (!modalEl || !okBtn || !B) {
            resolve(window.confirm(`${title}\n\n${body}`));
            return;
        }

        document.getElementById('confirmModalTitle').textContent = title;
        document.getElementById('confirmModalBody').textContent = body;
        okBtn.textContent = confirmText;
        okBtn.className = `btn btn-${variant} btn-sm`;

        const modal = B.Modal.getOrCreateInstance(modalEl);
        let settled = false;

        const finish = (value) => {
            if (settled) return;
            settled = true;
            okBtn.removeEventListener('click', onOk);
            modalEl.removeEventListener('hidden.bs.modal', onHidden);
            resolve(value);
        };
        const onOk = () => {
            finish(true);
            modal.hide();
        };
        const onHidden = () => finish(false);

        okBtn.addEventListener('click', onOk);
        modalEl.addEventListener('hidden.bs.modal', onHidden);
        modal.show();
    });
}

function showModal(el) {
    const B = window.bootstrap;
    if (!B || !el) return null;
    const instance = B.Modal.getOrCreateInstance(el);
    instance.show();
    return instance;
}

function hideModal(el) {
    const B = window.bootstrap;
    if (!B || !el) return;
    const inst = B.Modal.getInstance(el);
    if (inst) inst.hide();
}

function setFormBusy(form, busy) {
    const btn = form.querySelector('[type="submit"]');
    const spinner = form.querySelector('[data-form-spinner]');
    const label = form.querySelector('[data-form-label]');
    if (btn) btn.disabled = busy;
    if (spinner) spinner.classList.toggle('d-none', !busy);
    if (label) label.textContent = busy ? 'Сохраняем…' : (label.dataset.idle || 'Сохранить');
}

/* ======================= UI: предпросмотр изображения ======================= */

function wireImagePicker(formId, previewId, hintId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const input = form.elements.namedItem('img');
    const preview = document.getElementById(previewId);
    const hint = document.getElementById(hintId);
    if (!input || !preview) return;

    const idle = hint ? hint.dataset.idle || '' : '';

    const showUrl = (url, text) => {
        if (preview.src.startsWith('blob:')) URL.revokeObjectURL(preview.src);
        if (url) {
            preview.src = url;
            preview.classList.remove('d-none');
        } else {
            preview.removeAttribute('src');
            preview.classList.add('d-none');
        }
        if (hint) hint.textContent = text || idle;
    };

    input.addEventListener('change', () => {
        const file = input.files && input.files[0];
        if (!file) {
            showUrl('', idle);
            return;
        }
        showUrl(URL.createObjectURL(file), file.name);
    });

    form.resetImagePicker = () => {
        input.value = '';
        showUrl('', idle);
    };
    form.setPreviewUrl = (url) => showUrl(url, url ? 'Текущее изображение' : idle);
}

/* ======================= Рендер ======================= */

function disposeModals(root) {
    const B = window.bootstrap;
    if (B) {
        root.querySelectorAll('.modal').forEach((el) => {
            const inst = B.Modal.getInstance(el);
            if (inst) inst.dispose();
        });
    }
    document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
}

function rehydrateScripts(root) {
    root.querySelectorAll('script').forEach((old) => {
        const next = document.createElement('script');
        for (const attr of [...old.attributes]) next.setAttribute(attr.name, attr.value);
        if (old.src) next.src = old.src;
        else next.textContent = old.textContent;
        old.replaceWith(next);
    });
}

function getCurrentPath() {
    if (location.hash && location.hash.startsWith('#/')) {
        return location.hash.slice(1) || '/';
    }
    return location.pathname || '/';
}

function render(force = false) {
    if (pendingRender) {
        cancelAnimationFrame(pendingRender);
        pendingRender = 0;
    }
    if (!authReady) return;

    const path = getCurrentPath();
    const isPublic = PUBLIC_ROUTES.includes(path);

    if (!authenticated && !isPublic) {
        redirect('/login');
        return;
    }

    // Нормализуем URL: чистый pathname приводим к hash-роуту #/
    if (!location.hash) {
        location.hash = '#/';
        return;
    }

    const key = `${path}|${authenticated ? 1 : 0}`;
    if (!force && key === lastRender) return;
    lastRender = key;

    data.title = titles[path] || data.appName;
    document.title = `${data.title} — ${data.appName}`;
    syncTaskData();

    const root = document.getElementById('root');
    const template = routes[path] || 'home.html';

    disposeModals(root);
    root.innerHTML = window.renderPage(template, data);
    rehydrateScripts(root);

    attachShellHandlers(root);
    renderTasksUI();

    // Ошибка старта (нет соединения с API) — показываем на странице входа
    if (isPublic && path.includes('login') && startupError) {
        const alert = root.querySelector('#nonFieldAlert');
        const text = root.querySelector('#nonFieldText');
        if (alert && text) {
            text.textContent = startupError;
            alert.classList.remove('d-none');
            alert.classList.add('d-flex');
        }
    }
}

function scheduleRender() {
    if (pendingRender) return;
    pendingRender = requestAnimationFrame(() => {
        pendingRender = 0;
        render();
    });
}

function redirect(path) {
    const target = `#${path.startsWith('/') ? path : `/${path}`}`;
    lastRender = '';
    if (location.hash === target) render(true);
    else location.hash = target;
}

function syncControls(root) {
    root.querySelectorAll('[data-filter]').forEach((btn) => {
        const on = btn.dataset.filter === currentFilter;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', String(on));
    });

    const sort = root.querySelector('#taskSort');
    if (sort && sort.value !== currentSort) sort.value = currentSort;

    const search = root.querySelector('#taskSearch');
    if (search && document.activeElement !== search && search.value !== searchQuery) {
        search.value = searchQuery;
    }

    const clear = root.querySelector('#btnClearSearch');
    if (clear) clear.disabled = !searchQuery;
}

// Обновляет только статистику и список — не трогает поле поиска,
// поэтому фокус и курсор при наборе сохраняются.
function renderTasksUI() {
    const root = document.getElementById('root');
    if (!root) return;

    const statsRow = root.querySelector('#statsRow');
    if (statsRow) statsRow.innerHTML = window.renderPage('partials/stats.html', data);

    const listWrap = root.querySelector('#taskListWrap');
    if (listWrap) {
        listWrap.innerHTML = window.renderPage('partials/task_list.html', data);
        attachListHandlers(root);
    }

    syncControls(root);
}

/* ======================= Обработчики ======================= */

function attachShellHandlers(root) {
    const search = root.querySelector('#taskSearch');
    if (search) {
        search.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            syncTaskData();
            renderTasksUI();
        });
    }

    const clear = root.querySelector('#btnClearSearch');
    if (clear) {
        clear.addEventListener('click', () => {
            searchQuery = '';
            syncTaskData();
            renderTasksUI();
            const input = root.querySelector('#taskSearch');
            if (input) input.focus();
        });
    }

    const sort = root.querySelector('#taskSort');
    if (sort) {
        sort.addEventListener('change', (e) => {
            currentSort = e.target.value;
            syncTaskData();
            renderTasksUI();
        });
    }

    root.querySelectorAll('[data-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            syncTaskData();
            renderTasksUI();
        });
    });

    root.querySelectorAll('[data-export]').forEach((btn) => {
        btn.addEventListener('click', () => exportTasks(btn.dataset.export));
    });

    const btnNew = root.querySelector('#btnNewTask');
    if (btnNew) btnNew.addEventListener('click', openCreateModal);

    const createForm = root.querySelector('#createTaskForm');
    if (createForm) createForm.addEventListener('submit', onSubmitCreate);

    const editForm = root.querySelector('#editTaskForm');
    if (editForm) editForm.addEventListener('submit', onSubmitEdit);

    wireImagePicker('createTaskForm', 'createImgPreview', 'createImgHint');
    wireImagePicker('editTaskForm', 'editImgPreview', 'editImgHint');

    root.querySelectorAll('[data-logout]').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });

    root.querySelectorAll('form[action="/logout/"]').forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            logout();
        });
    });
}

function attachListHandlers(root) {
    const taskOf = (el) => {
        const item = el.closest('[data-task-id]');
        if (!item) return null;
        return tasks.find((t) => String(t.id) === String(item.dataset.taskId)) || null;
    };

    root.querySelectorAll('.task-select').forEach((box) => {
        box.addEventListener('change', (e) => {
            const task = taskOf(e.target);
            if (!task) return;
            const id = String(task.id);
            if (e.target.checked) selected.add(id);
            else selected.delete(id);
            syncTaskData();
            renderTasksUI();
        });
    });

    const selectAll = root.querySelector('#bulkSelectAll');
    if (selectAll) {
        selectAll.addEventListener('change', (e) => {
            data.tasks.forEach((t) => {
                const id = String(t.id);
                if (e.target.checked) selected.add(id);
                else selected.delete(id);
            });
            syncTaskData();
            renderTasksUI();
        });
    }

    root.querySelectorAll('.task-toggle').forEach((box) => {
        box.addEventListener('change', async (e) => {
            const task = taskOf(e.target);
            if (!task) return;
            const checked = e.target.checked;
            try {
                if (checked) await completeTask(task.id);
                else await updateTask(task.id, { completed: false });
                await loadTasks({ silent: true });
            } catch (error) {
                e.target.checked = !checked; // откат при ошибке
                notify(error.message, 'danger');
            }
        });
    });

    root.querySelectorAll('.task-edit').forEach((btn) => {
        btn.addEventListener('click', () => {
            const task = taskOf(btn);
            if (task) openEditModal(task);
        });
    });

    root.querySelectorAll('.task-delete').forEach((btn) => {
        btn.addEventListener('click', async () => {
            const task = taskOf(btn);
            if (!task) return;
            const ok = await confirmDialog({
                title: 'Удалить задачу?',
                body: `«${task.title || 'Без названия'}» будет удалена безвозвратно.`,
            });
            if (!ok) return;
            try {
                await deleteTask(task.id);
                selected.delete(String(task.id));
                notify('Задача удалена', 'success');
                await loadTasks({ silent: true });
            } catch (error) {
                notify(error.message, 'danger');
            }
        });
    });

    root.querySelectorAll('.task-image').forEach((img) => {
        img.addEventListener('click', () => openLightbox(img));
    });

    root.querySelectorAll('[data-bulk]').forEach((btn) => {
        btn.addEventListener('click', () => runBulk(btn.dataset.bulk));
    });

    const btnNewEmpty = root.querySelector('#btnNewTaskEmpty');
    if (btnNewEmpty) btnNewEmpty.addEventListener('click', openCreateModal);

    const btnReset = root.querySelector('#btnResetView');
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            searchQuery = '';
            currentFilter = 'all';
            syncTaskData();
            renderTasksUI();
        });
    }
}

/* ======================= Создание и редактирование ======================= */

function openCreateModal() {
    const modal = document.getElementById('createTaskModal');
    const form = document.getElementById('createTaskForm');
    if (!modal || !form) return;
    form.reset();
    if (form.resetImagePicker) form.resetImagePicker();
    showModal(modal);
    setTimeout(() => form.elements.namedItem('title')?.focus(), 320);
}

function openEditModal(task) {
    const modal = document.getElementById('editTaskModal');
    const form = document.getElementById('editTaskForm');
    if (!modal || !form) return;

    editingTaskId = task.id;
    form.reset();
    if (form.resetImagePicker) form.resetImagePicker();

    form.elements.namedItem('title').value = task.title || '';
    form.elements.namedItem('description').value = task.description || '';
    form.elements.namedItem('due_date').value = task.duePart || '';
    if (form.setPreviewUrl) form.setPreviewUrl(task.imgUrl || '');

    showModal(modal);
    setTimeout(() => form.elements.namedItem('title')?.focus(), 320);
}

function readForm(form) {
    const get = (name) => form.elements.namedItem(name);
    return {
        title: String(get('title')?.value || '').trim(),
        description: String(get('description')?.value || ''),
        dueDate: String(get('due_date')?.value || '').trim(),
        file: get('img')?.files?.[0] || null,
    };
}

function validateTaskForm(form) {
    const { title, description } = readForm(form);

    if (!title) {
        notify('Введите название задачи', 'warning');
        form.elements.namedItem('title')?.focus();
        return false;
    }
    if (title.length > 100) {
        notify('Название длиннее 100 символов — сервер отклонит', 'warning');
        form.elements.namedItem('title')?.focus();
        return false;
    }
    // Task.description = TextField() без blank → DRF требует непустое значение
    if (!description.trim()) {
        notify('Заполните описание — на сервере это обязательное поле', 'warning');
        form.elements.namedItem('description')?.focus();
        return false;
    }
    return true;
}

async function onSubmitCreate(e) {
    e.preventDefault();
    const form = e.target;
    if (!validateTaskForm(form)) return;

    const { title, description, dueDate, file } = readForm(form);

    setFormBusy(form, true);
    try {
        await createTaskWithImage(title, description, file, dueDate);
        hideModal(document.getElementById('createTaskModal'));
        form.reset();
        if (form.resetImagePicker) form.resetImagePicker();
        notify('Задача создана', 'success');
        await loadTasks({ silent: true });
    } catch (error) {
        notify(`Ошибка создания: ${error.message}`, 'danger');
    } finally {
        setFormBusy(form, false);
    }
}

async function onSubmitEdit(e) {
    e.preventDefault();
    const form = e.target;
    if (!editingTaskId) return;
    if (!validateTaskForm(form)) return;

    const { title, description, dueDate, file } = readForm(form);

    setFormBusy(form, true);
    try {
        if (file) {
            const fd = new FormData();
            fd.append('title', title);
            fd.append('description', description);
            fd.append('due_date', dueDate ? toApiDate(dueDate) : '');
            fd.append('img', file);
            await updateTask(editingTaskId, fd);
        } else {
            await updateTask(editingTaskId, {
                title,
                description,
                due_date: dueDate ? toApiDate(dueDate) : null,
            });
        }
        hideModal(document.getElementById('editTaskModal'));
        notify('Задача обновлена', 'success');
        await loadTasks({ silent: true });
    } catch (error) {
        notify(`Ошибка сохранения: ${error.message}`, 'danger');
    } finally {
        setFormBusy(form, false);
    }
}

function openLightbox(img) {
    const modal = document.getElementById('taskImageModal');
    if (!modal) return;
    const big = modal.querySelector('#taskImageBig');
    const cap = modal.querySelector('#taskImageCaption');
    if (big) {
        big.src = img.currentSrc || img.src;
        big.alt = img.alt || '';
    }
    if (cap) cap.textContent = img.dataset.caption || '';
    showModal(modal);
}

/* ======================= Массовые действия ======================= */

async function runBulk(action) {
    if (data.busy) return;

    if (action === 'clear') {
        selected.clear();
        syncTaskData();
        renderTasksUI();
        return;
    }

    const ids = [...selected];
    if (!ids.length) {
        notify('Сначала отметьте задачи чекбоксом', 'warning');
        return;
    }

    if (action === 'delete') {
        const ok = await confirmDialog({
            title: 'Удалить выбранные задачи?',
            body: `Будет удалено задач: ${ids.length}. Отменить это действие нельзя.`,
            confirmText: 'Удалить всё',
        });
        if (!ok) return;
    }

    data.busy = true;
    renderTasksUI();

    let done = 0;
    let failed = 0;
    try {
        for (const id of ids) {
            try {
                if (action === 'complete') await completeTask(id);
                else if (action === 'uncomplete') await updateTask(id, { completed: false });
                else if (action === 'delete') await deleteTask(id);
                done += 1;
            } catch {
                failed += 1;
            }
        }
    } finally {
        data.busy = false;
        selected.clear();
        await loadTasks({ silent: true });
    }

    const word = { complete: 'выполнены', uncomplete: 'возвращены в работу', delete: 'удалены' }[action] || 'обработаны';
    notify(
        failed ? `Готово: ${done}, ошибок: ${failed}` : `Успешно: ${done} — ${word}`,
        failed ? 'warning' : 'success',
    );
}

/* ======================= Экспорт ======================= */

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function exportTasks(format) {
    const list = getFilteredTasks();
    if (!list.length) {
        notify('Нечего экспортировать — список пуст', 'warning');
        return;
    }

    if (format === 'json') {
        const payload = list.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            completed: t.completed,
            due_date: t.due_date || null,
            img: t.imgUrl || null,
        }));
        downloadBlob(
            new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' }),
            `tasker-${todayPart()}.json`,
        );
    } else {
        const cols = ['id', 'title', 'description', 'completed', 'due_date', 'img'];
        const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const rows = list.map((t) =>
            [t.id, t.title, t.description, t.completed, t.duePart, t.imgUrl]
                .map(cell)
                .join(';'),
        );
        downloadBlob(
            new Blob(['\uFEFF' + [cols.join(';'), ...rows].join('\r\n')], {
                type: 'text/csv;charset=utf-8',
            }),
            `tasker-${todayPart()}.csv`,
        );
    }

    notify(`Экспортировано задач: ${list.length}`, 'success');
}

/* ======================= Инициализация ======================= */

async function initialize() {
    if (!window.bootstrap) {
        console.error('[Tasker] window.bootstrap не определён — модалки и уведомления не работают.');
    }
    const apiReachable = await detectApiBase();

    try {
        tokens = await readTokens();
        if (tokens?.access) {
            data.user = await loadProfile();
            authenticated = true;
            data.authenticated = true;
            await loadTasks({ silent: true });
        }
    } catch (error) {
        if (error.status === 401) {
            await clearTokens();
            tokens = null;
            authenticated = false;
        } else {
            startupError = error.message;
        }
    }

    if (!apiReachable && !authenticated && !startupError) {
        startupError =
            `Не удалось подключиться к API ${API_BASE}. ` +
            'Проверьте адрес в www/index.html и что Django запущен на 0.0.0.0:8080.';
    }

    syncTaskData();
    authReady = true;
    render(true);
}

window.addEventListener('hashchange', scheduleRender);
window.addEventListener('popstate', scheduleRender);

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initialize, { once: true });
} else {
    initialize();
}

/* ======================= Экспорт для inline-скриптов ======================= */

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
    exportTasks,
};
window.navigate = (path) => redirect(path.startsWith('/') ? path : `/${path}`);

// Для отладки из DevTools
window.__debug = {
    loadTasks,
    loadProfile,
    login,
    logout,
    getTasks: () => tasks,
    getData: () => data,
    getApiBase: () => API_BASE,
    getStartupError: () => startupError,
};
