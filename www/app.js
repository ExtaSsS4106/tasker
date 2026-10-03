import { auth } from "./auth-storage.js";
import { CONFIG } from "./conf.js";
const data = {
    appName: 'basic_template_mobile_desctop',
    title: 'Добро пожаловать',
    user: {},
    items: [
        { title: 'Первая задача' },
        { title: 'Вторая задача' },
    ],
};

let API_BASE = CONFIG.API_BASE;
let tokens = null;
let authenticated = false;
let authReady = false;
let startupError = '';



const routes = {
  '/': 'home.html',
  '/profile': 'profile.html',
  '/login': 'auth/login.html',
  '/register': 'auth/reg.html',
  '/profile/': 'profile.html',
  '/login/': 'auth/login.html',
  '/register/': 'auth/reg.html'
};

class ApiError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }

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

async function apiRequest(path, options = {}, accessToken = '') {
    if (!API_BASE) {
      throw new ApiError('Сервер API не найден в локальной сети', 0);
    }

    let response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
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
      const message = body && typeof body === 'object'
        ? Object.values(body).flat().join(' ')
        : '';
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

async function loadProfile() {
    try {
      return await apiRequest('/profile/', {}, tokens.access);
    } catch (error) {
      if (error.status !== 401 || !tokens.refresh) throw error;
      await refreshTokens();
      return apiRequest('/profile/', {}, tokens.access);
    }
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
        // Clear the local session even if the server is unreachable.
      }
    }
    await clearTokens();
    authenticated = false;
    data.user = {};
    location.hash = '#/login';
  }

window.taskflowAuth = { login, register, logout };
window.navigate = (path) => {
    location.hash = `#${path.startsWith('/') ? path : `/${path}`}`;
};

function getCurrentPath() {
  if (location.hash && location.hash.startsWith('#/')) {
    return location.hash.slice(1) || '/';
  }
  return location.pathname || '/';
}

function render() {
  if (!authReady) return;
  const path = getCurrentPath();
  const isPublicRoute = path === '/login' || path === '/login/' || path === '/register' || path === '/register/';
  if (!authenticated && !isPublicRoute) {
    location.hash = '#/login';
    return;
  }
  const template = routes[path] || 'home.html';
  const html = window.renderPage(template, data);
  const root = document.getElementById('root');
  root.innerHTML = html;

  root.querySelectorAll('script').forEach((oldScript) => {
    const newScript = document.createElement('script');
    newScript.textContent = oldScript.textContent;
    oldScript.replaceWith(newScript);
  });

  root.querySelectorAll('form[action="/logout/"]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      logout();
    });
  });

  if (path.includes('login') && startupError) {
    const alert = root.querySelector('#nonFieldAlert');
    const text = root.querySelector('#nonFieldText');
    if (alert && text) {
      text.textContent = startupError;
      alert.classList.remove('d-none');
      alert.classList.add('d-flex');
    }
  }
}

async function initialize() {
    try {
      tokens = await readTokens();
      if (tokens?.access) {
        data.user = await loadProfile();
        authenticated = true;
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