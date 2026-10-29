import type { Presentation } from '../types'

export default {
  slug: 'sql-injection-i-server-security',
  title: 'SQL-инъекции и внедрение кода на стороне сервера',
  description: 'Причины SQL-инъекций, параметризованные запросы, ORM и её ограничения, минимальные привилегии БД, другие серверные инъекции и тестирование.',
  section: 'dev',
  icon: 'database',
  tone: 'amber',
  subtitle: 'Данные должны оставаться данными и никогда не становиться кодом',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: понимать механизм инъекций, писать запросы без уязвимостей и проверять это тестами на учебном стенде.',
      items: [
        { title: 'Механизм', text: 'Почему возникают инъекции', icon: 'bug' },
        { title: 'Параметризация', text: 'Правильные запросы к БД', icon: 'database' },
        { title: 'ORM', text: 'Что она защищает, а что нет', icon: 'layers' },
        { title: 'Привилегии', text: 'Ограничение ущерба', icon: 'userLock' },
        { title: 'Другие инъекции', text: 'ОС, шаблоны, XML, NoSQL', icon: 'terminal' },
        { title: 'Тестирование', text: 'Локальный стенд и автотесты', icon: 'scan' },
      ],
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'Инъекция', def: 'Уязвимость, при которой данные пользователя интерпретируются как часть команды: SQL-запроса, команды ОС, шаблона.' },
        { term: 'SQL-инъекция (CWE-89)', def: 'Изменение логики SQL-запроса через подставленные в него данные: чтение чужих данных, обход входа, удаление таблиц.' },
        { term: 'Параметризованный запрос', def: 'Запрос, где SQL-код и значения передаются в СУБД раздельно. Значение никогда не становится кодом.' },
        { term: 'Минимальные привилегии', def: 'Учётная запись приложения в БД имеет только те права, которые нужны для его работы.' },
      ],
    },
    {
      kind: 'points',
      title: 'Причины появления SQL-инъекций',
      items: [
        { title: 'Склейка строк', text: 'Запрос собирается через f-строки, format или +.', icon: 'code' },
        { title: 'Доверие к «скрытым» данным', text: 'Cookie, заголовки и скрытые поля формы тоже контролирует пользователь.', icon: 'eye' },
        { title: 'Динамические идентификаторы', text: 'Имя столбца для сортировки или таблицы берётся из запроса.', icon: 'shuffle' },
        { title: 'Сырые запросы в обход ORM', text: 'Для «сложного отчёта» пишут SQL вручную.', icon: 'database' },
        { title: 'Ручное экранирование', text: 'Замена кавычек не учитывает кодировки и все контексты.', icon: 'ban' },
        { title: 'Подробные ошибки БД', text: 'Текст ошибки подсказывает структуру запроса.', icon: 'crash' },
      ],
    },
    {
      kind: 'code',
      title: 'Конкатенация и параметризованный запрос',
      lead: 'Учебный пример на sqlite3. Значение email вводит пользователь.',
      lang: 'python',
      blocks: [
        {
          label: 'Уязвимо',
          tone: 'bad',
          code: `email = form["email"]
query = ("SELECT id, name FROM users "
         f"WHERE email = '{email}'")
cur.execute(query)

# email = "' OR '1'='1"
# WHERE email = '' OR '1'='1'
# → вернутся все пользователи`,
        },
        {
          label: 'Исправлено',
          tone: 'good',
          code: `email = form["email"]
cur.execute(
    "SELECT id, name FROM users WHERE email = ?",
    (email,),
)

# СУБД получает шаблон и значение
# раздельно: кавычки в email —
# просто символы строки`,
        },
      ],
      notes: [
        'Плейсхолдер зависит от драйвера: ? в sqlite3, %s в psycopg, :name в SQLAlchemy.',
        'Плейсхолдер подставляет только значения, но не имена таблиц и столбцов.',
      ],
    },
    {
      kind: 'code',
      title: 'ORM и её ограничения',
      lead: 'SQLAlchemy параметризует значения автоматически, но не спасает от сырого SQL и динамических идентификаторов.',
      lang: 'python',
      blocks: [
        {
          label: 'Уязвимо',
          tone: 'bad',
          code: `sort = request.query_params["sort"]
session.execute(text(
    f"SELECT * FROM users ORDER BY {sort}"
))`,
        },
        {
          label: 'Исправлено',
          tone: 'good',
          code: `SORT = {"name": User.name,
        "created": User.created_at}
column = SORT.get(sort, User.id)
stmt = (select(User)
        .where(User.email == email)
        .order_by(column))
users = session.scalars(stmt).all()`,
        },
      ],
      notes: [
        'text() с f-строкой так же опасен, как ручная склейка.',
        'Идентификаторы — только из белого списка, заданного в коде.',
      ],
    },
    {
      kind: 'compare',
      title: 'Валидация данных: вторая линия защиты',
      lead: 'Валидация уменьшает поверхность атаки, но не заменяет параметризацию.',
      left: {
        title: 'Делать',
        tone: 'good',
        items: [
          'Проверять тип: число, UUID, дата',
          'Ограничивать длину и формат',
          'Использовать белые списки значений',
          'Отклонять некорректный ввод с ответом 400 или 422',
        ],
      },
      right: {
        title: 'Не делать',
        tone: 'bad',
        items: [
          'Полагаться на проверку в браузере',
          'Вырезать «опасные слова» вроде SELECT',
          'Экранировать кавычки вручную',
          'Показывать клиенту текст ошибки СУБД',
        ],
      },
    },
    {
      kind: 'table',
      title: 'Минимальные привилегии для базы данных',
      lead: 'Если инъекция всё же случится, права учётной записи определяют масштаб ущерба.',
      head: ['Учётная запись', 'Права', 'Кто использует'],
      rows: [
        ['notes_app', 'SELECT, INSERT, UPDATE, DELETE на таблицы приложения', 'Приложение'],
        ['notes_report', 'Только SELECT на нужные представления', 'Отчёты и аналитика'],
        ['notes_migrator', 'Изменение схемы (DDL)', 'Конвейер CI/CD при миграциях'],
        ['postgres (суперпользователь)', 'Все права', 'Только администратор, не приложение'],
      ],
      note: 'Дополнительно: БД недоступна из интернета, пароль учётной записи хранится в менеджере секретов, резервные копии проверяются.',
    },
    {
      kind: 'table',
      title: 'Другие виды серверных инъекций',
      head: ['Вид', 'Как возникает', 'Защита'],
      rows: [
        ['Команды ОС (CWE-78)', 'subprocess с shell=True и вводом пользователя', 'Аргументы списком, без оболочки'],
        ['Шаблоны (SSTI)', 'Пользователь передаёт сам шаблон Jinja2', 'Шаблоны только из кода, ввод — как данные'],
        ['NoSQL', 'Объект {"$ne": null} вместо строки в фильтре', 'Схема и строгие типы полей'],
        ['XML (XXE)', 'Парсер разрешает внешние сущности', 'Безопасный парсер defusedxml'],
        ['Десериализация', 'pickle.loads от клиента выполняет код', 'Только JSON со схемой'],
      ],
    },
    {
      kind: 'code',
      title: 'Безопасные примеры на Python',
      lang: 'python',
      blocks: [
        {
          code: `# Команда ОС: аргументы списком, без оболочки
subprocess.run(["convert", src_path, dst_path],
               check=True, timeout=30)

# Шаблоны: пользователь передаёт данные, а не шаблон
env = Environment(loader=FileSystemLoader("templates"),
                  autoescape=True)
html = env.get_template("hello.html").render(name=name)

# XML: парсер без внешних сущностей
from defusedxml.ElementTree import fromstring
root = fromstring(xml_bytes)

# Данные от клиента: JSON вместо pickle
payload = NoteIn.model_validate_json(body)`,
        },
      ],
      notes: [
        'Общий принцип: разделять код и данные на уровне API библиотеки.',
        'Пути src_path и dst_path формирует сервер, а не пользователь.',
        'model_validate_json (Pydantic) сразу проверяет схему.',
      ],
    },
    {
      kind: 'steps',
      title: 'Тестирование на локальном учебном стенде',
      lead: 'Только на собственном приложении. Проверка чужих систем без письменного разрешения незаконна.',
      steps: [
        { title: 'Стенд', text: 'Учебное приложение в Docker на своём компьютере с тестовыми данными.' },
        { title: 'Автотесты', text: 'Вредоносные строки во всех полях, проверка, что данные не изменились.' },
        { title: 'SAST', text: 'Bandit (правило B608) и Semgrep находят SQL, собранный из строк.' },
        { title: 'DAST', text: 'OWASP ZAP сканирует работающий стенд и отчёт разбирается командой.' },
      ],
    },
    {
      kind: 'code',
      title: 'Автотест: инъекция не проходит',
      lead: 'pytest и тестовый клиент FastAPI на учебной базе с фиктивными пользователями.',
      lang: 'python',
      blocks: [
        {
          label: 'tests/test_login.py',
          tone: 'good',
          code: `PAYLOADS = ["' OR '1'='1", "admin' --",
            "x'; DROP TABLE users; --"]

@pytest.mark.parametrize("payload", PAYLOADS)
def test_login_rejects_injection(client, db, payload):
    users_before = db.count_users()
    r = client.post("/api/login",
                    json={"email": payload, "password": "x"})
    assert r.status_code in (401, 422)
    assert "SQL" not in r.text
    assert db.count_users() == users_before`,
        },
      ],
      notes: [
        'Вход не выполнен, таблица не удалена, текст ошибки СУБД не раскрыт.',
        'Тест запускается в CI при каждом изменении.',
      ],
    },
    {
      kind: 'summary',
      points: [
        'Инъекция — смешение кода и данных; лечится их разделением.',
        'Параметризованные запросы — основная защита от SQL-инъекций.',
        'ORM не защищает сырой SQL и динамические имена столбцов.',
        'Минимальные привилегии БД ограничивают ущерб от ошибки.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Рекомендации по предотвращению',
      items: [
        'Все запросы параметризованы, склейки SQL нет',
        'Имена столбцов и таблиц — только из белого списка',
        'Входные данные проверяются по схеме на сервере',
        'Приложение работает под учётной записью с минимальными правами',
        'Ошибки СУБД не показываются клиенту',
        'Команды ОС — без shell, XML — через defusedxml',
        'SAST и автотесты на инъекции в CI',
        'Проверки выполняются только на своём стенде',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'SQL Injection Prevention Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'Injection Prevention Cheat Sheet; OWASP Top 10:2025 A05 Injection', org: 'OWASP Foundation' },
        { title: 'CWE-89, CWE-78, CWE-1336, CWE-611, CWE-502', org: 'MITRE' },
        { title: 'sqlite3 — DB-API 2.0 interface: placeholders (docs.python.org)', org: 'Python Software Foundation' },
        { title: 'SQLAlchemy 2.0: Using SELECT Statements', org: 'Документация SQLAlchemy' },
        { title: 'Bandit: B608 hardcoded_sql_expressions', org: 'PyCQA' },
      ],
    },
  ],
} satisfies Presentation
