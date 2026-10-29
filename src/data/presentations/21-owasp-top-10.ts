import type { Presentation } from '../types'

export default {
  slug: 'owasp-top-10',
  title: 'OWASP Top 10: анализ уязвимостей веб-приложений',
  description: 'Десять категорий рисков OWASP Top 10:2025 на примерах: контроль доступа, конфигурация, цепочка поставок, инъекции и способы их устранения.',
  section: 'dev',
  icon: 'bug',
  tone: 'coral',
  subtitle: 'Десять главных рисков веб-приложений и как их найти в своём коде',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: научиться узнавать риски OWASP Top 10:2025 в коде и проверять по ним собственное веб-приложение.',
      items: [
        { title: 'OWASP и Top 10', text: 'Кто составляет список и зачем', icon: 'book' },
        { title: 'Десять категорий', text: 'Редакция 2025 и отличия от 2021', icon: 'listChecks' },
        { title: 'Доступ и конфигурация', text: 'A01 и A02 на примерах кода', icon: 'userLock' },
        { title: 'Поставки и криптография', text: 'A03 и A04: зависимости и ключи', icon: 'package' },
        { title: 'Инъекции и вход', text: 'A05 и A07: недоверенный ввод', icon: 'terminal' },
        { title: 'Проверка', text: 'Инструменты и чек-лист', icon: 'clipboard' },
      ],
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'OWASP', def: 'Open Worldwide Application Security Project — некоммерческий фонд, выпускающий открытые стандарты и руководства по безопасности приложений.' },
        { term: 'OWASP Top 10', def: 'Документ повышения осведомлённости: десять наиболее критичных категорий рисков веб-приложений по данным тестирования и опросу сообщества.' },
        { term: 'CWE', def: 'Common Weakness Enumeration — каталог типов слабостей ПО (например, CWE-89 — SQL-инъекция). Категории Top 10 объединяют группы CWE.' },
        { term: 'CVE', def: 'Идентификатор конкретной уязвимости в конкретном продукте, например CVE-2021-44228 в Log4j.' },
      ],
    },
    {
      kind: 'table',
      title: 'OWASP Top 10:2025 — категории A01–A05',
      head: ['Категория', 'Суть', 'В редакции 2021'],
      rows: [
        ['A01 Broken Access Control', 'Пользователь делает то, на что у него нет прав', 'A01; в 2025 сюда включена SSRF'],
        ['A02 Security Misconfiguration', 'Небезопасные настройки по умолчанию, отладка в продакшене', 'A05'],
        ['A03 Software Supply Chain Failures', 'Уязвимые и скомпрометированные зависимости, сборка, CI/CD', 'Расширение A06 Vulnerable and Outdated Components'],
        ['A04 Cryptographic Failures', 'Данные без шифрования, слабые алгоритмы, утечка ключей', 'A02'],
        ['A05 Injection', 'Ввод пользователя исполняется как код: SQL, команды ОС, XSS', 'A03'],
      ],
      note: 'Редакция OWASP Top 10:2025 представлена OWASP в ноябре 2025 г. Названия категорий даны по оригиналу. Проверено 29.10.2026.',
    },
    {
      kind: 'table',
      title: 'OWASP Top 10:2025 — категории A06–A10',
      head: ['Категория', 'Суть', 'В редакции 2021'],
      rows: [
        ['A06 Insecure Design', 'Ошибка заложена в архитектуре и бизнес-логике', 'A04'],
        ['A07 Authentication Failures', 'Подбор паролей, слабые сессии, нет MFA', 'A07 Identification and Authentication Failures'],
        ['A08 Software or Data Integrity Failures', 'Код и данные принимаются без проверки подлинности', 'A08'],
        ['A09 Logging & Alerting Failures', 'Атаку не видно в журналах, нет оповещений', 'A09 Security Logging and Monitoring Failures'],
        ['A10 Mishandling of Exceptional Conditions', 'Неверная обработка ошибок и сбоев, «отказ в открытое состояние»', 'Новая категория'],
      ],
      note: 'Порядок отражает распространённость и последствия, а не «важность» для конкретного проекта: свою приоритизацию дают моделирование угроз и оценка рисков.',
    },
    {
      kind: 'code',
      title: 'A01 Broken Access Control: чужой объект по id',
      lead: 'Самая распространённая категория. Пользователь вошёл в систему, но сервер не проверил, чей это объект.',
      lang: 'python',
      blocks: [
        {
          label: 'Уязвимо',
          tone: 'bad',
          code: `@app.get("/api/orders/{order_id}")
def get_order(order_id: int,
              user=Depends(current_user)):
    # Любой вошедший пользователь получит
    # чужой заказ, подставив другой id
    return db.get_order(order_id)`,
        },
        {
          label: 'Исправлено',
          tone: 'good',
          code: `@app.get("/api/orders/{order_id}")
def get_order(order_id: int,
              user=Depends(current_user)):
    order = db.get_order(order_id)
    if order is None or order.owner_id != user.id:
        raise HTTPException(status_code=404)
    return order`,
        },
      ],
      notes: [
        'Права проверяются на сервере для каждого объекта, а не скрытием кнопок в интерфейсе.',
        'Ответ 404 не подтверждает, что чужая запись существует.',
      ],
    },
    {
      kind: 'compare',
      title: 'A02 Security Misconfiguration',
      lead: 'Приложение может быть написано без ошибок и всё равно уязвимо из-за настроек окружения.',
      left: {
        title: 'Типичные ошибки',
        tone: 'bad',
        items: [
          'Режим отладки и подробные трассировки в продакшене',
          'Учётные записи и пароли по умолчанию',
          'Публичное облачное хранилище с данными',
          'Лишние открытые порты, сервисы и панели администратора',
          'Нет защитных HTTP-заголовков',
        ],
      },
      right: {
        title: 'Как правильно',
        tone: 'good',
        items: [
          'Одинаковая, воспроизводимая конфигурация для всех сред (IaC)',
          'Отключено всё, что не используется',
          'Секреты — в переменных окружения или менеджере секретов',
          'Заголовки CSP, HSTS, X-Content-Type-Options',
          'Автоматическая проверка конфигурации в CI/CD',
        ],
      },
    },
    {
      kind: 'cards',
      title: 'A03 Software Supply Chain Failures',
      lead: 'Большая часть кода приложения — чужие библиотеки. Их уязвимости и компрометация становятся вашими.',
      variant: 'threat',
      items: [
        { title: 'Log4Shell', tag: 'CVE-2021-44228', icon: 'bug', text: 'Удалённое выполнение кода через строку журнала в Log4j 2. Затронуло огромное число Java-приложений.' },
        { title: 'Бэкдор в xz Utils', tag: 'CVE-2024-3094', icon: 'skull', text: 'Вредоносный код внедрили в релизы библиотеки сжатия через доверие к сопровождающему.' },
        { title: 'Equifax, 2017', tag: 'CVE-2017-5638', icon: 'package', text: 'Исправление Apache Struts не установили вовремя — утекли данные около 147 млн человек.' },
        { title: 'Небезопасный конвейер', tag: 'CI/CD', icon: 'workflow', text: 'Сборка тянет пакеты без фиксации версий и выполняет непроверенные скрипты.' },
      ],
    },
    {
      kind: 'compare',
      title: 'A04 Cryptographic Failures',
      left: {
        title: 'Ошибки',
        tone: 'bad',
        items: [
          'Передача данных по HTTP без TLS',
          'Пароли в MD5, SHA-1 или «просто SHA-256»',
          'Ключи и токены в исходном коде',
          'Собственные «алгоритмы шифрования»',
          'Режим ECB и повторно используемые nonce',
        ],
      },
      right: {
        title: 'Практика',
        tone: 'good',
        items: [
          'TLS 1.2+ (лучше 1.3) и заголовок HSTS',
          'Пароли — Argon2id, scrypt или bcrypt',
          'AES-GCM или ChaCha20-Poly1305 из проверенных библиотек',
          'Ключи — в менеджере секретов, с ротацией',
          'Шифровать только то, что нужно хранить; лишнее — не собирать',
        ],
      },
    },
    {
      kind: 'code',
      title: 'A05 Injection: команда операционной системы',
      lead: 'Инъекция возникает, когда данные пользователя попадают в интерпретатор как часть команды.',
      lang: 'python',
      blocks: [
        {
          label: 'Уязвимо',
          tone: 'bad',
          code: `host = request.query_params["host"]
# host = "8.8.8.8; cat /etc/passwd"
subprocess.run(f"ping -c 1 {host}",
               shell=True)`,
        },
        {
          label: 'Исправлено',
          tone: 'good',
          code: `try:
    host = str(ipaddress.ip_address(
        request.query_params["host"]))
except ValueError:
    raise HTTPException(400, "Нужен IP-адрес")
subprocess.run(["ping", "-c", "1", host],
               timeout=5)  # без shell=True`,
        },
      ],
      notes: [
        'Аргументы передаются списком — оболочка не разбирает «;» и «|».',
        'Ввод проверяется по белому списку формата: только IP-адрес.',
      ],
    },
    {
      kind: 'cards',
      title: 'Аутентификация и другие категории на примерах',
      variant: 'threat',
      items: [
        { title: 'A06 Insecure Design', icon: 'layers', text: 'Нет лимита на бронирования: бот занимает все места бесплатно. Кодом это не исправить — нужна другая логика.' },
        { title: 'A07 Authentication Failures', icon: 'fingerprint', text: 'Нет лимита попыток входа и MFA, сессия не аннулируется при выходе, сброс пароля по «секретному вопросу».' },
        { title: 'A08 Integrity Failures', icon: 'fileWarn', text: 'Приложение скачивает обновления без проверки подписи или десериализует pickle из запроса.' },
        { title: 'A09 Logging & Alerting', icon: 'activity', text: 'Тысячи неудачных входов не попадают в журнал, атаку обнаруживают через месяцы.' },
        { title: 'A10 Exceptional Conditions', icon: 'crash', text: 'При ошибке проверки прав код возвращает «разрешено», а клиент видит трассировку стека.' },
      ],
    },
    {
      kind: 'table',
      title: 'Как обнаруживать и устранять',
      head: ['Метод', 'Что находит', 'Когда применять'],
      rows: [
        ['Ревью кода по чек-листу (OWASP ASVS)', 'Логику доступа, ошибки дизайна', 'Каждый pull request'],
        ['SAST: Semgrep, CodeQL, Bandit', 'Опасные конструкции в исходном коде', 'При каждой сборке'],
        ['SCA: pip-audit, npm audit, Dependabot', 'Зависимости с известными CVE', 'При сборке и по расписанию'],
        ['DAST: OWASP ZAP, Burp Suite', 'Уязвимости работающего приложения', 'На тестовом стенде'],
        ['Тест на проникновение', 'Цепочки уязвимостей и ошибки бизнес-логики', 'Перед релизом и периодически'],
      ],
      note: 'Автоматические сканеры плохо находят A01 и A06: контроль доступа и бизнес-логику нужно проверять тестами и ревью.',
    },
    {
      kind: 'summary',
      points: [
        'OWASP Top 10 — карта типовых рисков, а не исчерпывающий стандарт проверки.',
        'Лидирует нарушение контроля доступа: права проверяются на сервере для каждого объекта.',
        'Зависимости и конвейер сборки — часть поверхности атаки.',
        'Для полной проверки используйте OWASP ASVS, тесты и моделирование угроз.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист проверки веб-приложения',
      items: [
        'Каждый эндпоинт проверяет права на конкретный объект',
        'Отладка выключена, ошибки не раскрывают внутренности',
        'Зависимости зафиксированы и проверяются на CVE',
        'Весь трафик — по HTTPS, пароли — Argon2id или bcrypt',
        'Запросы к БД параметризованы, команды ОС без shell',
        'Есть MFA и ограничение попыток входа',
        'Важные события журналируются, настроены оповещения',
        'Ошибки обрабатываются по принципу «по умолчанию запрещено»',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'OWASP Top 10:2025 (owasp.org/Top10/2025), проверено 29.10.2026', org: 'OWASP Foundation' },
        { title: 'OWASP Application Security Verification Standard 5.0, 2025', org: 'OWASP Foundation' },
        { title: 'OWASP Cheat Sheet Series', org: 'OWASP Foundation' },
        { title: 'Common Weakness Enumeration (cwe.mitre.org)', org: 'MITRE' },
        { title: 'CVE-2021-44228, CVE-2024-3094, CVE-2017-5638', org: 'NIST National Vulnerability Database' },
        { title: 'GAO-18-559. Data Protection: Actions Taken by Equifax…, 2018', org: 'U.S. GAO' },
      ],
    },
  ],
} satisfies Presentation
