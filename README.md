# basic_template_mobile_desctop: установка и настройка

[![docs](https://img.shields.io/badge/docs-online-brightgreen)](https://extasss4106.github.io/electron_desctop_mobile_template/)
[![GitHub](https://img.shields.io/badge/github-repo-blue?logo=github)](https://github.com/ExtaSsS4106/electron_desctop_mobile_template)

Практическая инструкция для запуска проекта на компьютере, сборки Electron-приложения и Android APK, а также подключения Django API.

## 1. Как устроен проект

- `www/` — исходные HTML, CSS и JavaScript приложения.
- `templates/` — Nunjucks-шаблоны страниц.
- `build/precompile.js` — компилирует шаблоны в `www/templates.js`.
- `vite.config.js` — использует `www/` как вход и собирает приложение в `dist/`.
- `electron/main.js` и `electron/preload.js` — desktop-оболочка и защищённый мост IPC.
- `android/` — нативный Android-проект Capacitor.
- `capacitor.config.json` — задаёт `dist/` как каталог готовых web-ресурсов.

Корневой `main.js` не является настроенным Electron entry point. В `package.json` указано `"main": "electron/main.js"`, поэтому запускайте desktop через `npm start` или `electron .` после сборки.

## 2. Требования

### Для web и Electron

- Node.js 22 LTS и npm.
- На Linux для Electron нужны установленные системные библиотеки и графическая сессия.

### Для Android

- JDK 17.
- Android Studio и Android SDK 36.
- Android SDK Platform Tools (`adb`).
- Телефон или эмулятор; для телефона включите USB debugging, если ставите APK через `adb`.

## 3. Установка зависимостей

Из корня проекта:

```bash
npm install
```

Убедитесь, что команда выполняется в папке, где находится `package.json`.

## 4. Запуск для разработки

Подготовить шаблоны и запустить Vite:

```bash
npm run dev
```

Откройте адрес, который напечатает Vite (обычно `http://127.0.0.1:4173`). Эта команда поднимает web-версию, но сама по себе не запускает Electron.

## 5. Сборка и запуск desktop

Обычный запуск Electron выполняет сборку и открывает приложение:

```bash
npm start
```

Эквивалентные отдельные шаги:

```bash
npm run build
electron .
```

`npm run build` сначала генерирует `www/templates.js`, затем Vite собирает страницу, JavaScript-модули и CSS в `dist/`. `electron .` читает поле `main` из `package.json`; `electron/main.js` открывает `dist/index.html`.

На Linux при необходимости принудительно выбрать X11:

```bash
npm run build
electron --ozone-platform=x11 .
```

Изменения в `www/` или `templates/` должны попасть в desktop-сборку через `npm start` или повторный `npm run build`.

## 6. Настройка API

### Адрес API

В Android и обычном браузере резервный адрес задаётся в `www/index.html`:

```js
window.TASKFLOW_API_URL = 'http://192.168.1.180:8080/api';
```

Замените IP на LAN-адрес компьютера, где запущен backend. Не используйте `127.0.0.1` или `localhost` на физическом телефоне: там это адрес самого телефона.

В Electron сначала вызывается динамический поиск из `electron/main.js`: программа сканирует локальную IPv4-подсеть и проверяет `http://<IP>:8080/api/ping/`. Если адрес не найден, используется `TASKFLOW_API_URL`.

Для динамического поиска backend должен отвечать успешным HTTP-статусом на `/api/ping/`. Если этот endpoint отсутствует, измените путь проверки в `electron/main.js` на существующий health-check endpoint.

### Запуск Django для доступа по локальной сети

Запускайте Django не только на loopback-интерфейсе, например:

```bash
python manage.py runserver 0.0.0.0:8080
```

Узнайте LAN IPv4 адрес компьютера и укажите его в `www/index.html`. Компьютер и телефон должны быть подключены к одной доступной сети; firewall компьютера должен пропускать входящие соединения на порт `8080`.

Проверьте endpoint сначала на компьютере, затем в браузере телефона:

```text
http://<LAN-IP>:8080/api/ping/
```

Ожидается успешный ответ, например `200` и `{"message":"pong"}`. Если компьютерный браузер открывает endpoint, а телефон — нет, проверьте Wi-Fi isolation/VLAN, firewall и настройки роутера.

### CORS в Django для Android WebView

`ALLOWED_HOSTS` и CORS решают разные задачи. Для Android WebView backend должен разрешить origin приложения. Установите пакет:

```bash
pip install django-cors-headers
```

Добавьте `corsheaders` в `INSTALLED_APPS`, а middleware поставьте до `CommonMiddleware`:

```python
INSTALLED_APPS = [
    'corsheaders',
    # остальные приложения
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # остальные middleware
]

CORS_ALLOWED_ORIGINS = [
    'http://localhost',
]
```

Текущий `capacitor.config.json` задаёт `androidScheme: "http"`, поэтому ожидаемый Android origin обычно `http://localhost`. Если ошибка браузера показывает другой Origin, разрешите именно его. Перезапустите Django и проверьте preflight; ответ должен содержать `Access-Control-Allow-Origin`:

```bash
curl -i -X OPTIONS 'http://<LAN-IP>:8080/api/login/' \
  -H 'Origin: http://localhost' \
  -H 'Access-Control-Request-Method: POST' \
  -H 'Access-Control-Request-Headers: content-type'
```

Не оставляйте `CORS_ALLOW_ALL_ORIGINS = True` в production. `ALLOWED_HOSTS = ['*']` также не является безопасной production-настройкой.

### HTTP и HTTPS

В текущем `capacitor.config.json` настроены `androidScheme: "http"` и `cleartext: true`; Android manifest также разрешает cleartext traffic. Это подходит только для локальной разработки. Для production настройте HTTPS и пересмотрите разрешение незашифрованного HTTP.

## 7. Сборка Android APK

Из корня репозитория выполните последовательно:

```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

Готовый debug APK:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Установка на подключённый телефон:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Либо откройте нативный проект:

```bash
npx cap open android
```

После каждого изменения web-кода повторяйте `npm run build` и `npx cap sync android`, затем пересобирайте и переустанавливайте APK. `cap sync` копирует web-ресурсы из `dist/`, а не непосредственно из `www/`.

### Release APK/AAB

Для release используйте Android Studio: **Build → Generate Signed Bundle / APK**. Секретный keystore и его пароли не храните в репозитории. Для Google Play обычно публикуют подписанный AAB.

## 8. Хранение токенов

- Electron использует `window.authStorage` из preload; токены хранятся в зашифрованном `auth.json` в Electron `userData` через `safeStorage`.
- Android использует `@aparajita/capacitor-secure-storage`.
- Обычный браузер использует `sessionStorage` как отладочный fallback.

Не переносите Electron `preload.js` или Node.js API в web-клиент: браузерная часть работает через ограниченный API, который предоставляет адаптер `www/auth-storage.js`.

## 9. Диагностика

### Страница пустая в Electron

1. Запустите `npm start`, чтобы заново собрать `dist/`.
2. Убедитесь, что существует `dist/index.html`.
3. Откройте DevTools и проверьте Console на ошибки JavaScript и загрузки файлов.
4. Не запускайте корневой `main.js` напрямую: он не использует настроенный preload и не является entry point из `package.json`.

### В Android показана ошибка сети

1. Проверьте `www/index.html` и адрес в собранном `dist/index.html`.
2. Проверьте `android/app/src/main/assets/public/index.html`: там должны находиться ресурсы последнего `cap sync`.
3. Откройте `http://<LAN-IP>:8080/api/ping/` браузером телефона.
4. Проверьте, что Django слушает `0.0.0.0:8080`, CORS разрешает origin WebView, а firewall и Wi-Fi не изолируют клиентов.
5. После изменения web-кода выполните `npm run build`, `npx cap sync android`, пересоберите и переустановите APK.

### Изменения не появляются в APK

Проверьте весь цикл, а не только редактирование `www/`:

```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Если установлена старая копия приложения с тем же package ID, `adb install -r` обновит её. Для ручной установки выберите APK из `android/app/build/outputs/apk/debug/`.

## 10. Полезные команды

| Задача | Команда |
|---|---|
| Установить зависимости | `npm install` |
| Сгенерировать шаблоны | `npm run precompile` |
| Собрать production web assets | `npm run build` |
| Запустить Vite | `npm run dev` |
| Собрать и запустить Electron | `npm start` |
| Синхронизировать Android | `npx cap sync android` |
| Собрать Android debug APK | `cd android && ./gradlew assembleDebug` |
| Открыть Android Studio | `npx cap open android` |
