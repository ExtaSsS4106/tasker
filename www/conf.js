// Адрес Django API.
// Задаётся в www/index.html (window.TASKFLOW_API_URL) — для телефона/WebView
// указывайте LAN-IP компьютера, например http://192.168.1.192:8080/api.
const fromWindow =
    typeof window !== 'undefined' && window.TASKFLOW_API_URL
        ? String(window.TASKFLOW_API_URL)
        : '';

export const CONFIG = {
    API_BASE: (fromWindow || 'http://192.168.1.192:8080/api').replace(/\/+$/, ''),
};
