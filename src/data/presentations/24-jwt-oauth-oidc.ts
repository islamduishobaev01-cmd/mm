import type { Presentation } from '../types'

export default {
  slug: 'jwt-oauth-oidc',
  title: 'Аутентификация и авторизация: JWT, OAuth 2.0 и OpenID Connect',
  description: 'Сессии и токены, структура и проверка JWT, access и refresh token, OAuth 2.0, OpenID Connect и Authorization Code Flow с PKCE.',
  section: 'dev',
  icon: 'userCheck',
  tone: 'cyan',
  subtitle: 'Кто вы, что вам можно и как это безопасно передать между сервисами',
  slides: [
    {
      kind: 'points',
      title: 'Цель и план темы',
      lead: 'Цель: понимать устройство современных схем входа и избегать типичных ошибок при работе с токенами.',
      items: [
        { title: 'Вход и права', text: 'Аутентификация и авторизация', icon: 'userCheck' },
        { title: 'JWT', text: 'Структура, подпись, проверка', icon: 'braces' },
        { title: 'Два вида токенов', text: 'Access и refresh token', icon: 'key' },
        { title: 'OAuth 2.0 и OIDC', text: 'Делегирование и идентификация', icon: 'network' },
        { title: 'PKCE', text: 'Authorization Code Flow', icon: 'route' },
        { title: 'Ошибки и схема', text: 'Как сделать правильно', icon: 'shield' },
      ],
    },
    {
      kind: 'table',
      title: 'Аутентификация, авторизация, сессии и токены',
      head: ['Понятие', 'Вопрос', 'Как работает'],
      rows: [
        ['Аутентификация', 'Кто вы?', 'Пароль, MFA, ключ доступа. Ошибка — HTTP 401'],
        ['Авторизация', 'Что вам можно?', 'Проверка роли и владельца объекта. Ошибка — HTTP 403'],
        ['Сессия', 'Где хранится состояние?', 'На сервере; в браузере — только случайный идентификатор в cookie'],
        ['Токен', 'Как передать утверждения?', 'Подписанный документ с данными о пользователе; сервер проверяет подпись'],
      ],
      note: 'Сессии проще отозвать, токены удобнее для нескольких сервисов. Оба подхода безопасны при правильной реализации.',
    },
    {
      kind: 'diagram',
      title: 'Структура JWT',
      lead: 'JSON Web Token (RFC 7519) — три части в Base64URL, разделённые точками.',
      diagram: { type: 'jwt' },
      caption: 'Утверждения exp, iss, aud, sub — срок действия, издатель, получатель и субъект. Сервер обязан проверить их вместе с подписью.',
    },
    {
      kind: 'statement',
      label: 'Важно',
      text: 'Подписанный JWT не зашифрован. Его содержимое прочитает любой, у кого есть токен.',
      sub: 'Подпись (JWS, RFC 7515) защищает от изменения, но не от чтения: Base64URL — это кодирование, а не шифр. Не кладите в JWT пароли, персональные и секретные данные. Если содержимое нужно скрыть, используют JWE (RFC 7516).',
    },
    {
      kind: 'code',
      title: 'Проверка JWT на сервере',
      lead: 'Библиотека PyJWT. Алгоритм, издатель и получатель задаются сервером, а не берутся из токена.',
      lang: 'python',
      blocks: [
        {
          label: 'Проверка access token',
          tone: 'good',
          code: `import jwt  # pip install "pyjwt[crypto]"

claims = jwt.decode(
    token,
    key=public_key,         # открытый ключ издателя
    algorithms=["RS256"],   # белый список алгоритмов
    audience="notes-api",   # токен выпущен для нас?
    issuer="https://id.example.edu",
    options={"require": ["exp", "iat", "sub"]},
)
user_id = claims["sub"]`,
        },
      ],
      notes: [
        'Истёкший токен, чужой aud или iss вызывают исключение — отвечаем 401.',
        'Никогда: verify_signature=False, алгоритм none или алгоритм из заголовка токена.',
        'Для HS256 секрет должен быть длинным и случайным, иначе его подберут.',
      ],
    },
    {
      kind: 'compare',
      title: 'Access token и refresh token',
      left: {
        title: 'Access token',
        tone: 'neutral',
        items: [
          'Короткий срок жизни: минуты',
          'Передаётся в заголовке Authorization: Bearer',
          'Проверяется сервером ресурсов',
          'Самодостаточный JWT нельзя отозвать до истечения — поэтому он короткий',
        ],
      },
      right: {
        title: 'Refresh token',
        tone: 'neutral',
        items: [
          'Долгий срок жизни, позволяет получить новый access token',
          'Отправляется только серверу авторизации',
          'Ротация: при каждом использовании выдаётся новый, старый аннулируется',
          'Отзывается при выходе и подозрении на кражу',
        ],
      },
    },
    {
      kind: 'terms',
      title: 'OAuth 2.0 и OpenID Connect',
      terms: [
        { term: 'OAuth 2.0', def: 'Протокол делегирования доступа (RFC 6749): приложение получает ограниченный доступ к API от имени пользователя.' },
        { term: 'OpenID Connect', def: 'Слой идентификации поверх OAuth 2.0: сообщает приложению, кто вошёл, с помощью ID token.' },
        { term: 'Сервер авторизации', def: 'Аутентифицирует пользователя и выдаёт токены (провайдер идентификации, IdP).' },
        { term: 'Клиент и сервер ресурсов', def: 'Клиент — приложение, запрашивающее доступ; сервер ресурсов — API, принимающий access token.' },
        { term: 'Scope', def: 'Область доступа, например notes:read. Даёт ровно те права, о которых попросили.' },
        { term: 'ID token', def: 'JWT для клиента с данными о входе: iss, sub, aud = client_id, nonce. Не используется для вызова API.' },
      ],
    },
    {
      kind: 'steps',
      title: 'Authorization Code Flow с PKCE',
      lead: 'Рекомендуемый поток для веб-, мобильных и одностраничных приложений (RFC 9700).',
      steps: [
        { title: 'Подготовка', text: 'Клиент создаёт случайный code_verifier и code_challenge = SHA-256 от него.' },
        { title: 'Перенаправление', text: 'На /authorize с code_challenge, state, nonce и scope=openid.' },
        { title: 'Вход', text: 'Пользователь входит у IdP; клиент получает code и сверяет state.' },
        { title: 'Обмен', text: 'Клиент отправляет code и code_verifier на /token и получает токены.' },
        { title: 'Проверка', text: 'Клиент проверяет ID token, а access token передаёт в API.' },
      ],
    },
    {
      kind: 'table',
      title: 'Хранение и отзыв токенов в браузере',
      head: ['Где хранить', 'Риск', 'Оценка'],
      rows: [
        ['localStorage', 'Любой внедрённый скрипт (XSS) прочитает токен', 'Не рекомендуется'],
        ['Память JavaScript', 'Теряется при перезагрузке, XSS всё ещё может использовать', 'Допустимо для коротких токенов'],
        ['Cookie HttpOnly; Secure; SameSite', 'Недоступна скриптам, нужна защита от CSRF', 'Хорошо'],
        ['BFF: токены только на сервере', 'Браузер хранит лишь cookie сессии', 'Предпочтительно для SPA'],
      ],
      note: 'Отзыв: короткий срок жизни access token, отзыв refresh token через эндпоинт RFC 7009, при необходимости — список отозванных идентификаторов jti.',
    },
    {
      kind: 'cards',
      title: 'Распространённые ошибки реализации',
      variant: 'threat',
      items: [
        { title: 'Нет проверки подписи', icon: 'ban', text: 'Сервер принимает alg: none или алгоритм из заголовка токена.' },
        { title: 'Не проверены aud и iss', icon: 'target', text: 'Токен, выпущенный для другого сервиса, принимается вашим API.' },
        { title: 'Слабый секрет HS256', icon: 'key', text: 'Короткий секрет подбирается офлайн по одному перехваченному токену.' },
        { title: 'Implicit flow', icon: 'route', text: 'Токен в URL-фрагменте. RFC 9700 рекомендует отказаться от этого потока.' },
        { title: 'Токены в URL и журналах', icon: 'scroll', text: 'Попадают в историю браузера, Referer и логи прокси.' },
        { title: 'Открытый redirect_uri', icon: 'link', text: 'Шаблон вместо точного совпадения позволяет украсть code.' },
      ],
    },
    {
      kind: 'flow',
      title: 'Схема безопасной авторизации веб-приложения',
      nodes: [
        { title: 'Браузер', text: 'Cookie сессии: HttpOnly, Secure, SameSite', icon: 'devices' },
        { title: 'Бэкенд (BFF)', text: 'Конфиденциальный клиент, хранит токены', icon: 'server' },
        { title: 'Сервер авторизации', text: 'Код + PKCE, MFA, выдача токенов', icon: 'userCheck' },
        { title: 'API', text: 'Проверяет подпись, aud, iss, exp и scope', icon: 'shield' },
      ],
      caption: 'Токены не попадают в JavaScript браузера. API дополнительно проверяет права на каждый объект — токен говорит, кто пользователь, но не владеет ли он конкретной записью.',
    },
    {
      kind: 'summary',
      points: [
        'Аутентификация отвечает «кто вы», авторизация — «что вам можно».',
        'JWT подписан, но не зашифрован: в нём нет места секретам.',
        'Сервер сам задаёт алгоритм и проверяет подпись, exp, iss и aud.',
        'Для входа через IdP — Authorization Code Flow с PKCE и OpenID Connect.',
      ],
    },
    {
      kind: 'checklist',
      title: 'Чек-лист безопасной авторизации',
      items: [
        'Алгоритм подписи зафиксирован на сервере',
        'Проверяются exp, iss, aud и обязательные утверждения',
        'Access token живёт минуты, refresh token ротируется',
        'Токены не хранятся в localStorage и не попадают в URL',
        'Используется Authorization Code Flow с PKCE и state',
        'redirect_uri сравнивается точно',
        'В JWT нет персональных и секретных данных',
        'Права на объекты проверяются при каждом запросе',
      ],
    },
    {
      kind: 'sources',
      items: [
        { title: 'RFC 7519 (JWT), RFC 7515 (JWS), RFC 7516 (JWE), 2015', org: 'IETF / RFC Editor' },
        { title: 'RFC 8725. JSON Web Token Best Current Practices, 2020', org: 'IETF / RFC Editor' },
        { title: 'RFC 6749 (OAuth 2.0), RFC 7636 (PKCE), RFC 7009 (отзыв токенов)', org: 'IETF / RFC Editor' },
        { title: 'RFC 9700. Best Current Practice for OAuth 2.0 Security, 2025', org: 'IETF / RFC Editor' },
        { title: 'OpenID Connect Core 1.0', org: 'OpenID Foundation' },
        { title: 'PyJWT: документация (pyjwt.readthedocs.io)', org: 'PyJWT' },
      ],
    },
  ],
} satisfies Presentation
