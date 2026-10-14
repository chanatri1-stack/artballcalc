// ====================================================================
// ==================== АВТОПЕРЕКЛЮЧЕНИЕ ДЕНЬ / НОЧЬ ===================
// ====================================================================
var THEME_NIGHT_START = 21;   // 21:00
var THEME_NIGHT_END   = 7;    // 07:00

// null = автоматически по часам; true/false = ручной выбор кнопкой
var nightModeManual = null;

function computeNightState() {
    var h = new Date().getHours();
    var auto = (h >= THEME_NIGHT_START || h < THEME_NIGHT_END);
    return (nightModeManual === null) ? auto : nightModeManual;
}

function applyDayNightTheme() {
    var night = computeNightState();
    var bodyEl = document.body;

    // Плавный переход цветов в ОБЕ стороны (день <-> ночь):
    // на время переключения добавляем body класс theme-switching,
    // который включает замедленные transition у окон (см. css/night-theme.css).
    // Без этого при снятии класса night-theme (переход в дневную тему)
    // элементы перекрашиваются мгновенно.
    if (bodyEl.classList.contains('night-theme') !== night) {
        bodyEl.classList.add('theme-switching');
        clearTimeout(applyDayNightTheme._switchTimer);
        applyDayNightTheme._switchTimer = setTimeout(function () {
            bodyEl.classList.remove('theme-switching');
        }, 1500);
    }

    bodyEl.classList.toggle('night-theme', night);

    var nightEl = document.getElementById('bg-night');
    var dayEl   = document.getElementById('bg-day');
    if (nightEl) nightEl.style.opacity = night ? '1' : '0';
    if (dayEl)   dayEl.style.opacity   = night ? '0' : '1';

    // Тумблер всегда отражает фактическое состояние темы,
    // в том числе когда ночная тема включена автоматически (21:00-07:00)
    var toggleEl = document.getElementById('night-mode-toggle');
    if (toggleEl) toggleEl.checked = night;
}

/* Кнопка-переключатель "Ночная тема" (по выбору пользователя, только на текущий сеанс) */
var nightToggle = document.getElementById('night-mode-toggle');
if (nightToggle) {
    nightToggle.addEventListener('change', function () {
        nightModeManual = nightToggle.checked ? true : false;
        applyDayNightTheme();
    });
}

// Проверка сразу при загрузке и далее каждые 30 секунд
applyDayNightTheme();
setInterval(applyDayNightTheme, 30000);

// Обновление при возвращении вкладки в активное состояние
document.addEventListener('visibilitychange', function () {
    if (!document.hidden) applyDayNightTheme();
});
// ====================================================================