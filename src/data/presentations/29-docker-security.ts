import type { Presentation } from '../types'

export default {
  slug: 'docker-microservices-security',
  title: 'Безопасность Docker и микросервисной архитектуры',
  description: 'Угрозы контейнеризации, безопасный Dockerfile, минимальные образы, запуск без root, секреты, сканирование, изоляция сети и безопасный Compose.',
  section: 'dev',
  icon: 'container',
  tone: 'cyan',
  subtitle: 'Контейнер — не виртуальная машина: изоляцию нужно настроить',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: уметь собрать и запустить контейнеры с минимальными привилегиями и проверить их на уязвимости.',
      items: [
        { title: 'Угрозы', text: 'Чем рискуют контейнеры', icon: 'alert' },
        { title: 'Образы', text: 'Dockerfile и базовые образы', icon: 'package' },
        { title: 'Привилегии', text: 'Без root и privileged', icon: 'userLock' },
        { title: 'Секреты', text: 'Не в образе и не в коде', icon: 'key' },
        { title: 'Сеть и сервисы', text: 'Изоляция, TLS, мониторинг', icon: 'network' },
        { title: 'Практика', text: 'Dockerfile и Compose', icon: 'code' },
      ],
    },
    {
      kind: 'cards',
      title: 'Основные угрозы контейнеризации',
      variant: 'threat',
      items: [
        { title: 'Уязвимые образы', icon: 'bug', text: 'Устаревшие пакеты базового образа и зависимости приложения.' },
        { title: 'Выход из контейнера', icon: 'skull', text: 'Контейнеры делят ядро хоста; privileged и docker.sock открывают путь к хосту.' },
        { title: 'Секреты в образе', icon: 'key', text: 'Слои хранят историю: удалённый файл остаётся в предыдущем слое.' },
        { title: 'Лишние привилегии', icon: 'userX', text: 'Процесс от root со всеми capabilities.' },
        { title: 'Плоская сеть', icon: 'network', text: 'Любой скомпрометированный сервис видит базу и все остальные сервисы.' },
        { title: 'Недоверенные образы', icon: 'package', text: 'Образы с похожими именами в публичных реестрах.' },
      ],
    },
    {
      kind: 'terms',
      title: 'Основные понятия',
      terms: [
        { term: 'Образ', def: 'Неизменяемый шаблон из слоёв файловой системы и метаданных. Из него запускаются контейнеры.' },
        { term: 'Контейнер', def: 'Процесс хоста, изолированный пространствами имён (namespaces) и ограниченный cgroups. Ядро — общее с хостом.' },
        { term: 'Capabilities', def: 'Права root в Linux, разделённые на части: изменение сети, монтирование, обход прав на файлы и другие.' },
        { term: 'Docker socket', def: '/var/run/docker.sock — API демона Docker. Доступ к нему фактически равен root-доступу к хосту.' },
      ],
    },
    {
      kind: 'compare',
      title: 'Безопасность Dockerfile',
      left: {
        title: 'Ошибки',
        tone: 'bad',
        items: [
          'FROM python:latest — версия меняется без предупреждения',
          'COPY . . копирует .git, .env и ключи',
          'Пароли в ENV и ARG — видны в docker inspect и истории',
          'Нет инструкции USER: процесс работает от root',
          'Компиляторы и инструменты сборки в итоговом образе',
        ],
      },
      right: {
        title: 'Практики',
        tone: 'good',
        items: [
          'Фиксированная версия образа, лучше с дайджестом @sha256',
          '.dockerignore и копирование только нужных файлов',
          'Секреты — через BuildKit secrets и при запуске',
          'USER с непривилегированным UID',
          'Многоэтапная сборка: в итог попадает только нужное',
        ],
      },
    },
    {
      kind: 'table',
      title: 'Минимальные базовые образы',
      lead: 'Чем меньше пакетов в образе, тем меньше уязвимостей и инструментов для атакующего.',
      head: ['Базовый образ', 'Состав', 'Когда подходит'],
      rows: [
        ['python:3.13', 'Полный Debian с компиляторами', 'Только для этапа сборки'],
        ['python:3.13-slim', 'Минимальный Debian и Python', 'Хороший выбор по умолчанию'],
        ['python:3.13-alpine', 'Alpine на musl libc', 'Если зависимости совместимы с musl'],
        ['distroless', 'Только среда выполнения, без shell и менеджера пакетов', 'Продакшен с многоэтапной сборкой'],
        ['scratch', 'Пустой образ', 'Статически собранные программы, например на Go'],
      ],
    },
    {
      kind: 'points',
      title: 'Без root и без лишних привилегий',
      items: [
        { title: 'Непривилегированный пользователь', text: 'USER в Dockerfile; на хосте — rootless-режим Docker.', icon: 'userLock' },
        { title: 'Отказ от capabilities', text: '--cap-drop=ALL и добавление только необходимых.', icon: 'ban' },
        { title: 'no-new-privileges', text: 'Процесс не повысит права через setuid-файлы.', icon: 'shield' },
        { title: 'Файловая система только для чтения', text: '--read-only и tmpfs для временных файлов.', icon: 'fileLock' },
        { title: 'Никаких --privileged', text: 'Privileged снимает почти всю изоляцию — только для особых системных задач.', icon: 'alert' },
        { title: 'Не монтировать docker.sock', text: 'Сервис с доступом к сокету управляет всем хостом.', icon: 'plug' },
      ],
    },
    {
      kind: 'compare',
      title: 'Управление секретами',
      left: {
        title: 'Неправильно',
        tone: 'bad',
        items: [
          'ENV DB_PASSWORD=… в Dockerfile',
          'Файл .env внутри образа или в репозитории',
          'Секрет в аргументах командной строки',
          'Один пароль для всех сред и сервисов',
        ],
      },
      right: {
        title: 'Правильно',
        tone: 'good',
        items: [
          'Docker и Compose secrets: файл в /run/secrets/',
          'BuildKit: RUN --mount=type=secret на этапе сборки',
          'Менеджер секретов: Vault, облачные сервисы',
          'Отдельные секреты для каждого сервиса и ротация',
        ],
      },
    },
    {
      kind: 'steps',
      title: 'Сканирование образов и зависимостей',
      steps: [
        { title: 'Зависимости', text: 'pip-audit или npm audit по lock-файлу.' },
        { title: 'Dockerfile', text: 'Линтер Hadolint находит небезопасные инструкции.' },
        { title: 'Образ', text: 'Trivy, Grype или Docker Scout ищут CVE в пакетах.' },
        { title: 'SBOM и подпись', text: 'Список компонентов и подпись образа, например cosign.' },
        { title: 'Политика', text: 'Сборка останавливается при критичных уязвимостях.' },
      ],
    },
    {
      kind: 'points',
      title: 'Сеть, TLS и мониторинг микросервисов',
      items: [
        { title: 'Раздельные сети', text: 'frontend для прокси и API, backend для API и БД.', icon: 'network' },
        { title: 'Внутренние сети', text: 'internal: true — без выхода в интернет; наружу публикуется только прокси.', icon: 'lock' },
        { title: 'TLS между сервисами', text: 'mTLS: сервисы проверяют сертификаты друг друга.', icon: 'badge' },
        { title: 'Аутентификация сервисов', text: 'Каждый сервис — со своей учётной записью и минимальными правами.', icon: 'userCheck' },
        { title: 'Журналы', text: 'В stdout, затем в централизованную систему; без секретов.', icon: 'scroll' },
        { title: 'Мониторинг и лимиты', text: 'Healthcheck, лимиты памяти и CPU, оповещения о сбоях.', icon: 'activity' },
      ],
    },
    {
      kind: 'code',
      title: 'Практика: безопасный Dockerfile',
      lang: 'dockerfile',
      blocks: [
        {
          label: 'Dockerfile',
          tone: 'good',
          code: `# Версия зафиксирована; в продакшене — ещё и @sha256
FROM python:3.13-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --require-hashes \\
        -r requirements.txt

COPY src/ ./src/
RUN useradd --system --uid 10001 app
USER 10001

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]`,
        },
      ],
      notes: [
        '--require-hashes: устанавливаются только пакеты с хешами из lock-файла.',
        'Сначала зависимости, потом код — кеш слоёв не пересобирает их без нужды.',
        'Процесс работает от UID 10001, а не от root.',
        '.dockerignore исключает .git, .env, тесты и секреты.',
      ],
    },
    {
      kind: 'code',
      title: 'Практика: безопасный Docker Compose',
      lang: 'yaml',
      blocks: [
        {
          label: 'compose.yaml — API',
          tone: 'good',
          code: `services:
  api:
    build: .
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt:
      - no-new-privileges:true
    secrets: [db_password]
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
    networks: [frontend, backend]
    mem_limit: 512m`,
        },
        {
          label: 'compose.yaml — БД, сети, секреты',
          tone: 'good',
          code: `  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets: [db_password]
    networks: [backend]  # порт не публикуется

networks:
  frontend: {}
  backend:
    internal: true  # без выхода в интернет

secrets:
  db_password:
    file: ./secrets/db_password.txt  # не в git`,
        },
      ],
    },
    {
      kind: 'summary',
      points: [
        'Контейнеры делят ядро хоста: изоляцию усиливают отказом от root и capabilities.',
        'Минимальный образ и многоэтапная сборка уменьшают поверхность атаки.',
        'Секреты передаются при запуске и никогда не попадают в слои образа.',
        'Сети разделяются, сервисы аутентифицируют друг друга, образы сканируются в CI.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист контейнера',
      items: [
        'Фиксированная версия минимального базового образа',
        'Процесс работает не от root',
        'cap_drop: ALL и no-new-privileges',
        'Нет --privileged и монтирования docker.sock',
        'Секреты — через secrets, не через ENV в образе',
        'Образ просканирован, критичных CVE нет',
        'БД во внутренней сети без опубликованных портов',
        'Заданы лимиты ресурсов и healthcheck',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'Docker Docs: Docker Engine security, Rootless mode, Build best practices', org: 'Docker Inc.' },
        { title: 'Docker Docs: Secrets in Compose, Build secrets', org: 'Docker Inc.' },
        { title: 'SP 800-190. Application Container Security Guide, 2017', org: 'NIST' },
        { title: 'SP 800-204. Security Strategies for Microservices-based Application Systems, 2019', org: 'NIST' },
        { title: 'Docker Security Cheat Sheet', org: 'OWASP Cheat Sheet Series' },
        { title: 'CIS Docker Benchmark', org: 'Center for Internet Security' },
      ],
    },
  ],
} satisfies Presentation
