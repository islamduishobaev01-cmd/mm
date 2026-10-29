import type { Presentation } from '../types'

export default {
  slug: 'secure-sdlc-devsecops',
  title: 'Secure SDLC и DevSecOps',
  description: 'Безопасность на всех этапах разработки: моделирование угроз, ревью, SAST, DAST, SCA, секреты, управление уязвимостями и безопасный CI/CD.',
  section: 'dev',
  icon: 'workflow',
  tone: 'violet',
  subtitle: 'Безопасность как часть процесса, а не проверка перед релизом',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: понимать, какие практики безопасности встраиваются в каждый этап разработки и как автоматизировать их в CI/CD.',
      items: [
        { title: 'Жизненный цикл', text: 'Secure SDLC и NIST SSDF', icon: 'refresh' },
        { title: 'Проектирование и код', text: 'Моделирование угроз и ревью', icon: 'searchCode' },
        { title: 'Автоматические проверки', text: 'SAST, DAST, SCA, секреты', icon: 'scan' },
        { title: 'Уязвимости', text: 'Оценка и устранение', icon: 'bug' },
        { title: 'DevSecOps', text: 'Принципы и культура', icon: 'users' },
        { title: 'Pipeline', text: 'Пример и чек-лист', icon: 'workflow' },
      ],
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'Secure SDLC', def: 'Жизненный цикл разработки, в котором на каждом этапе выполняются определённые действия по безопасности.' },
        { term: 'NIST SSDF', def: 'Secure Software Development Framework (SP 800-218) — набор практик безопасной разработки, не привязанный к методологии.' },
        { term: 'DevSecOps', def: 'Подход, при котором безопасность встроена в процессы и автоматизацию DevOps и является общей ответственностью команды.' },
        { term: 'Shift left', def: 'Перенос проверок на ранние этапы: ошибку в требованиях исправить дешевле, чем в продакшене.' },
      ],
    },
    {
      kind: 'flow',
      title: 'Безопасность на каждом этапе',
      nodes: [
        { title: 'Планирование', text: 'Требования безопасности, критерии по OWASP ASVS', icon: 'clipboard' },
        { title: 'Проектирование', text: 'Моделирование угроз, безопасная архитектура', icon: 'target' },
        { title: 'Реализация', text: 'Безопасное кодирование, ревью, SAST', icon: 'code' },
        { title: 'Тестирование', text: 'Тесты безопасности, DAST', icon: 'scan' },
        { title: 'Развёртывание', text: 'Сканирование образов, проверка конфигурации', icon: 'container' },
        { title: 'Эксплуатация', text: 'Мониторинг, реагирование, исправления', icon: 'activity' },
      ],
    },
    {
      kind: 'table',
      title: 'Четыре группы практик NIST SSDF',
      head: ['Группа', 'Цель', 'Примеры'],
      rows: [
        ['PO — Prepare the Organization', 'Подготовить людей, процессы и инструменты', 'Роли, обучение, стандарты кодирования'],
        ['PS — Protect the Software', 'Защитить код и артефакты от изменения', 'Контроль доступа к репозиторию, подпись релизов'],
        ['PW — Produce Well-Secured Software', 'Создавать ПО с минимумом уязвимостей', 'Моделирование угроз, ревью, тестирование'],
        ['RV — Respond to Vulnerabilities', 'Находить и устранять уязвимости после выпуска', 'Приём сообщений, анализ причин, исправления'],
      ],
      note: 'NIST SP 800-218, версия 1.1 (2022). Проверено 29.10.2026.',
    },
    {
      kind: 'points',
      title: 'Моделирование угроз и ревью кода',
      items: [
        { title: 'Модель угроз на этапе дизайна', text: 'Для каждой новой функции: схема, STRIDE, меры. Подробно — в теме 22.', icon: 'target' },
        { title: 'Ревью каждого изменения', text: 'Не менее одного рецензента, защищённая основная ветка.', icon: 'git' },
        { title: 'Фокус ревью', text: 'Права доступа, обработка ввода, секреты, криптография, ошибки.', icon: 'searchCode' },
        { title: 'Владельцы критичного кода', text: 'Изменения аутентификации и платежей проверяют назначенные специалисты.', icon: 'userCheck' },
      ],
    },
    {
      kind: 'table',
      title: 'SAST, DAST, SCA и поиск секретов',
      head: ['Метод', 'Что проверяет', 'Инструменты', 'Ограничения'],
      rows: [
        ['SAST', 'Исходный код без запуска', 'Semgrep, CodeQL, Bandit', 'Ложные срабатывания, не видит конфигурацию'],
        ['DAST', 'Работающее приложение снаружи', 'OWASP ZAP, Burp Suite', 'Нужен стенд, плохо видит логику'],
        ['SCA', 'Зависимости и их известные CVE', 'pip-audit, npm audit, Dependabot', 'Не находит ошибки в вашем коде'],
        ['Поиск секретов', 'Ключи и пароли в коде и истории', 'gitleaks, push protection', 'Утёкший секрет нужно отозвать'],
      ],
      note: 'Методы дополняют друг друга. Ни один инструмент не заменяет ревью и моделирование угроз.',
    },
    {
      kind: 'compare',
      title: 'Управление секретами в разработке',
      left: {
        title: 'Предотвратить',
        tone: 'good',
        items: [
          'Pre-commit хук и проверка в CI на секреты',
          '.env в .gitignore, пример — в .env.example без значений',
          'Секреты CI — в хранилище платформы, а не в YAML',
          'Вместо долгоживущих облачных ключей — OIDC-федерация',
        ],
      },
      right: {
        title: 'Если секрет утёк',
        tone: 'bad',
        items: [
          'Сразу отозвать и выпустить новый',
          'Удаление коммита не помогает: копии уже есть',
          'Проверить журналы на использование ключа',
          'Найти причину и добавить автоматическую проверку',
        ],
      },
    },
    {
      kind: 'steps',
      title: 'Управление уязвимостями',
      steps: [
        { title: 'Обнаружить', text: 'Сканеры, сообщения исследователей, бюллетени поставщиков.' },
        { title: 'Оценить', text: 'CVSS v4.0, каталог CISA KEV, достижимость кода.' },
        { title: 'Приоритизировать', text: 'Сроки устранения по критичности, владелец задачи.' },
        { title: 'Исправить', text: 'Обновление, патч или временная компенсирующая мера.' },
        { title: 'Проверить', text: 'Повторное сканирование и тест на регрессию.' },
      ],
    },
    {
      kind: 'points',
      title: 'Принципы DevSecOps',
      items: [
        { title: 'Автоматизация', text: 'Повторяемые проверки выполняет конвейер, а не память людей.', icon: 'workflow' },
        { title: 'Быстрая обратная связь', text: 'Разработчик узнаёт о проблеме в своём pull request.', icon: 'zap' },
        { title: 'Общая ответственность', text: 'Безопасность — задача всей команды, а не отдельного отдела.', icon: 'users' },
        { title: 'Всё как код', text: 'Инфраструктура, политики и конфигурация — в репозитории с ревью.', icon: 'fileCode' },
        { title: 'Минимальные права конвейера', text: 'CI имеет доступ только к тому, что нужно для сборки.', icon: 'userLock' },
        { title: 'Измеримость', text: 'Время устранения уязвимостей и покрытие проверками.', icon: 'gauge' },
      ],
    },
    {
      kind: 'flow',
      title: 'Пример безопасного CI/CD pipeline',
      nodes: [
        { title: 'Коммит', text: 'Pre-commit: секреты, линтер', icon: 'git' },
        { title: 'Pull request', text: 'Ревью, тесты, SAST, SCA', icon: 'searchCode' },
        { title: 'Сборка образа', text: 'Минимальная база, SBOM, сканирование', icon: 'container' },
        { title: 'Подпись', text: 'Подпись образа и сведения о сборке', icon: 'badge' },
        { title: 'Тестовый стенд', text: 'DAST и интеграционные тесты', icon: 'scan' },
        { title: 'Продакшен', text: 'Одобрение, мониторинг, откат', icon: 'server' },
      ],
    },
    {
      kind: 'code',
      title: 'Проверки безопасности в GitHub Actions',
      lang: 'yaml',
      blocks: [
        {
          label: '.github/workflows/security.yml',
          tone: 'good',
          code: `on: [pull_request]
permissions:
  contents: read  # минимальные права токена
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
        with:
          persist-credentials: false
      - run: pip install -r requirements-dev.txt
      - run: bandit -r src -ll  # SAST
      - run: pip-audit -r requirements.txt  # SCA
      - run: gitleaks git --redact  # секреты
      - run: |
          docker build -t app:ci .
          trivy image --exit-code 1 \\
            --severity CRITICAL,HIGH app:ci`,
        },
      ],
      notes: [
        'Любая проверка с ошибкой останавливает слияние.',
        'Сторонние actions в продакшене закрепляют по полному SHA коммита.',
        'Инструменты в requirements-dev.txt — с фиксированными версиями.',
      ],
    },
    {
      kind: 'summary',
      points: [
        'Безопасность встраивается в каждый этап жизненного цикла, а не добавляется в конце.',
        'NIST SSDF задаёт практики: подготовка, защита, качество, реагирование.',
        'SAST, DAST, SCA и поиск секретов дополняют ревью и моделирование угроз.',
        'DevSecOps — это автоматизация плюс общая ответственность команды.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Практический чек-лист команды',
      items: [
        'Требования безопасности есть в задачах',
        'Для новых функций обновляется модель угроз',
        'Основная ветка защищена, изменения проходят ревью',
        'SAST, SCA и поиск секретов в каждом pull request',
        'Образы сканируются и подписываются',
        'DAST на тестовом стенде перед релизом',
        'Есть процесс приёма сообщений об уязвимостях',
        'Сроки устранения уязвимостей соблюдаются и измеряются',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'SP 800-218. Secure Software Development Framework, v1.1, 2022', org: 'NIST' },
        { title: 'OWASP SAMM v2; OWASP DevSecOps Guideline', org: 'OWASP Foundation' },
        { title: 'SLSA — Supply-chain Levels for Software Artifacts (slsa.dev)', org: 'OpenSSF' },
        { title: 'CVSS v4.0 Specification, 2023', org: 'FIRST' },
        { title: 'Known Exploited Vulnerabilities Catalog', org: 'CISA' },
        { title: 'GitHub Docs: Security hardening for GitHub Actions', org: 'GitHub' },
      ],
    },
  ],
} satisfies Presentation
