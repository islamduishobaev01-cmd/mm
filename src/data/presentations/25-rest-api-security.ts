import type { Presentation } from '../types'

export default {
  slug: 'bezopasnost-rest-api',
  title: 'Безопасность REST API',
  description: 'Аутентификация запросов, BOLA, валидация, ограничение частоты, CORS, обработка ошибок, журналирование и пример защищённого API на FastAPI.',
  section: 'dev',
  icon: 'webhook',
  tone: 'teal',
  subtitle: 'Каждый запрос — от незнакомца, пока сервер не доказал обратное',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: научиться проектировать и проверять API так, чтобы ни один запрос не выполнялся без проверки личности, прав и данных.',
      items: [
        { title: 'REST и HTTP', text: 'Методы и их семантика', icon: 'globe' },
        { title: 'Доступ', text: 'Аутентификация и BOLA', icon: 'userLock' },
        { title: 'Данные', text: 'Валидация входа и выхода', icon: 'filter' },
        { title: 'Нагрузка', text: 'Лимиты и защита от перебора', icon: 'gauge' },
        { title: 'Транспорт', text: 'HTTPS, CORS и секреты', icon: 'lock' },
        { title: 'Практика', text: 'FastAPI и чек-лист', icon: 'code' },
      ],
    },
    {
      kind: 'table',
      title: 'REST API и HTTP-методы',
      lead: 'Ресурсы адресуются URL, действие задаётся методом. Метод влияет на то, какие защиты нужны.',
      head: ['Метод', 'Действие', 'Безопасный', 'Идемпотентный'],
      rows: [
        ['GET', 'Получить ресурс', 'Да — не меняет состояние', 'Да'],
        ['POST', 'Создать ресурс или выполнить действие', 'Нет', 'Нет'],
        ['PUT', 'Заменить ресурс целиком', 'Нет', 'Да'],
        ['PATCH', 'Частично изменить ресурс', 'Нет', 'Не гарантируется'],
        ['DELETE', 'Удалить ресурс', 'Нет', 'Да'],
      ],
      note: 'Семантика по RFC 9110. GET не должен изменять данные: такие запросы кешируются, повторяются и выполняются ссылками и предзагрузкой.',
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'Аутентификация запроса', def: 'Проверка, кто отправил запрос: токен в заголовке Authorization, cookie сессии, mTLS или подпись запроса.' },
        { term: 'BOLA', def: 'Broken Object Level Authorization — доступ к чужому объекту подменой идентификатора. Первый риск OWASP API Security Top 10.' },
        { term: 'Rate limiting', def: 'Ограничение числа запросов клиента за интервал времени. При превышении — ответ 429 Too Many Requests.' },
        { term: 'CORS', def: 'Механизм браузера, который разрешает или запрещает чтение ответов вашего API скриптам с других сайтов.' },
      ],
    },
    {
      kind: 'table',
      title: 'OWASP API Security Top 10 — редакция 2023',
      head: ['Риск', 'Суть'],
      rows: [
        ['API1 Broken Object Level Authorization', 'Чужие объекты по подменённому id'],
        ['API2 Broken Authentication', 'Слабая проверка токенов и входа'],
        ['API3 Broken Object Property Level Authorization', 'Лишние поля в ответе или изменение запрещённых полей'],
        ['API4 Unrestricted Resource Consumption', 'Нет лимитов на запросы, размер и стоимость операций'],
        ['API5 Broken Function Level Authorization', 'Пользователь вызывает функции администратора'],
      ],
      note: 'Также в списке: API6 доступ к чувствительным бизнес-процессам, API7 SSRF, API8 ошибки конфигурации, API9 учёт версий API, API10 небезопасное использование чужих API. Проверено 29.10.2026.',
    },
    {
      kind: 'compare',
      title: 'BOLA: проверка прав только на сервере',
      lead: 'GET /api/users/1042/grades — что будет, если заменить 1042 на 1043?',
      left: {
        title: 'Уязвимо',
        tone: 'bad',
        items: [
          'Сервер проверяет только, что токен действителен',
          'Идентификатор из URL сразу идёт в запрос к БД',
          'Интерфейс просто не показывает чужие ссылки',
          'Последовательные id облегчают перебор',
        ],
      },
      right: {
        title: 'Защищено',
        tone: 'good',
        items: [
          'Каждый запрос сверяет владельца или роль для конкретного объекта',
          'Выборка из БД сразу ограничена текущим пользователем',
          'Проверка вынесена в общую зависимость и покрыта тестами',
          'Непредсказуемые id (UUID) — дополнительная, а не основная мера',
        ],
      },
    },
    {
      kind: 'points',
      title: 'Валидация входных и выходных данных',
      items: [
        { title: 'Строгая схема', text: 'Типы, длины, диапазоны и форматы для каждого поля. Лишние поля отклоняются.', icon: 'braces' },
        { title: 'Белые списки', text: 'Сортировка и фильтры — только по разрешённым полям.', icon: 'filter' },
        { title: 'Mass assignment', text: 'Клиент не может прислать role или is_admin и изменить их.', icon: 'userX' },
        { title: 'Фильтрация ответа', text: 'Отдельная схема ответа: хеши паролей и служебные поля не уходят клиенту.', icon: 'eyeOff' },
        { title: 'Размер запроса', text: 'Лимит тела запроса и пагинация с максимальным размером страницы.', icon: 'gauge' },
      ],
    },
    {
      kind: 'steps',
      title: 'Ограничение частоты и защита от перебора',
      steps: [
        { title: 'Лимиты по ключу', text: 'По пользователю, токену и IP; для входа — отдельный строгий лимит.' },
        { title: 'Ответ 429', text: 'С заголовком Retry-After, без раскрытия деталей.' },
        { title: 'Нарастающие задержки', text: 'После неудачных попыток входа, затем — CAPTCHA или MFA.' },
        { title: 'Лимиты стоимости', text: 'Тайм-ауты, размер выборки, число вложенных операций.' },
      ],
    },
    {
      kind: 'compare',
      title: 'CORS: настройка без ошибок',
      lead: 'CORS не защищает API от запросов — он лишь решает, сможет ли скрипт чужого сайта прочитать ответ.',
      left: {
        title: 'Опасно',
        tone: 'bad',
        items: [
          'Отражать любой Origin из запроса вместе с allow-credentials',
          'Разрешать null и все поддомены по шаблону',
          'Считать CORS заменой аутентификации',
        ],
      },
      right: {
        title: 'Правильно',
        tone: 'good',
        items: [
          'Явный список доверенных источников',
          'Только нужные методы и заголовки',
          'Аутентификация и проверка прав на сервере — всегда',
        ],
      },
    },
    {
      kind: 'points',
      title: 'HTTPS, секреты, ошибки и журналы',
      items: [
        { title: 'Только HTTPS', text: 'TLS 1.2+, HSTS; HTTP-запросы не обрабатываются.', icon: 'lock' },
        { title: 'Секреты вне кода', text: 'Ключи — в переменных окружения или менеджере секретов, с ротацией.', icon: 'key' },
        { title: 'Безопасные ошибки', text: 'Клиенту — код и общее сообщение (RFC 9457), подробности — только в журнал.', icon: 'crash' },
        { title: 'Журнал подозрительного', text: 'Отказы 401/403, превышения лимитов, перебор id — с идентификатором запроса.', icon: 'activity' },
        { title: 'Без секретов в логах', text: 'Токены, пароли и персональные данные маскируются.', icon: 'eyeOff' },
      ],
    },
    {
      kind: 'code',
      title: 'Защищённый эндпоинт на FastAPI',
      lang: 'python',
      blocks: [
        {
          code: `class NoteIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(max_length=10_000)

class NoteOut(BaseModel):
    id: UUID
    title: str
    body: str

@app.put("/api/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: UUID, data: NoteIn,
                user: User = Depends(current_user)):
    note = notes.get(id=note_id, owner_id=user.id)
    if note is None:
        log.warning("note_denied user=%s note=%s",
                    user.id, note_id)
        raise HTTPException(status_code=404)
    return notes.update(note, **data.model_dump())`,
        },
      ],
      notes: [
        'current_user проверяет токен и возвращает 401 при ошибке.',
        'extra="forbid" отклоняет лишние поля, в том числе owner_id.',
        'response_model отбрасывает всё, чего нет в NoteOut.',
        'Отказ журналируется без содержимого заметки.',
      ],
    },
    {
      kind: 'code',
      title: 'CORS и глобальная обработка ошибок',
      lang: 'python',
      blocks: [
        {
          label: 'Настройка приложения',
          tone: 'good',
          code: `app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://notes.example.edu"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    log.exception("unhandled error")  # детали — в журнал
    return JSONResponse(status_code=500,
                        content={"detail": "Внутренняя ошибка"})`,
        },
      ],
      notes: [
        'Только один доверенный источник фронтенда.',
        'Клиент не видит трассировку стека, SQL и пути к файлам.',
        'В продакшене — без debug=True и с выключенной документацией /docs, если она не нужна публично.',
        'Лимиты частоты удобно ставить на обратном прокси или шлюзе API.',
      ],
    },
    {
      kind: 'summary',
      points: [
        'Каждый запрос проходит аутентификацию, проверку прав на объект и валидацию.',
        'BOLA — главный риск API: выборки ограничиваются текущим пользователем.',
        'Лимиты частоты и стоимости защищают от перебора и исчерпания ресурсов.',
        'Ошибки и журналы помогают защите, если не раскрывают лишнего.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист безопасности REST API',
      items: [
        'Все эндпоинты требуют аутентификации, кроме явно публичных',
        'Права проверяются для каждого объекта и функции',
        'Входные данные валидируются строгой схемой',
        'Ответы фильтруются отдельной схемой',
        'Есть лимиты частоты, размера и тайм-ауты',
        'CORS разрешает только доверенные источники',
        'Только HTTPS, секреты — вне репозитория',
        'Ошибки обобщены, подозрительные события журналируются',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'OWASP API Security Top 10, редакция 2023, проверено 29.10.2026', org: 'OWASP Foundation' },
        { title: 'REST Security Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'RFC 9110. HTTP Semantics, 2022', org: 'IETF / RFC Editor' },
        { title: 'RFC 9457. Problem Details for HTTP APIs, 2023', org: 'IETF / RFC Editor' },
        { title: 'FastAPI: Security, CORS, Handling Errors (fastapi.tiangolo.com)', org: 'Документация FastAPI' },
        { title: 'Fetch Standard: CORS protocol', org: 'WHATWG' },
      ],
    },
  ],
} satisfies Presentation
