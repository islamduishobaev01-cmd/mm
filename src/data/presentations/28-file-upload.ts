import type { Presentation } from '../types'

export default {
  slug: 'bezopasnaya-zagruzka-faylov',
  title: 'Безопасная обработка файлов, загружаемых пользователями',
  description: 'Подмена расширения и MIME-типа, сигнатуры, лимиты, случайные имена, Path Traversal, изолированная обработка и выдача файлов в FastAPI.',
  section: 'dev',
  icon: 'upload',
  tone: 'coral',
  subtitle: 'Загруженный файл — это недоверенные данные, только большие',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: уметь реализовать загрузку и выдачу файлов так, чтобы файл не стал способом выполнить код или прочитать чужие данные.',
      items: [
        { title: 'Угрозы', text: 'Что может пойти не так', icon: 'alert' },
        { title: 'Тип файла', text: 'Расширение, MIME, сигнатура', icon: 'scan' },
        { title: 'Лимиты', text: 'Размер и количество', icon: 'gauge' },
        { title: 'Имена и пути', text: 'Path Traversal', icon: 'route' },
        { title: 'Обработка', text: 'Антивирус и изоляция', icon: 'container' },
        { title: 'FastAPI', text: 'Загрузка и выдача', icon: 'code' },
      ],
    },
    {
      kind: 'cards',
      title: 'Угрозы при загрузке файлов',
      variant: 'threat',
      items: [
        { title: 'Исполнение кода', icon: 'terminal', text: 'Файл shell.php попадает в каталог, который сервер исполняет.' },
        { title: 'XSS через файл', icon: 'code', text: 'SVG или HTML со скриптом открывается на домене сайта.' },
        { title: 'Path Traversal', icon: 'route', text: 'Имя ../../app/config.py перезаписывает файлы сервера.' },
        { title: 'Отказ в обслуживании', icon: 'crash', text: 'Гигантские файлы, «zip-бомбы», изображения на миллиарды пикселей.' },
        { title: 'Атака на обработчик', icon: 'bug', text: 'Уязвимость в библиотеке разбора изображений или документов.' },
        { title: 'Вредоносное ПО', icon: 'skull', text: 'Сервис раздаёт заражённые файлы другим пользователям.' },
      ],
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'MIME-тип', def: 'Тип содержимого (image/png). В запросе его указывает клиент в Content-Type — значит, подделать его ничего не стоит.' },
        { term: 'Сигнатура (magic bytes)', def: 'Характерные первые байты формата: PNG начинается с 89 50 4E 47, PDF — с %PDF-.' },
        { term: 'Path Traversal (CWE-22)', def: 'Выход за пределы разрешённого каталога через ../ или абсолютный путь в имени файла.' },
        { term: 'Изолированная обработка', def: 'Разбор файла в отдельном процессе или контейнере без сети и с жёсткими лимитами ресурсов.' },
      ],
    },
    {
      kind: 'compare',
      title: 'Подмена расширения и MIME-типа',
      left: {
        title: 'Что присылает клиент',
        tone: 'bad',
        items: [
          'Имя photo.jpg.php или avatar.png%00.php',
          'Content-Type: image/jpeg для любого содержимого',
          'Файл-«полиглот»: валидный JPEG и одновременно скрипт',
          'Всё это полностью под контролем атакующего',
        ],
      },
      right: {
        title: 'Что проверяет сервер',
        tone: 'good',
        items: [
          'Белый список разрешённых форматов',
          'Сигнатуру и полный разбор содержимого',
          'Для изображений — перекодирование в чистый файл',
          'Расширение и имя назначает сам сервер',
        ],
      },
    },
    {
      kind: 'code',
      title: 'Проверка сигнатуры файла',
      lead: 'Тип определяется по содержимому, а не по имени и заголовку запроса.',
      lang: 'python',
      blocks: [
        {
          code: `SIGNATURES = {
    b"\\x89PNG\\r\\n\\x1a\\n": ("png", "image/png"),
    b"\\xff\\xd8\\xff": ("jpg", "image/jpeg"),
    b"%PDF-": ("pdf", "application/pdf"),
}

def detect_type(head: bytes) -> tuple[str, str] | None:
    for magic, kind in SIGNATURES.items():
        if head.startswith(magic):
            return kind
    return None`,
        },
      ],
      notes: [
        'Сигнатура — необходимая, но не достаточная проверка: полиглоты её проходят.',
        'Поэтому изображения дополнительно открывают и пересохраняют через Pillow.',
        'Белый список форматов короткий: только то, что действительно нужно.',
      ],
    },
    {
      kind: 'steps',
      title: 'Ограничение размера и количества',
      steps: [
        { title: 'Размер запроса', text: 'Лимит на обратном прокси (например, client_max_body_size в nginx) и в приложении.' },
        { title: 'Число файлов', text: 'Максимум файлов в запросе, квота на пользователя в сутки.' },
        { title: 'Размер после распаковки', text: 'Лимит пикселей изображения и распакованного размера архивов.' },
        { title: 'Время обработки', text: 'Тайм-аут и лимиты CPU и памяти для обработчиков.' },
      ],
    },
    {
      kind: 'code',
      title: 'Случайные имена и защита от Path Traversal',
      lang: 'python',
      blocks: [
        {
          label: 'Уязвимо',
          tone: 'bad',
          code: `name = file.filename
# "../../app/main.py"
path = os.path.join("static/uploads",
                    name)
with open(path, "wb") as f:
    f.write(data)`,
        },
        {
          label: 'Исправлено',
          tone: 'good',
          code: `UPLOAD_DIR = Path("/srv/data/uploads").resolve()
name = f"{uuid4().hex}.{ext}"
path = (UPLOAD_DIR / name).resolve()
if not path.is_relative_to(UPLOAD_DIR):
    raise HTTPException(status_code=400)
path.write_bytes(data)`,
        },
      ],
      notes: [
        'Случайное имя исключает перезапись, угадывание и обход каталога.',
        'Исходное имя хранится в БД как метаданные и экранируется при выводе.',
        'Каталог вне веб-корня: веб-сервер не может исполнить или отдать файл напрямую.',
        'ext берётся из результата detect_type, а не из имени файла.',
      ],
    },
    {
      kind: 'flow',
      title: 'Антивирусная проверка и изолированная обработка',
      nodes: [
        { title: 'Карантин', text: 'Файл сохранён, но недоступен пользователям', icon: 'fileLock' },
        { title: 'Антивирус', text: 'Проверка отдельным сервисом, например ClamAV', icon: 'scan' },
        { title: 'Песочница', text: 'Перекодирование и конвертация в контейнере без сети', icon: 'container' },
        { title: 'Публикация', text: 'Только чистый результат получает статус «готов»', icon: 'badge' },
      ],
      caption: 'Изображения пересохраняются Pillow с удалением метаданных EXIF, документы конвертируются в PDF. Библиотеки разбора (ImageMagick, LibreOffice) регулярно обновляются: в них находили уязвимости удалённого выполнения кода.',
    },
    {
      kind: 'table',
      title: 'Хранение, права доступа и безопасная выдача',
      head: ['Мера', 'Что даёт'],
      rows: [
        ['Хранение вне публичной директории или в закрытом бакете', 'Файл нельзя открыть или исполнить по прямому адресу'],
        ['Проверка владельца при каждой выдаче', 'Нет доступа к чужим файлам перебором идентификаторов'],
        ['Content-Type из белого списка + nosniff', 'Браузер не «угадает» в файле HTML или скрипт'],
        ['Content-Disposition: attachment', 'Файл скачивается, а не открывается на странице сайта'],
        ['Отдельный домен для пользовательского контента', 'Скрипт в файле не получит cookie основного сайта'],
        ['Подписанные ссылки с коротким сроком', 'Ссылку нельзя использовать бесконечно'],
      ],
    },
    {
      kind: 'code',
      title: 'Загрузка файла в FastAPI',
      lang: 'python',
      blocks: [
        {
          code: `MAX_SIZE = 5 * 1024 * 1024
ALLOWED = {"png", "jpg", "pdf"}

@app.post("/api/files", status_code=201)
async def upload(file: UploadFile,
                 user: User = Depends(current_user)):
    data = await file.read(MAX_SIZE + 1)
    if len(data) > MAX_SIZE:
        raise HTTPException(413, "Файл больше 5 МБ")
    kind = detect_type(data[:16])
    if kind is None or kind[0] not in ALLOWED:
        raise HTTPException(415, "Формат не разрешён")
    stored = f"{uuid4().hex}.{kind[0]}"
    (UPLOAD_DIR / stored).write_bytes(data)
    files.create(owner_id=user.id, stored=stored,
                 original=file.filename, mime=kind[1],
                 status="quarantine")
    return {"id": stored}`,
        },
      ],
      notes: [
        'Тип — по сигнатуре, имя — случайное, файл — в карантине.',
        'FastAPI разбирает multipart до вызова функции: общий лимит тела обязательно ставится на прокси.',
        'Для UploadFile нужен пакет python-multipart.',
      ],
    },
    {
      kind: 'code',
      title: 'Безопасная выдача файла',
      lang: 'python',
      blocks: [
        {
          code: `@app.get("/api/files/{file_id}")
def download(file_id: str,
             user: User = Depends(current_user)):
    meta = files.get(stored=file_id, owner_id=user.id,
                     status="ready")
    if meta is None:
        raise HTTPException(status_code=404)
    return FileResponse(
        UPLOAD_DIR / meta.stored,
        media_type=meta.mime,      # из белого списка
        filename=meta.original,    # attachment
        headers={"X-Content-Type-Options": "nosniff"},
    )`,
        },
      ],
      notes: [
        'Файл ищется по владельцу и статусу: чужие и непроверенные не выдаются.',
        'Путь собирается из имени, созданного сервером, а не из запроса.',
        'FileResponse с filename отправляет Content-Disposition: attachment.',
      ],
    },
    {
      kind: 'summary',
      points: [
        'Имя, расширение и Content-Type от клиента не являются доказательством типа.',
        'Тип определяется по содержимому, имя и путь назначает сервер.',
        'Файлы проверяются и обрабатываются изолированно, с жёсткими лимитами.',
        'Выдача — только владельцу, с безопасными заголовками и вне веб-корня.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист загрузки файлов',
      items: [
        'Белый список форматов и проверка сигнатуры',
        'Лимиты размера, количества и квоты',
        'Случайные имена, проверка пути',
        'Хранение вне публичной директории',
        'Карантин, антивирус и песочница',
        'Изображения перекодируются, SVG запрещены или санитизируются',
        'Выдача с проверкой прав, nosniff и attachment',
        'Библиотеки обработки файлов регулярно обновляются',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'File Upload Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'CWE-434 Unrestricted Upload of File with Dangerous Type; CWE-22', org: 'MITRE' },
        { title: 'FastAPI: Request Files, Custom Response — FileResponse', org: 'Документация FastAPI' },
        { title: 'pathlib — Path.resolve, Path.is_relative_to (docs.python.org)', org: 'Python Software Foundation' },
        { title: 'Pillow: Image file formats, Decompression bomb protection', org: 'Документация Pillow' },
        { title: 'ClamAV Documentation (docs.clamav.net)', org: 'Cisco Talos' },
      ],
    },
  ],
} satisfies Presentation
