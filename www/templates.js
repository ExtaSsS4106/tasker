(function (global) {
  var templates = {};
  var env = null;

  (function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/_layout.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "\n<div class=\"container\">\n    <div class=\"row justify-content-center align-items-center min-vh-100 py-5\">\n        <div class=\"col-12 col-sm-10 col-md-8 col-lg-10 col-xl-6\">\n            ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\n        </div>\n    </div>\n</div>\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
output += t_3;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 5;
var colno = 15;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 10;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/login.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/login.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Авторизация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                 style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-shield-lock fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Вход в аккаунт</h1>\n            <p class=\"text-body-secondary small mb-0\">Введите свои данные для входа</p>\n        </div>\n\n        <!-- Общая ошибка -->\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n             id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n\n        <!-- Успех -->\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n             id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Успешный вход! Перенаправляем…</div>\n        </div>\n\n        <form id=\"loginForm\" novalidate>\n\n            <!-- Логин -->\n            <div class=\"mb-3\">\n                <label for=\"username\" class=\"form-label\">Имя пользователя</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\"\n                           class=\"form-control\"\n                           id=\"username\"\n                           name=\"username\"\n                           placeholder=\"username\"\n                           autocomplete=\"username\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"usernameError\">\n                        Введите имя пользователя.\n                    </div>\n                </div>\n            </div>\n\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password\"\n                           name=\"password\"\n                           placeholder=\"••••••••\"\n                           minlength=\"6\"\n                           autocomplete=\"current-password\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 6 символов.\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-box-arrow-in-right me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Войти</span>\n            </button>\n        </form>\n\n        <div class=\"text-center\">\n            <span class=\"text-body-secondary small\">Нет аккаунта?</span>\n            <a href=\"#/register\" class=\"text-decoration-none small\">Зарегистрироваться</a>\n        </div>\n\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 93;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('loginForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const username      = document.getElementById('username');\n    const password      = document.getElementById('password');\n    const usernameError = document.getElementById('usernameError');\n    const passwordError = document.getElementById('passwordError');\n\n    const toggleBtn     = document.getElementById('togglePassword');\n    const toggleIcon    = document.getElementById('toggleIcon');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n\n    const successAlert  = document.getElementById('successAlert');\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    // ----- Показать/скрыть пароль -----\n    toggleBtn.addEventListener('click', () => {\n        const hidden = password.type === 'password';\n        password.type = hidden ? 'text' : 'password';\n        toggleIcon.classList.toggle('bi-eye', !hidden);\n        toggleIcon.classList.toggle('bi-eye-slash', hidden);\n        toggleBtn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n    });\n\n    // ----- Валидация -----\n    const validators = {\n        username() {\n            return username.value.trim() ? '' : 'Введите имя пользователя.';\n        },\n        password() {\n            if (!password.value) return 'Введите пароль.';\n            if (password.value.length < 6) return 'Пароль должен содержать минимум 6 символов.';\n            return '';\n        }\n    };\n\n    function setFieldState(input, errorEl, message) {\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const input   = name === 'username' ? username : password;\n        const errorEl = name === 'username' ? usernameError : passwordError;\n        const msg     = validators[name]();\n        setFieldState(input, errorEl, msg);\n        return !msg;\n    }\n\n    ['username', 'password'].forEach(name => {\n        const input = name === 'username' ? username : password;\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    function showError(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const okUser = validateField('username');\n        const okPass = validateField('password');\n        if (!okUser || !okPass) {\n            (!okUser ? username : password).focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Проверяем…';\n\n        try {\n            await window.taskflowAuth.login(username.value.trim(), password.value);\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 400);\n        } catch (error) {\n            showError(error.message || 'Не удалось войти');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Войти';\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/reg.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/reg.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Регистрация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                 style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-person-plus fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Создать аккаунт</h1>\n            <p class=\"text-body-secondary small mb-0\">Заполните форму, чтобы начать</p>\n        </div>\n\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n             id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Аккаунт создан! Перенаправляем…</div>\n        </div>\n\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n             id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n\n        <form id=\"registerForm\" novalidate>\n\n            <!-- Имя -->\n            <div class=\"mb-3\">\n                <label for=\"username\" class=\"form-label\">Имя пользователя</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\"\n                           class=\"form-control\"\n                           id=\"username\"\n                           name=\"username\"\n                           placeholder=\"username\"\n                           minlength=\"3\"\n                           maxlength=\"150\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"nameError\">\n                        Введите имя пользователя (минимум 3 символа).\n                    </div>\n                </div>\n            </div>\n\n            <!-- Email -->\n            <div class=\"mb-3\">\n                <label for=\"email\" class=\"form-label\">Email</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-envelope\"></i></span>\n                    <input type=\"email\"\n                           class=\"form-control\"\n                           id=\"email\"\n                           name=\"email\"\n                           placeholder=\"name@example.com\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"emailError\">\n                        Введите корректный email.\n                    </div>\n                </div>\n            </div>\n\n            <!-- Имя -->\n            <div class=\"row g-3 mb-3\">\n                <div class=\"col-12 col-sm-6\">\n                    <label for=\"firstName\" class=\"form-label\">Имя</label>\n                    <input type=\"text\" class=\"form-control\" id=\"firstName\"\n                           name=\"first_name\" placeholder=\"John\" maxlength=\"150\">\n                </div>\n                <div class=\"col-12 col-sm-6\">\n                    <label for=\"lastName\" class=\"form-label\">Фамилия</label>\n                    <input type=\"text\" class=\"form-control\" id=\"lastName\"\n                           name=\"last_name\" placeholder=\"Doe\" maxlength=\"150\">\n                </div>\n            </div>\n\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password\"\n                           name=\"password1\"\n                           placeholder=\"••••••••\"\n                           minlength=\"8\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 8 символов.\n                    </div>\n                </div>\n\n                <div class=\"progress mt-2\" style=\"height:6px;\" role=\"progressbar\"\n                     aria-label=\"Надёжность пароля\" aria-valuemin=\"0\" aria-valuemax=\"4\" aria-valuenow=\"0\">\n                    <div class=\"progress-bar\" id=\"strengthBar\" style=\"width:0%\"></div>\n                </div>\n                <div class=\"form-text\" id=\"strengthText\">Минимум 8 символов, буквы и цифры</div>\n            </div>\n\n            <!-- Подтверждение пароля -->\n            <div class=\"mb-3\">\n                <label for=\"password2\" class=\"form-label\">Подтвердите пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-shield-check\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password2\"\n                           name=\"password2\"\n                           placeholder=\"••••••••\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword2\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon2\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"password2Error\">\n                        Пароли не совпадают.\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-person-plus me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Зарегистрироваться</span>\n            </button>\n        </form>\n\n        <div class=\"text-center\">\n            <span class=\"text-body-secondary small\">Уже есть аккаунт?</span>\n            <a href=\"#/login\" class=\"text-decoration-none small\">Войти</a>\n        </div>\n\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 151;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('registerForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    function showNonField(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    const fields = {\n        username:  document.getElementById('username'),\n        email:     document.getElementById('email'),\n        password:  document.getElementById('password'),\n        password2: document.getElementById('password2'),\n    };\n\n    const errors = {\n        username:  document.getElementById('nameError'),\n        email:     document.getElementById('emailError'),\n        password:  document.getElementById('passwordError'),\n        password2: document.getElementById('password2Error'),\n    };\n\n    const strengthBar  = document.getElementById('strengthBar');\n    const strengthText = document.getElementById('strengthText');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n    const successAlert  = document.getElementById('successAlert');\n\n    // ----- Просмотр пароля -----\n    function setupToggle(btnId, iconId, input) {\n        const btn  = document.getElementById(btnId);\n        const icon = document.getElementById(iconId);\n        btn.addEventListener('click', () => {\n            const hidden = input.type === 'password';\n            input.type = hidden ? 'text' : 'password';\n            icon.classList.toggle('bi-eye', !hidden);\n            icon.classList.toggle('bi-eye-slash', hidden);\n            btn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n        });\n    }\n    setupToggle('togglePassword',  'toggleIcon',  fields.password);\n    setupToggle('togglePassword2', 'toggleIcon2', fields.password2);\n\n    // ----- Валидаторы -----\n    const validators = {\n        username() {\n            const v = fields.username.value.trim();\n            if (!v) return 'Введите имя пользователя.';\n            if (v.length < 3) return 'Минимум 3 символа.';\n            if (!/^[\\w.@+-]+$/.test(v)) return 'Только буквы, цифры и @/./+/-/_.';\n            return '';\n        },\n        email() {\n            const v = fields.email.value.trim();\n            if (!v) return 'Введите email.';\n            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Введите корректный email.';\n            return '';\n        },\n        password() {\n            const v = fields.password.value;\n            if (!v) return 'Введите пароль.';\n            if (v.length < 8) return 'Минимум 8 символов.';\n            if (!/[a-zA-Zа-яА-Я]/.test(v) || !/\\d/.test(v)) return 'Пароль должен содержать буквы и цифры.';\n            return '';\n        },\n        password2() {\n            const v = fields.password2.value;\n            if (!v) return 'Подтвердите пароль.';\n            if (v !== fields.password.value) return 'Пароли не совпадают.';\n            return '';\n        }\n    };\n\n    function setFieldState(name, message) {\n        const input   = fields[name];\n        const errorEl = errors[name];\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            if (errorEl) errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const msg = validators[name]();\n        setFieldState(name, msg);\n        return !msg;\n    }\n\n    // ----- Индикатор надёжности -----\n    function calcStrength(pwd) {\n        let score = 0;\n        if (pwd.length >= 8) score++;\n        if (pwd.length >= 12) score++;\n        if (/[a-z]/.test(pwd) && /[A-ZА-Я]/.test(pwd)) score++;\n        if (/\\d/.test(pwd)) score++;\n        if (/[^A-Za-zА-Яа-я0-9]/.test(pwd)) score++;\n        return Math.min(score, 4);\n    }\n\n    function updateStrength() {\n        const pwd = fields.password.value;\n        const score = calcStrength(pwd);\n        const colors = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];\n        const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Надёжный'];\n        const widths = [0, 25, 50, 75, 100];\n\n        strengthBar.className = 'progress-bar ' + colors[score];\n        strengthBar.style.width = widths[score] + '%';\n        strengthText.textContent = pwd\n            ? 'Надёжность: ' + labels[score]\n            : 'Минимум 8 символов, буквы и цифры';\n    }\n\n    // ----- Слушатели -----\n    ['username', 'email', 'password', 'password2'].forEach(name => {\n        const input = fields[name];\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    fields.password.addEventListener('input', () => {\n        updateStrength();\n        if (fields.password2.value) validateField('password2');\n    });\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const names = ['username', 'email', 'password', 'password2'];\n        const results = names.map(validateField);\n        const firstInvalid = names.find((n, i) => !results[i]);\n\n        if (firstInvalid) {\n            fields[firstInvalid].focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Создаём аккаунт…';\n\n        try {\n            await window.taskflowAuth.register({\n                username: fields.username.value.trim(),\n                email: fields.email.value.trim(),\n                first_name: document.getElementById('firstName').value.trim(),\n                last_name: document.getElementById('lastName').value.trim(),\n                password: fields.password.value,\n                password2: fields.password2.value,\n            });\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 500);\n        } catch (error) {\n            showNonField(error.message || 'Не удалось зарегистрироваться');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Зарегистрироваться';\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["base.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("navbar.html", false, "base.html", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
callback(null,t_1);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n<main class=\"container py-4\">\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
output += t_5;
output += "\n</main>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["home.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "home.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"row g-4\">\n\n    ";
output += "\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm\">\n            <div class=\"card-body p-4\">\n                <div class=\"d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3\">\n                    <div>\n                        <h1 class=\"h3 mb-1\">Привет, ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "!</h1>\n                        <p class=\"text-body-secondary mb-0\">Вот ваши задачи на сегодня.</p>\n                    </div>\n                    <button class=\"btn btn-primary flex-shrink-0\" type=\"button\" id=\"btnNewTask\">\n                        <i class=\"bi bi-plus-lg me-1\"></i>Новая задача\n                    </button>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    ";
output += "\n    <div class=\"col-12\" id=\"statsRow\">\n        ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/stats.html", false, "home.html", false, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
callback(null,t_6);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
callback(null,t_8);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n    </div>\n\n    ";
output += "\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm\">\n            <div class=\"card-body\">\n                <div class=\"d-flex flex-column flex-xl-row gap-3 align-items-xl-center\">\n\n                    <div class=\"input-group input-group-sm flex-grow-1\" style=\"max-width:420px;\">\n                        <span class=\"input-group-text\"><i class=\"bi bi-search\"></i></span>\n                        <input type=\"search\" class=\"form-control\" id=\"taskSearch\"\n                               placeholder=\"Поиск по названию и описанию...\"\n                               value=\"";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "searchQuery"), env.opts.autoescape);
output += "\" autocomplete=\"off\">\n                        <button class=\"btn btn-outline-secondary\" type=\"button\"\n                                id=\"btnClearSearch\" title=\"Очистить поиск\"\n                                ";
if(!runtime.contextOrFrameLookup(context, frame, "hasSearch")) {
output += "disabled";
;
}
output += ">\n                            <i class=\"bi bi-x-lg\"></i>\n                        </button>\n                    </div>\n\n                    <div class=\"btn-group btn-group-sm\" role=\"group\" aria-label=\"Фильтр задач\">\n                        <button type=\"button\" class=\"btn btn-outline-primary\" data-filter=\"all\">\n                            Все <span class=\"badge text-bg-secondary\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "filters")),"all"), env.opts.autoescape);
output += "</span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-outline-primary\" data-filter=\"active\">\n                            Активные <span class=\"badge text-bg-secondary\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "filters")),"active"), env.opts.autoescape);
output += "</span>\n                        </button>\n                        <button type=\"button\" class=\"btn btn-outline-primary\" data-filter=\"completed\">\n                            Выполненные <span class=\"badge text-bg-secondary\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "filters")),"completed"), env.opts.autoescape);
output += "</span>\n                        </button>\n                    </div>\n\n                    <div class=\"d-flex gap-2 flex-wrap ms-xl-auto\">\n                        <div class=\"input-group input-group-sm\" style=\"max-width:240px;\">\n                            <span class=\"input-group-text\"><i class=\"bi bi-arrow-down-up\"></i></span>\n                            <select class=\"form-select form-select-sm\" id=\"taskSort\" aria-label=\"Сортировка задач\">\n                                ";
frame = frame.push();
var t_12 = runtime.contextOrFrameLookup(context, frame, "sorts");
if(t_12) {t_12 = runtime.fromIterator(t_12);
var t_11 = t_12.length;
for(var t_10=0; t_10 < t_12.length; t_10++) {
var t_13 = t_12[t_10];
frame.set("s", t_13);
frame.set("loop.index", t_10 + 1);
frame.set("loop.index0", t_10);
frame.set("loop.revindex", t_11 - t_10);
frame.set("loop.revindex0", t_11 - t_10 - 1);
frame.set("loop.first", t_10 === 0);
frame.set("loop.last", t_10 === t_11 - 1);
frame.set("loop.length", t_11);
output += "\n                                <option value=\"";
output += runtime.suppressValue(runtime.memberLookup((t_13),"value"), env.opts.autoescape);
output += "\" ";
if(runtime.memberLookup((t_13),"value") == runtime.contextOrFrameLookup(context, frame, "currentSort")) {
output += "selected";
;
}
output += ">";
output += runtime.suppressValue(runtime.memberLookup((t_13),"label"), env.opts.autoescape);
output += "</option>\n                                ";
;
}
}
frame = frame.pop();
output += "\n                            </select>\n                        </div>\n\n                        <div class=\"dropdown\">\n                            <button class=\"btn btn-sm btn-outline-secondary dropdown-toggle\" type=\"button\"\n                                    data-bs-toggle=\"dropdown\" aria-expanded=\"false\">\n                                <i class=\"bi bi-download me-1\"></i>Экспорт\n                            </button>\n                            <ul class=\"dropdown-menu dropdown-menu-end\">\n                                <li>\n                                    <button class=\"dropdown-item\" type=\"button\" data-export=\"json\">\n                                        <i class=\"bi bi-filetype-json me-2\"></i>JSON\n                                    </button>\n                                </li>\n                                <li>\n                                    <button class=\"dropdown-item\" type=\"button\" data-export=\"csv\">\n                                        <i class=\"bi bi-filetype-csv me-2\"></i>CSV для Excel\n                                    </button>\n                                </li>\n                            </ul>\n                        </div>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n    </div>\n\n    ";
output += "\n    <div class=\"col-12\" id=\"taskListWrap\">\n        ";
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("partials/task_list.html", false, "home.html", false, function(t_15,t_14) {
if(t_15) { cb(t_15); return; }
callback(null,t_14);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_17,t_16) {
if(t_17) { cb(t_17); return; }
callback(null,t_16);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n    </div>\n</div>\n\n";
output += "\n<div class=\"modal fade\" id=\"createTaskModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered modal-lg\">\n        <div class=\"modal-content rounded-4\">\n            <form id=\"createTaskForm\" novalidate>\n                <div class=\"modal-header border-0 pb-0\">\n                    <h5 class=\"modal-title fs-6 fw-semibold\">\n                        <i class=\"bi bi-plus-lg me-2\"></i>Новая задача\n                    </h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n                </div>\n\n                <div class=\"modal-body\">\n                    <div class=\"mb-3\">\n                        <label class=\"form-label fw-semibold\" for=\"createTitle\">Название *</label>\n                        <input type=\"text\" class=\"form-control\" id=\"createTitle\"\n                               name=\"title\" maxlength=\"100\" required\n                               placeholder=\"Что нужно сделать?\">\n                        <div class=\"form-text\">До 100 символов — ограничение модели Task на сервере.</div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label class=\"form-label\" for=\"createDesc\">Описание *</label>\n                        <textarea class=\"form-control\" id=\"createDesc\" name=\"description\"\n                                  rows=\"3\" required\n                                  placeholder=\"Детали задачи...\"></textarea>\n                        <div class=\"form-text\">Обязательное поле: на сервере это TextField без blank.</div>\n                    </div>\n\n                    <div class=\"row g-3\">\n                        <div class=\"col-12 col-sm-6\">\n                            <label class=\"form-label\" for=\"createDue\">Срок выполнения</label>\n                            <input type=\"date\" class=\"form-control\" id=\"createDue\" name=\"due_date\">\n                        </div>\n                        <div class=\"col-12 col-sm-6\">\n                            <label class=\"form-label\" for=\"createImg\">Изображение</label>\n                            <input type=\"file\" class=\"form-control\" id=\"createImg\"\n                                   name=\"img\" accept=\"image/*\">\n                        </div>\n                    </div>\n\n                    <div class=\"d-flex align-items-center gap-3 mt-3\">\n                        <img id=\"createImgPreview\" class=\"img-preview d-none\" alt=\"Предпросмотр\">\n                        <span class=\"small text-body-secondary\" id=\"createImgHint\"\n                              data-idle=\"Изображение не выбрано\">Изображение не выбрано</span>\n                    </div>\n                </div>\n\n                <div class=\"modal-footer border-0 pt-0\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" data-bs-dismiss=\"modal\">Отмена</button>\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\">\n                        <span class=\"spinner-border spinner-border-sm me-2 d-none\" data-form-spinner></span>\n                        <span data-form-label data-idle=\"Создать\">Создать</span>\n                    </button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n\n";
output += "\n<div class=\"modal fade\" id=\"editTaskModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered modal-lg\">\n        <div class=\"modal-content rounded-4\">\n            <form id=\"editTaskForm\" novalidate>\n                <div class=\"modal-header border-0 pb-0\">\n                    <h5 class=\"modal-title fs-6 fw-semibold\">\n                        <i class=\"bi bi-pencil me-2\"></i>Редактировать задачу\n                    </h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n                </div>\n\n                <div class=\"modal-body\">\n                    <div class=\"mb-3\">\n                        <label class=\"form-label fw-semibold\" for=\"editTitle\">Название *</label>\n                        <input type=\"text\" class=\"form-control\" id=\"editTitle\"\n                               name=\"title\" maxlength=\"100\" required>\n                        <div class=\"form-text\">До 100 символов — ограничение модели Task на сервере.</div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label class=\"form-label\" for=\"editDesc\">Описание *</label>\n                        <textarea class=\"form-control\" id=\"editDesc\" name=\"description\"\n                                  rows=\"3\" required></textarea>\n                        <div class=\"form-text\">Обязательное поле: на сервере это TextField без blank.</div>\n                    </div>\n\n                    <div class=\"row g-3\">\n                        <div class=\"col-12 col-sm-6\">\n                            <label class=\"form-label\" for=\"editDue\">Срок выполнения</label>\n                            <input type=\"date\" class=\"form-control\" id=\"editDue\" name=\"due_date\">\n                        </div>\n                        <div class=\"col-12 col-sm-6\">\n                            <label class=\"form-label\" for=\"editImg\">Заменить изображение</label>\n                            <input type=\"file\" class=\"form-control\" id=\"editImg\"\n                                   name=\"img\" accept=\"image/*\">\n                        </div>\n                    </div>\n\n                    <div class=\"d-flex align-items-center gap-3 mt-3\">\n                        <img id=\"editImgPreview\" class=\"img-preview d-none\" alt=\"Предпросмотр\">\n                        <span class=\"small text-body-secondary\" id=\"editImgHint\"\n                              data-idle=\"Изображение не выбрано\">Изображение не выбрано</span>\n                    </div>\n                </div>\n\n                <div class=\"modal-footer border-0 pt-0\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" data-bs-dismiss=\"modal\">Отмена</button>\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\">\n                        <span class=\"spinner-border spinner-border-sm me-2 d-none\" data-form-spinner></span>\n                        <span data-form-label data-idle=\"Сохранить\">Сохранить</span>\n                    </button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n\n";
output += "\n<div class=\"modal fade\" id=\"taskImageModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable\">\n        <div class=\"modal-content bg-transparent border-0\">\n            <div class=\"modal-header border-0 pb-0\">\n                <h5 class=\"modal-title fs-6 text-white text-truncate\" id=\"taskImageCaption\"></h5>\n                <button type=\"button\" class=\"btn-close btn-close-white\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n            </div>\n            <div class=\"modal-body text-center p-0\">\n                <img id=\"taskImageBig\" class=\"img-fluid rounded-4\" alt=\"\">\n            </div>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["navbar.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<nav class=\"navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top\">\n    <div class=\"container-fluid px-3 px-lg-4\">\n\n        <!-- ЛОГО -->\n        <a class=\"navbar-brand fw-bold d-flex align-items-center gap-2 me-auto me-lg-0\" href=\"#/\">\n            <span class=\"d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3\"\n                  style=\"width:32px;height:32px;\">\n                <i class=\"bi bi-kanban\"></i>\n            </span>\n            <span>";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
output += "</span>\n        </a>\n\n        <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\"\n                data-bs-target=\"#navMain\" aria-controls=\"navMain\"\n                aria-expanded=\"false\" aria-label=\"Показать меню\">\n            <span class=\"navbar-toggler-icon\"></span>\n        </button>\n\n        <!-- СВОРАЧИВАЕМАЯ ЧАСТЬ -->\n        <div class=\"collapse navbar-collapse\" id=\"navMain\">\n            <div class=\"d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center\n                        gap-2 ms-lg-3 mt-3 mt-lg-0\">\n\n                <!-- ==================== АВТОРИЗОВАН ==================== -->\n                <div class=\"d-flex flex-row justify-content-end align-items-center gap-2\" id=\"userBlock\">\n\n                    <!-- Тема -->\n                    <button type=\"button\"\n                            class=\"btn btn-outline-secondary border-0\"\n                            id=\"themeToggle\" aria-label=\"Переключить тему\">\n                        <i class=\"bi bi-moon-stars\" id=\"themeIcon\"></i>\n                    </button>\n\n                    <!-- Профиль -->\n                    <div class=\"dropdown\">\n                        <button class=\"btn p-0 border-0 d-flex align-items-center gap-2\"\n                                type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"\n                                aria-label=\"Профиль\">\n                            <span id=\"avatar\"\n                                  class=\"avatar-circle bg-primary bg-opacity-25 text-primary fw-bold rounded-circle\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"initial"), env.opts.autoescape);
output += "</span>\n                        </button>\n\n                        <ul class=\"dropdown-menu dropdown-menu-end shadow rounded-4 p-2 dropdown-profile\"\n                            style=\"width:min(240px, calc(100vw - 1rem));\">\n                            <li class=\"px-3 py-2\">\n                                <div id=\"username\" class=\"fw-semibold text-truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "</div>\n                                <div id=\"email\" class=\"text-body-secondary small text-truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"email") || "—", env.opts.autoescape);
output += "</div>\n                            </li>\n                            <li><hr class=\"dropdown-divider\"></li>\n                            <li>\n                                <a id=\"account\" class=\"dropdown-item rounded-3\" href=\"#/profile\">\n                                    <i class=\"bi bi-person me-2\"></i>Профиль\n                                </a>\n                            </li>\n                            <li><hr class=\"dropdown-divider\"></li>\n                            <li>\n                                <a class=\"dropdown-item rounded-3 text-danger\" href=\"#/login\" data-logout>\n                                    <i id=\"logout\" class=\"bi bi-box-arrow-right me-2\"></i>Выйти\n                                </a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n    </div>\n</nav>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["partials/stats.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"total") > 0) {
output += "\n<div class=\"row g-3\">\n    <div class=\"col-6 col-xl-3\">\n        <div class=\"card border-0 shadow-sm h-100\">\n            <div class=\"card-body text-center py-3\">\n                <div class=\"fs-3 fw-bold text-primary\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"total"), env.opts.autoescape);
output += "</div>\n                <div class=\"small text-body-secondary\">Всего задач</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-xl-3\">\n        <div class=\"card border-0 shadow-sm h-100\">\n            <div class=\"card-body text-center py-3\">\n                <div class=\"fs-3 fw-bold text-info\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"active"), env.opts.autoescape);
output += "</div>\n                <div class=\"small text-body-secondary\">Активные</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-xl-3\">\n        <div class=\"card border-0 shadow-sm h-100\">\n            <div class=\"card-body text-center py-3\">\n                <div class=\"fs-3 fw-bold text-success\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"completed"), env.opts.autoescape);
output += "</div>\n                <div class=\"small text-body-secondary\">Выполненные</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-xl-3\">\n        <div class=\"card border-0 shadow-sm h-100\">\n            <div class=\"card-body text-center py-3\">\n                <div class=\"fs-3 fw-bold ";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"overdue") > 0) {
output += "text-danger";
;
}
else {
output += "text-body-secondary";
;
}
output += "\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"overdue"), env.opts.autoescape);
output += "</div>\n                <div class=\"small text-body-secondary\">Просроченные</div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class=\"card border-0 shadow-sm mt-3\">\n    <div class=\"card-body py-3\">\n        <div class=\"d-flex justify-content-between small mb-2\">\n            <span class=\"text-body-secondary\">Прогресс выполнения</span>\n            <span class=\"fw-semibold\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"donePercent"), env.opts.autoescape);
output += "%</span>\n        </div>\n        <div class=\"progress\" style=\"height:8px;\">\n            <div class=\"progress-bar bg-success\" role=\"progressbar\"\n                 style=\"width:";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"donePercent"), env.opts.autoescape);
output += "%;\"\n                 aria-valuenow=\"";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "stats")),"donePercent"), env.opts.autoescape);
output += "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n        </div>\n    </div>\n</div>\n";
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["partials/task_list.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
if(runtime.contextOrFrameLookup(context, frame, "loading")) {
output += "\n\n<div class=\"card border-0 shadow-sm\">\n    <div class=\"card-body text-center py-5\">\n        <div class=\"spinner-border text-primary mb-3\" role=\"status\" aria-hidden=\"true\"></div>\n        <div class=\"text-body-secondary\">Загружаем задачи…</div>\n    </div>\n</div>\n\n";
;
}
else {
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "tasks")),"length")) {
output += "\n\n    ";
if(runtime.contextOrFrameLookup(context, frame, "selectedCount") > 0) {
output += "\n    ";
output += "\n    <div class=\"card border-0 shadow-sm mb-3\">\n        <div class=\"card-body py-2 d-flex flex-wrap align-items-center gap-2\">\n            <span class=\"badge text-bg-primary rounded-pill\">Выбрано: ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "selectedCount"), env.opts.autoescape);
output += "</span>\n\n            ";
if(runtime.contextOrFrameLookup(context, frame, "busy")) {
output += "\n            <span class=\"spinner-border spinner-border-sm text-body-secondary\" role=\"status\" aria-hidden=\"true\"></span>\n            <span class=\"small text-body-secondary\">Обрабатываем…</span>\n            ";
;
}
else {
output += "\n            <div class=\"btn-group btn-group-sm\">\n                <button type=\"button\" class=\"btn btn-outline-success\" data-bulk=\"complete\">\n                    <i class=\"bi bi-check2-all me-1\"></i>Выполнить\n                </button>\n                <button type=\"button\" class=\"btn btn-outline-secondary\" data-bulk=\"uncomplete\">\n                    <i class=\"bi bi-arrow-counterclockwise me-1\"></i>В работу\n                </button>\n                <button type=\"button\" class=\"btn btn-outline-danger\" data-bulk=\"delete\">\n                    <i class=\"bi bi-trash me-1\"></i>Удалить\n                </button>\n            </div>\n            <button type=\"button\" class=\"btn btn-link btn-sm text-body-secondary ms-auto\" data-bulk=\"clear\">\n                Снять выбор\n            </button>\n            ";
;
}
output += "\n        </div>\n    </div>\n    ";
;
}
output += "\n\n    <div class=\"list-group shadow-sm\">\n\n        ";
output += "\n        <div class=\"list-group-item d-flex align-items-center gap-3 py-2 bg-body-tertiary\">\n            <div class=\"form-check ms-1\">\n                <input class=\"form-check-input\" type=\"checkbox\" id=\"bulkSelectAll\"\n                       ";
if(runtime.contextOrFrameLookup(context, frame, "allSelected")) {
output += "checked";
;
}
output += " ";
if(runtime.contextOrFrameLookup(context, frame, "busy")) {
output += "disabled";
;
}
output += ">\n                <label class=\"form-check-label visually-hidden\" for=\"bulkSelectAll\">Выбрать все видимые задачи</label>\n            </div>\n            <span class=\"small text-body-secondary\">Отметить выполненной</span>\n            <span class=\"ms-auto small text-body-secondary\">\n                ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "tasks")),"length"), env.opts.autoescape);
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "tasks")),"length") != runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "filters")),"all")) {
output += " из ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "filters")),"all"), env.opts.autoescape);
;
}
output += "\n            </span>\n        </div>\n\n        ";
frame = frame.push();
var t_3 = runtime.contextOrFrameLookup(context, frame, "tasks");
if(t_3) {t_3 = runtime.fromIterator(t_3);
var t_2 = t_3.length;
for(var t_1=0; t_1 < t_3.length; t_1++) {
var t_4 = t_3[t_1];
frame.set("task", t_4);
frame.set("loop.index", t_1 + 1);
frame.set("loop.index0", t_1);
frame.set("loop.revindex", t_2 - t_1);
frame.set("loop.revindex0", t_2 - t_1 - 1);
frame.set("loop.first", t_1 === 0);
frame.set("loop.last", t_1 === t_2 - 1);
frame.set("loop.length", t_2);
output += "\n        <div class=\"list-group-item d-flex align-items-start gap-3 py-3\"\n             data-task-id=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"id"), env.opts.autoescape);
output += "\" data-task-title=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "\">\n\n            ";
output += "\n            <div class=\"form-check mt-1\">\n                <input class=\"form-check-input task-select\" type=\"checkbox\"\n                       ";
if(runtime.memberLookup((t_4),"selected")) {
output += "checked";
;
}
output += " ";
if(runtime.contextOrFrameLookup(context, frame, "busy")) {
output += "disabled";
;
}
output += "\n                       aria-label=\"Выбрать задачу «";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "»\">\n            </div>\n\n            ";
output += "\n            <div class=\"form-check mt-1\">\n                <input class=\"form-check-input task-toggle\" type=\"checkbox\"\n                       ";
if(runtime.memberLookup((t_4),"completed")) {
output += "checked";
;
}
output += " ";
if(runtime.contextOrFrameLookup(context, frame, "busy")) {
output += "disabled";
;
}
output += "\n                       aria-label=\"Отметить задачу «";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "» выполненной\">\n            </div>\n\n            <div class=\"flex-grow-1 min-w-0\">\n                <div class=\"fw-semibold ";
if(runtime.memberLookup((t_4),"completed")) {
output += "text-decoration-line-through text-body-secondary";
;
}
output += "\">\n                    ";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "\n                </div>\n\n                ";
if(runtime.memberLookup((t_4),"description")) {
output += "\n                <div class=\"small text-body-secondary mt-1 text-wrap\">";
output += runtime.suppressValue(runtime.memberLookup((t_4),"description"), env.opts.autoescape);
output += "</div>\n                ";
;
}
output += "\n\n                <div class=\"d-flex flex-wrap gap-2 mt-2\">\n                    ";
if(runtime.memberLookup((t_4),"dueLabel")) {
output += "\n                    <span class=\"badge rounded-pill\n                        ";
if(runtime.memberLookup((t_4),"overdue")) {
output += "text-bg-danger\n                        ";
;
}
else {
if(runtime.memberLookup((t_4),"dueToday")) {
output += "text-bg-warning\n                        ";
;
}
else {
output += "text-bg-secondary";
;
}
;
}
output += "\">\n                        <i class=\"bi bi-clock me-1\"></i>";
output += runtime.suppressValue(runtime.memberLookup((t_4),"dueLabel"), env.opts.autoescape);
if(runtime.memberLookup((t_4),"overdue")) {
output += " · просрочено";
;
}
else {
if(runtime.memberLookup((t_4),"dueToday")) {
output += " · сегодня";
;
}
;
}
output += "\n                    </span>\n                    ";
;
}
output += "\n\n                    ";
if(runtime.memberLookup((t_4),"completed")) {
output += "\n                    <span class=\"badge rounded-pill text-bg-success\">\n                        <i class=\"bi bi-check2-all me-1\"></i>Выполнено\n                    </span>\n                    ";
;
}
output += "\n                </div>\n            </div>\n\n            ";
if(runtime.memberLookup((t_4),"imgUrl")) {
output += "\n            <img src=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"imgUrl"), env.opts.autoescape);
output += "\" alt=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "\"\n                 class=\"task-thumb flex-shrink-0\"\n                 data-caption=\"";
output += runtime.suppressValue(runtime.memberLookup((t_4),"title"), env.opts.autoescape);
output += "\" loading=\"lazy\"\n                 title=\"Нажмите, чтобы увеличить\">\n            ";
;
}
output += "\n\n            <div class=\"btn-group btn-group-sm flex-shrink-0\">\n                <button type=\"button\" class=\"btn btn-outline-primary task-edit\"\n                        title=\"Редактировать\" ";
if(runtime.contextOrFrameLookup(context, frame, "busy")) {
output += "disabled";
;
}
output += ">\n                    <i class=\"bi bi-pencil\"></i>\n                </button>\n                <button type=\"button\" class=\"btn btn-outline-danger task-delete\"\n                        title=\"Удалить\" ";
if(runtime.contextOrFrameLookup(context, frame, "busy")) {
output += "disabled";
;
}
output += ">\n                    <i class=\"bi bi-trash\"></i>\n                </button>\n            </div>\n        </div>\n        ";
;
}
}
frame = frame.pop();
output += "\n    </div>\n\n";
;
}
else {
output += "\n\n<div class=\"card border-0 shadow-sm\">\n    <div class=\"card-body text-center text-body-secondary py-5\">\n        ";
if(runtime.contextOrFrameLookup(context, frame, "hasSearch") || runtime.contextOrFrameLookup(context, frame, "currentFilter") != "all") {
output += "\n            <i class=\"bi bi-search display-6 d-block mb-3\"></i>\n            <p class=\"mb-3\">Ничего не найдено. Попробуйте изменить поиск или фильтр.</p>\n            <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" id=\"btnResetView\">\n                <i class=\"bi bi-arrow-counterclockwise me-1\"></i>Сбросить поиск и фильтры\n            </button>\n        ";
;
}
else {
output += "\n            <i class=\"bi bi-inbox display-6 d-block mb-3\"></i>\n            <p class=\"mb-3\">Задач пока нет. Создайте первую!</p>\n            <button type=\"button\" class=\"btn btn-primary btn-sm\" id=\"btnNewTaskEmpty\">\n                <i class=\"bi bi-plus-lg me-1\"></i>Новая задача\n            </button>\n        ";
;
}
output += "\n    </div>\n</div>\n\n";
;
}
;
}
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["profile.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "profile.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div style=\"max-width:900px;margin:0 auto;\">\n\n    <!-- Шапка профиля -->\n    <div class=\"card border-0 shadow-sm rounded-4 mb-4\">\n        <div class=\"card-body p-4\">\n\n            <div class=\"d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4\">\n\n                <!-- Аватар -->\n                <div class=\"d-flex align-items-center justify-content-center\n                            bg-primary bg-opacity-25 text-primary fw-bold rounded-circle flex-shrink-0\"\n                     style=\"width:96px;height:96px;font-size:2rem;\">\n                    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"initials"), env.opts.autoescape);
output += "\n                </div>\n\n                <!-- Имя, email -->\n                <div class=\"flex-grow-1 text-center text-sm-start\">\n                    <h1 class=\"h4 fw-bold mb-1\">\n                        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "\n                    </h1>\n                    <p class=\"text-body-secondary mb-0\">\n                        <i class=\"bi bi-envelope me-1\"></i>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"email") || "email не указан", env.opts.autoescape);
output += "\n                    </p>\n                </div>\n\n                <!-- Дата регистрации + кнопку выйти -->\n                <div class=\"d-flex flex-column justify-content-between align-items-center align-items-sm-end gap-2 flex-shrink-0 align-self-stretch\">\n\n                    <div class=\"text-body-secondary small text-center text-sm-end\">\n                        <i class=\"bi bi-calendar3 me-1\"></i>\n                        Дата регистрации\n                        <div class=\"badge text-bg-secondary rounded-pill mt-1\">\n                            ";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"date_joined_label") || "—", env.opts.autoescape);
output += "\n                        </div>\n                    </div>\n\n                    <form method=\"post\" action=\"/logout/\" class=\"m-0\">\n                        <button type=\"submit\" class=\"btn btn-outline-danger btn-sm\">\n                            <i class=\"bi bi-box-arrow-right me-1\"></i>Выйти\n                        </button>\n                    </form>\n\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Основная инфа -->\n    <div class=\"row g-4\">\n        <div class=\"col-12\">\n            <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n                <div class=\"card-body p-4\">\n                    <h2 class=\"h6 text-body-secondary text-uppercase mb-3\">Основная информация</h2>\n\n                    <dl class=\"row mb-0\">\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Имя пользователя</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Имя</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"first_name") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Фамилия</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"last_name") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Email</dt>\n                        <dd class=\"col-sm-8 mb-0\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"email") || "—", env.opts.autoescape);
output += "</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();



  function getEnv() {
    if (env) return env;
    env = new nunjucks.Environment(null, { autoescape: true });
    for (var key in templates) {
      if (Object.prototype.hasOwnProperty.call(templates, key)) {
        env.templates[key] = templates[key];
      }
    }
    return env;
  }

  global.renderPage = function (name, context) {
    return getEnv().render(name, context || {});
  };
})(window);
