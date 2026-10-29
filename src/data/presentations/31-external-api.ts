import type { Presentation } from '../types'

export default {
  slug: 'bezopasnost-vneshnih-api',
  title: 'Безопасность внешних API и сторонних библиотек',
  description: 'API-ключи и секреты, TLS, тайм-ауты, SSRF, валидация внешних данных, lock-файлы, SCA, риски цепочки поставок и безопасный HTTP-клиент на Python.',
  section: 'dev',
  icon: 'plug',
  tone: 'amber',
  subtitle: 'Чужой код и чужие данные — тоже часть вашего приложения',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: научиться безопасно интегрироваться с внешними сервисами и управлять сторонними зависимостями.',
      items: [
        { title: 'Риски интеграций', text: 'Что приносит чужой API', icon: 'plug' },
        { title: 'Секреты', text: 'Хранение API-ключей', icon: 'key' },
        { title: 'Надёжный клиент', text: 'TLS, тайм-ауты, лимиты', icon: 'timer' },
        { title: 'SSRF', text: 'Пользовательские URL', icon: 'route' },
        { title: 'Зависимости', text: 'Версии, CVE, цепочка поставок', icon: 'package' },
        { title: 'Практика', text: 'HTTP-клиент на Python', icon: 'code' },
      ],
    },
    {
      kind: 'cards',
      title: 'Риски интеграции сторонних API',
      variant: 'threat',
      items: [
        { title: 'Утечка ключей', icon: 'key', text: 'Ключ в репозитории или в коде фронтенда используют посторонние — за ваш счёт.' },
        { title: 'Отказ поставщика', icon: 'crash', text: 'Медленный API без тайм-аутов «подвешивает» и ваш сервис.' },
        { title: 'Недоверенные ответы', icon: 'fileWarn', text: 'Данные партнёра без проверки попадают в БД и на страницы.' },
        { title: 'SSRF', icon: 'route', text: 'Сервер запрашивает URL от пользователя и открывает доступ во внутреннюю сеть.' },
        { title: 'Лишние данные', icon: 'eye', text: 'Третьей стороне передаются персональные данные, которые ей не нужны.' },
        { title: 'Скомпрометированный SDK', icon: 'package', text: 'Вредоносное обновление клиентской библиотеки.' },
      ],
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'API-ключ', def: 'Секрет, по которому внешний сервис узнаёт ваше приложение. Даёт права, поэтому защищается как пароль.' },
        { term: 'SSRF (CWE-918)', def: 'Server-Side Request Forgery: злоумышленник заставляет сервер отправить запрос на выбранный им адрес.' },
        { term: 'SCA', def: 'Software Composition Analysis — анализ состава ПО: поиск зависимостей с известными уязвимостями и проблемными лицензиями.' },
        { term: 'Lock-файл', def: 'Файл с точными версиями и хешами всех зависимостей, включая транзитивные. Делает сборку воспроизводимой.' },
      ],
    },
    {
      kind: 'compare',
      title: 'Хранение API-ключей и секретов',
      left: {
        title: 'Неправильно',
        tone: 'bad',
        items: [
          'Ключ в исходном коде или файле конфигурации в git',
          'Ключ в коде фронтенда или мобильного приложения',
          'Один ключ с полными правами для всех сред',
          'Ключ в журналах, URL и сообщениях об ошибках',
        ],
      },
      right: {
        title: 'Правильно',
        tone: 'good',
        items: [
          'Переменные окружения процесса; файл .env — только локально и вне git',
          'Менеджер секретов в продакшене: Vault, облачные хранилища',
          'Минимальные права ключа, отдельные ключи для сред, ротация',
          'Вызовы платных API — только с сервера, не из браузера',
        ],
      },
    },
    {
      kind: 'points',
      title: 'TLS, тайм-ауты, ошибки и лимиты',
      items: [
        { title: 'Проверка сертификата', text: 'Никогда verify=False: это открывает путь атаке «человек посередине».', icon: 'lock' },
        { title: 'Тайм-ауты', text: 'В requests тайм-аута по умолчанию нет — запрос может висеть бесконечно.', icon: 'timer' },
        { title: 'Обработка ошибок', text: 'Проверять код ответа; при сбое — понятная ошибка или резервный сценарий.', icon: 'crash' },
        { title: 'Повторы', text: 'С экспоненциальной задержкой и только для идемпотентных запросов.', icon: 'refresh' },
        { title: 'Лимиты поставщика', text: 'Учитывать ответ 429 и заголовок Retry-After, кешировать ответы.', icon: 'gauge' },
        { title: 'Свои лимиты', text: 'Ограничивать частоту исходящих вызовов, чтобы пользователь не исчерпал квоту.', icon: 'filter' },
      ],
    },
    {
      kind: 'flow',
      title: 'SSRF: риск пользовательских URL',
      lead: 'Функция «загрузить аватар по ссылке» или «предпросмотр страницы» принимает URL от пользователя.',
      nodes: [
        { title: 'Атакующий', text: 'Отправляет URL внутреннего адреса, например 169.254.169.254', icon: 'userX' },
        { title: 'Ваш сервер', text: 'Делает запрос изнутри сети без проверки адреса', icon: 'server' },
        { title: 'Внутренний сервис', text: 'Сервис метаданных облака, админ-панель, БД', icon: 'database' },
        { title: 'Утечка', text: 'Ответ с учётными данными возвращается атакующему', icon: 'alert' },
      ],
      caption: 'Capital One, 2019: через SSRF в неправильно настроенном межсетевом экране веб-приложений (WAF) были получены временные учётные данные облака, а затем данные около 106 млн человек.',
    },
    {
      kind: 'code',
      title: 'Защита от SSRF',
      lang: 'python',
      blocks: [
        {
          code: `ALLOWED_HOSTS = {"images.partner.example"}

def check_url(url: str) -> str:
    u = urlsplit(url)
    if u.scheme != "https" or u.hostname not in ALLOWED_HOSTS:
        raise ValueError("URL не разрешён")
    for *_, addr in socket.getaddrinfo(u.hostname, 443):
        if not ipaddress.ip_address(addr[0]).is_global:
            raise ValueError("Внутренний адрес запрещён")
    return url`,
        },
      ],
      notes: [
        'Белый список хостов надёжнее чёрного списка адресов.',
        'Адрес проверяется после разрешения имени: имя может указывать на 127.0.0.1.',
        'Перенаправления отключены — иначе проверку обходят редиректом.',
        'На уровне сети исходящие запросы сервера идут через прокси с ограничениями.',
      ],
    },
    {
      kind: 'points',
      title: 'Валидация внешних данных',
      lead: 'Ответ партнёра — такие же недоверенные данные, как ввод пользователя (OWASP API10:2023).',
      items: [
        { title: 'Схема ответа', text: 'Проверка типов и обязательных полей, например моделью Pydantic.', icon: 'braces' },
        { title: 'Размер и формат', text: 'Лимит размера ответа, проверка Content-Type.', icon: 'gauge' },
        { title: 'Экранирование при выводе', text: 'Текст от партнёра на странице — потенциальный XSS.', icon: 'code' },
        { title: 'Подпись вебхуков', text: 'Проверка HMAC-подписи и метки времени входящих уведомлений.', icon: 'badge' },
      ],
    },
    {
      kind: 'table',
      title: 'Зависимости: версии, lock-файлы и CVE',
      head: ['Практика', 'Зачем'],
      rows: [
        ['Lock-файл с хешами: uv.lock, poetry.lock, package-lock.json', 'Одинаковые версии на всех машинах, подмена пакета обнаруживается'],
        ['Установка по lock-файлу: pip --require-hashes, npm ci', 'Сборка не подтянет «свежую» непроверенную версию'],
        ['SCA в CI: pip-audit, npm audit, OSV-Scanner', 'Сообщает о зависимостях с известными CVE'],
        ['Обновления через Dependabot или Renovate с ревью', 'Регулярные небольшие обновления вместо одного рискованного'],
        ['Проверка нового пакета перед добавлением', 'Сопровождающие, активность, похожие имена'],
      ],
    },
    {
      kind: 'cards',
      title: 'Риски цепочки поставок ПО',
      variant: 'threat',
      items: [
        { title: 'event-stream', tag: 'npm, 2018', icon: 'package', text: 'Новый сопровождающий добавил вредоносную зависимость, нацеленную на криптокошельки.' },
        { title: 'xz Utils', tag: 'CVE-2024-3094', icon: 'skull', text: 'Бэкдор внедрён после многолетнего завоевания доверия в проекте.' },
        { title: 'Dependency confusion', tag: '2021', icon: 'shuffle', text: 'Публичный пакет с именем внутреннего устанавливается вместо него.' },
        { title: 'Тайпсквоттинг', tag: 'PyPI, npm', icon: 'bug', text: 'Пакеты с именами, похожими на популярные, содержат вредоносный код.' },
      ],
    },
    {
      kind: 'code',
      title: 'Практика: безопасный HTTP-клиент на Python',
      lead: 'Библиотека httpx: проверка TLS включена по умолчанию, тайм-ауты заданы явно.',
      lang: 'python',
      blocks: [
        {
          label: 'Настройка клиента',
          tone: 'good',
          code: `import os
import httpx

API_KEY = os.environ["WEATHER_API_KEY"]

client = httpx.Client(
    base_url="https://api.weather.example",
    timeout=httpx.Timeout(5.0, connect=2.0),
    follow_redirects=False,
    headers={"Authorization": f"Bearer {API_KEY}"},
)`,
        },
        {
          label: 'Запрос и проверка ответа',
          tone: 'good',
          code: `class Forecast(BaseModel):
    city: str = Field(max_length=100)
    temp_c: float = Field(ge=-90, le=60)

def get_forecast(city: str) -> Forecast:
    r = client.get("/v1/forecast",
                   params={"city": city})
    r.raise_for_status()  # 4xx и 5xx
    return Forecast.model_validate(r.json())`,
        },
      ],
      notes: [
        'Ключ берётся из окружения: без него приложение не запустится.',
        'Ошибки сети и статуса обрабатываются вызывающим кодом без утечки ключа в лог.',
      ],
    },
    {
      kind: 'summary',
      points: [
        'API-ключи хранятся вне кода, с минимальными правами и ротацией.',
        'Исходящие запросы — с проверкой TLS, тайм-аутами и обработкой ошибок.',
        'Пользовательские URL — источник SSRF: белый список и проверка адреса.',
        'Зависимости фиксируются lock-файлом и постоянно проверяются на CVE.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист интеграции',
      items: [
        'Ключи в окружении или менеджере секретов, не в git',
        'Нигде нет verify=False',
        'У каждого внешнего вызова есть тайм-аут',
        'Ответы проверяются по схеме и лимиту размера',
        'Пользовательские URL проходят белый список и проверку IP',
        'Вебхуки проверяются по подписи',
        'Зависимости установлены по lock-файлу с хешами',
        'SCA в CI и процесс обновления зависимостей',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'OWASP API Security Top 10, 2023: API7 SSRF, API10 Unsafe Consumption of APIs', org: 'OWASP Foundation' },
        { title: 'Server-Side Request Forgery Prevention Cheat Sheet; Secrets Management Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'HTTPX: Timeouts, SSL (python-httpx.org); ipaddress, socket (docs.python.org)', org: 'Документация библиотек' },
        { title: 'pip-audit (github.com/pypa/pip-audit); OSV (osv.dev)', org: 'PyPA; OpenSSF' },
        { title: 'SP 800-161 Rev. 1. Cybersecurity Supply Chain Risk Management, 2022', org: 'NIST' },
        { title: 'CVE-2024-3094; CWE-918', org: 'NIST NVD; MITRE' },
      ],
    },
  ],
} satisfies Presentation
