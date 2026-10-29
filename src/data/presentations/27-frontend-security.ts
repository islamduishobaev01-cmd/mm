import type { Presentation } from '../types'

export default {
  slug: 'frontend-security-xss-csrf-csp',
  title: 'Безопасность фронтенда: XSS, CSRF и Content Security Policy',
  description: 'Виды XSS, контекстное экранирование, пользовательский HTML, CSRF и SameSite, Content Security Policy, защитные заголовки и cookie.',
  section: 'dev',
  icon: 'code',
  tone: 'mint',
  subtitle: 'Браузер выполняет всё, что оказалось на странице. Решите, что туда попадёт',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: научиться находить и исправлять XSS и CSRF и настраивать защитные механизмы браузера.',
      items: [
        { title: 'Модель угроз', text: 'Что видит и делает браузер', icon: 'target' },
        { title: 'XSS', text: 'Три вида и экранирование', icon: 'code' },
        { title: 'Пользовательский HTML', text: 'Санитизация', icon: 'filter' },
        { title: 'CSRF', text: 'Механизм и защита', icon: 'cookie' },
        { title: 'CSP и заголовки', text: 'Защита на уровне браузера', icon: 'shield' },
        { title: 'Cookie и токены', text: 'Где хранить сессию', icon: 'key' },
      ],
    },
    {
      kind: 'points',
      title: 'Модель угроз браузерного приложения',
      items: [
        { title: 'Одна страница — общие права', text: 'Любой скрипт в источнике (origin) видит DOM, данные и может слать запросы от имени пользователя.', icon: 'globe' },
        { title: 'Сторонние скрипты', text: 'Аналитика, виджеты и CDN получают те же права, что и ваш код.', icon: 'package' },
        { title: 'Автоматические cookie', text: 'Браузер прикладывает cookie к запросам на сайт, даже инициированным чужой страницей.', icon: 'cookie' },
        { title: 'Недоверенный ввод', text: 'URL, формы, ответы API, postMessage и localStorage.', icon: 'alert' },
        { title: 'Пользователь видит всё', text: 'Код фронтенда и его проверки можно прочитать и обойти.', icon: 'eye' },
      ],
    },
    {
      kind: 'table',
      title: 'Три вида XSS',
      lead: 'Cross-Site Scripting — выполнение чужого скрипта в контексте вашего сайта.',
      head: ['Вид', 'Где нагрузка', 'Пример'],
      rows: [
        ['Отражённый (reflected)', 'В параметре запроса; сервер вставляет её в ответ', 'Ссылка /search?q=<script>… в фишинговом письме'],
        ['Сохранённый (stored)', 'В базе данных; видят все, кто откроет страницу', 'Комментарий со скриптом в учебном форуме'],
        ['DOM-based', 'В клиентском JavaScript; сервер может не участвовать', 'location.hash попадает в innerHTML'],
      ],
      note: 'Последствия одинаковы: кража данных страницы, действия от имени пользователя, подмена содержимого, фишинговые формы на настоящем домене.',
    },
    {
      kind: 'code',
      title: 'DOM-based XSS и исправление',
      lang: 'js',
      blocks: [
        {
          label: 'Уязвимо',
          tone: 'bad',
          code: `const q = new URLSearchParams(location.search)
  .get("q")
results.innerHTML = "Вы искали: " + q

// ?q=<img src=x onerror=alert(1)>
// браузер создаст img и выполнит onerror`,
        },
        {
          label: 'Исправлено',
          tone: 'good',
          code: `const q = new URLSearchParams(location.search)
  .get("q")
results.textContent = "Вы искали: " + q

// Строка выводится как текст:
// теги не разбираются и не выполняются`,
        },
      ],
      notes: [
        'Опасные «приёмники»: innerHTML, outerHTML, insertAdjacentHTML, document.write, eval.',
        'Безопасные: textContent, setAttribute для неопасных атрибутов, шаблоны фреймворка.',
      ],
    },
    {
      kind: 'table',
      title: 'Контекстное экранирование',
      lead: 'Правило экранирования зависит от того, куда попадают данные.',
      head: ['Контекст', 'Пример', 'Защита'],
      rows: [
        ['Текст HTML', '<p>ДАННЫЕ</p>', 'Экранировать & < > " \' — шаблонизатор делает это сам'],
        ['Атрибут', '<input value="ДАННЫЕ">', 'Экранирование и обязательные кавычки'],
        ['URL', '<a href="ДАННЫЕ">', 'Только схемы http и https, запрет javascript:'],
        ['JavaScript', '<script>let x = "ДАННЫЕ"</script>', 'Не вставлять; передать через data-атрибут или JSON'],
        ['CSS', 'style="ДАННЫЕ"', 'Не вставлять пользовательские данные'],
      ],
    },
    {
      kind: 'code',
      title: 'Безопасная работа с пользовательским HTML',
      lead: 'React экранирует данные автоматически. Опасность появляется, когда HTML вставляют напрямую.',
      lang: 'js',
      blocks: [
        {
          code: `import DOMPurify from "dompurify"

// Обычный текст: React сам экранирует
<p>{comment.text}</p>

// HTML из редактора статей: сначала санитизация
const clean = DOMPurify.sanitize(article.html, {
  ALLOWED_TAGS: ["p", "b", "i", "a", "ul", "li"],
  ALLOWED_ATTR: ["href"],
})
<div dangerouslySetInnerHTML={{ __html: clean }} />`,
        },
      ],
      notes: [
        'Санитизировать при выводе, белым списком тегов и атрибутов.',
        'Не писать свои регулярные выражения для «очистки» HTML.',
        'Для простого форматирования удобнее Markdown с санитизацией результата.',
        'CSP — дополнительная защита на случай пропущенной ошибки.',
      ],
    },
    {
      kind: 'flow',
      title: 'CSRF: механизм атаки',
      lead: 'Cross-Site Request Forgery — чужой сайт заставляет браузер отправить запрос от имени пользователя.',
      nodes: [
        { title: 'Пользователь вошёл', text: 'В учебный портал, cookie сессии сохранена', icon: 'userCheck' },
        { title: 'Открывает чужую страницу', text: 'Ссылка из чата или рекламы', icon: 'globe' },
        { title: 'Скрытая форма', text: 'POST /api/profile/email отправляется автоматически', icon: 'code' },
        { title: 'Браузер прикладывает cookie', text: 'Сервер видит обычный запрос пользователя', icon: 'cookie' },
      ],
      caption: 'Злоумышленник не видит ответ, но действие выполнено: смена почты, перевод, удаление. Защищаться нужно на сервере.',
    },
    {
      kind: 'points',
      title: 'Защита от CSRF',
      items: [
        { title: 'CSRF-токен', text: 'Случайное значение, привязанное к сессии, в каждой изменяющей форме и запросе.', icon: 'key' },
        { title: 'SameSite cookie', text: 'Lax или Strict: cookie не уходит с межсайтовыми POST-запросами.', icon: 'cookie' },
        { title: 'Проверка Origin', text: 'Сервер отклоняет изменяющие запросы с чужим Origin или Sec-Fetch-Site: cross-site.', icon: 'filter' },
        { title: 'GET не меняет данные', text: 'Иначе атаку выполнит обычная картинка или ссылка.', icon: 'ban' },
        { title: 'Подтверждение', text: 'Повторный ввод пароля или MFA для критичных действий.', icon: 'fingerprint' },
      ],
    },
    {
      kind: 'code',
      title: 'Content Security Policy',
      lead: 'Заголовок ответа сообщает браузеру, откуда разрешено загружать и выполнять ресурсы.',
      lang: 'http',
      blocks: [
        {
          label: 'Строгая политика с nonce',
          tone: 'good',
          code: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-4f9c1e7a2b';
  object-src 'none';
  base-uri 'none';
  frame-ancestors 'none';
  form-action 'self'`,
        },
      ],
      notes: [
        'Встроенные скрипты без правильного nonce и eval не выполнятся.',
        'nonce генерируется заново для каждого ответа.',
        'В реальном ответе заголовок записывается одной строкой.',
        'Внедряйте через Content-Security-Policy-Report-Only и отчёты о нарушениях.',
      ],
    },
    {
      kind: 'table',
      title: 'Безопасные HTTP-заголовки',
      head: ['Заголовок', 'Значение', 'Зачем'],
      rows: [
        ['Strict-Transport-Security', 'max-age=31536000; includeSubDomains', 'Браузер ходит на сайт только по HTTPS'],
        ['X-Content-Type-Options', 'nosniff', 'Запрет угадывать тип ответа'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin', 'Путь и параметры URL не уходят на чужие сайты'],
        ['Permissions-Policy', 'camera=(), geolocation=()', 'Отключение ненужных API браузера'],
        ['CSP frame-ancestors', "'none'", 'Защита от кликджекинга, замена X-Frame-Options'],
      ],
    },
    {
      kind: 'code',
      title: 'Cookie сессии и хранение токенов',
      lead: 'Атрибуты cookie закрывают сразу несколько атак. Пример для FastAPI.',
      lang: 'python',
      blocks: [
        {
          code: `response.set_cookie(
    key="__Host-session",
    value=session_id,     # случайный, 128+ бит
    httponly=True,        # недоступна из JavaScript
    secure=True,          # только по HTTPS
    samesite="lax",       # межсайтовые POST без cookie
    path="/",
    max_age=3600,
)`,
        },
      ],
      notes: [
        'HttpOnly: XSS не украдёт cookie, хотя всё ещё может действовать на странице.',
        'Префикс __Host- требует Secure, Path=/ и запрещает Domain.',
        'Токены не храните в localStorage: любой внедрённый скрипт их прочитает.',
        'Для SPA предпочтительна схема BFF: токены на сервере, в браузере — только cookie.',
      ],
    },
    {
      kind: 'summary',
      points: [
        'XSS побеждают контекстным экранированием и отказом от опасных приёмников.',
        'Пользовательский HTML — только после санитизации белым списком.',
        'CSRF закрывают токены, SameSite и проверка Origin на сервере.',
        'CSP, защитные заголовки и атрибуты cookie — второй эшелон защиты.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист frontend-разработчика',
      items: [
        'Нет innerHTML и eval с недоверенными данными',
        'dangerouslySetInnerHTML — только после DOMPurify',
        'Ссылки из ввода проверяются на схему http и https',
        'Изменяющие запросы защищены CSRF-токеном и SameSite',
        'Настроена CSP с nonce и object-src \'none\'',
        'Заданы HSTS, nosniff, Referrer-Policy',
        'Cookie сессии: HttpOnly, Secure, SameSite',
        'Токены не хранятся в localStorage',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'Cross Site Scripting Prevention Cheat Sheet; DOM based XSS Prevention Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'Cross-Site Request Forgery Prevention Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'Content Security Policy Level 3', org: 'W3C' },
        { title: 'RFC 6265. HTTP State Management Mechanism (cookies), 2011', org: 'IETF / RFC Editor' },
        { title: 'MDN Web Docs: Content-Security-Policy, Set-Cookie, SameSite', org: 'Mozilla' },
        { title: 'DOMPurify: документация (github.com/cure53/DOMPurify)', org: 'Cure53' },
      ],
    },
  ],
} satisfies Presentation
