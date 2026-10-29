import { ArrowDown, ArrowRight, Cloud, FileText, HardDrive, KeyRound, Laptop, Lock, LockOpen, Plus, Router, User, UserRound, Wifi } from 'lucide-react'
import { Fragment, useMemo, useState, type ReactNode } from 'react'
import type { Diagram, Item } from '../../data/types'
import { sha256 } from '../../lib/sha256'
import { useSlide } from './primitives'

/* Общие элементы схем */
function Box({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-panel p-4 @5xl:p-5 ${className}`}>{children}</div>
}
function Arr({ label }: { label?: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center gap-1 text-accent">
      {label && <span className="text-center text-[12px] leading-tight font-medium @5xl:text-[14px]">{label}</span>}
      <ArrowDown className="size-5 @5xl:hidden" />
      <ArrowRight className="hidden size-6 @5xl:block" />
    </div>
  )
}
const small = 'text-[13px] leading-snug text-muted @5xl:text-[16px]'
const strong = 'text-[15px] font-semibold leading-tight @5xl:text-[19px]'

/* ───────────── Триада CIA ───────────── */
export const ciaParts = [
  { key: 'c', title: 'Конфиденциальность', text: 'Доступ к информации есть только у тех, кому он разрешён.', means: 'Шифрование, управление доступом' },
  { key: 'i', title: 'Целостность', text: 'Информация полна, точна и не изменена без разрешения.', means: 'Хеши, подписи, журналы изменений' },
  { key: 'a', title: 'Доступность', text: 'Информация доступна авторизованным пользователям, когда нужна.', means: 'Резервирование, копии, защита от DDoS' },
] as const

function Cia() {
  const label = (i: number, align: string) => {
    const p = ciaParts[i]
    return (
      <div className={`rounded-xl border border-line bg-panel p-4 @5xl:border-0 @5xl:bg-transparent @5xl:p-0 ${align}`}>
        <h3 className="font-display text-[16px] font-medium text-accent @5xl:text-[22px]">{p.title}</h3>
        <p className={`mt-1 ${small} @5xl:text-fg/85`}>{p.text}</p>
        <p className="mt-1 text-[12.5px] text-muted @5xl:text-[14.5px]">{p.means}</p>
      </div>
    )
  }
  return (
    <div className="grid gap-3 @5xl:grid-cols-[1fr_400px_1fr] @5xl:grid-rows-[auto_auto] @5xl:gap-x-8 @5xl:gap-y-3">
      <div className="@5xl:col-start-2 @5xl:row-start-1">{label(0, '@5xl:text-center')}</div>
      <div className="@5xl:col-start-1 @5xl:row-start-2 @5xl:self-end">{label(1, '@5xl:text-right')}</div>
      <svg viewBox="0 0 400 230" className="hidden w-full @5xl:col-start-2 @5xl:row-start-2 @5xl:block" aria-hidden>
        <polygon points="200,8 10,222 390,222" fill="none" stroke="var(--line)" strokeWidth="2" />
        <polygon points="200,70 80,200 320,200" fill="color-mix(in srgb, var(--accent) 12%, transparent)" stroke="var(--accent)" strokeWidth="2" />
        <text x="200" y="166" textAnchor="middle" fill="var(--fg)" style={{ font: '500 19px var(--font-display)' }}>
          Информация
        </text>
      </svg>
      <div className="@5xl:col-start-3 @5xl:row-start-2 @5xl:self-end">{label(2, '')}</div>
    </div>
  )
}

/* ───────────── Эшелонированная защита ───────────── */
function Layers({ layers }: { layers: Item[] }) {
  const n = layers.length
  return (
    <div className="flex flex-col items-center gap-1.5 @5xl:gap-2">
      {layers.map((l, i) => {
        const width = 100 - (i * 44) / Math.max(n - 1, 1)
        const mix = 8 + (i * 30) / Math.max(n - 1, 1)
        return (
          <div
            key={l.title}
            className="flex w-full items-center justify-between gap-4 rounded-lg border border-accent/30 px-4 py-2 @5xl:px-6 @5xl:py-[11px] @5xl:[width:var(--w)]"
            style={{ '--w': `${width}%`, background: `color-mix(in srgb, var(--accent) ${mix}%, var(--panel))` } as React.CSSProperties}
          >
            <span className="text-[14.5px] font-semibold @5xl:text-[19px]">{l.title}</span>
            {l.text && <span className="text-right text-[12.5px] text-fg/75 @5xl:text-[16px]">{l.text}</span>}
          </div>
        )
      })}
      <p className="mt-2 text-[12.5px] text-muted @5xl:text-[15px]">Снаружи — внутрь: от людей и процессов к самим данным</p>
    </div>
  )
}

/* ───────────── Правило 3-2-1 ───────────── */
function Backup321() {
  const cols = [
    { n: '3', title: 'копии данных', text: 'Оригинал и ещё две резервные копии', icons: [FileText, FileText, FileText] },
    { n: '2', title: 'разных типа носителей', text: 'Например, диск ноутбука и внешний диск', icons: [Laptop, HardDrive] },
    { n: '1', title: 'копия в другом месте', text: 'Облако или носитель вне дома', icons: [Cloud] },
  ]
  return (
    <div className="grid gap-3 @3xl:grid-cols-3 @5xl:gap-6">
      {cols.map((c) => (
        <Box key={c.n} className="flex flex-col gap-3 @5xl:gap-5 @5xl:p-7">
          <div className="flex items-end gap-3">
            <span className="font-display text-[44px] leading-none font-medium text-accent @5xl:text-[96px]">{c.n}</span>
            <span className="pb-1 text-[16px] leading-tight font-semibold @5xl:pb-3 @5xl:text-[22px]">{c.title}</span>
          </div>
          <div className="flex gap-2 text-accent">
            {c.icons.map((I, k) => (
              <span key={k} className="grid size-9 place-items-center rounded-lg bg-accent/12 @5xl:size-12">
                <I className="size-5 @5xl:size-6" strokeWidth={1.75} />
              </span>
            ))}
          </div>
          <p className={small}>{c.text}</p>
        </Box>
      ))}
    </div>
  )
}

/* ───────────── Шифрование ───────────── */
function Data({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <Box className="flex min-w-0 flex-1 flex-col gap-1.5 @5xl:gap-2">
      <span className={small}>{label}</span>
      <span className={`${mono ? 'font-mono tracking-tight break-all' : ''} text-[15px] font-semibold @5xl:text-[20px]`}>{value}</span>
    </Box>
  )
}
function KeyChip({ label, tone }: { label: string; tone: 'accent' | 'good' | 'danger' }) {
  const c = { accent: 'text-accent bg-accent/12', good: 'text-good bg-good/12', danger: 'text-danger bg-danger/12' }[tone]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold @5xl:text-[14px] ${c}`}>
      <KeyRound className="size-3.5 @5xl:size-4" /> {label}
    </span>
  )
}
function Op({ icon, title, chip }: { icon: 'lock' | 'unlock'; title: string; chip: ReactNode }) {
  const I = icon === 'lock' ? Lock : LockOpen
  return (
    <div className="flex shrink-0 flex-col items-center gap-2 py-1 text-center @5xl:w-[170px]">
      <span className="grid size-10 place-items-center rounded-full border border-accent/50 text-accent @5xl:size-14">
        <I className="size-5 @5xl:size-6" />
      </span>
      <span className="text-[13px] font-semibold @5xl:text-[16px]">{title}</span>
      {chip}
    </div>
  )
}

function Symmetric() {
  return (
    <div className="flex flex-col gap-4 @5xl:gap-8">
      <div className="flex flex-col items-stretch gap-2 @5xl:flex-row @5xl:items-center @5xl:gap-3">
        <Data label="Открытый текст" value="Встреча в 15:00" />
        <Arr />
        <Op icon="lock" title="Зашифровать" chip={<KeyChip label="Ключ K" tone="accent" />} />
        <Arr />
        <Data label="Шифртекст" value="8f3a…b7d2" mono />
        <Arr />
        <Op icon="unlock" title="Расшифровать" chip={<KeyChip label="Тот же ключ K" tone="accent" />} />
        <Arr />
        <Data label="Открытый текст" value="Встреча в 15:00" />
      </div>
      <p className="text-[14px] @5xl:text-[18px]">
        <span className="font-semibold text-warn">Проблема: </span>
        <span className="text-fg/85">как передать ключ K собеседнику, если канал связи ещё не защищён?</span>
      </p>
    </div>
  )
}

function Asymmetric() {
  return (
    <div className="flex flex-col gap-4 @5xl:gap-7">
      <div className="flex flex-col items-stretch gap-2 @5xl:flex-row @5xl:items-center @5xl:gap-3">
        <Box className="flex flex-1 items-center gap-3">
          <User className="size-6 shrink-0 text-accent @5xl:size-8" />
          <div>
            <p className={strong}>Алия</p>
            <p className={small}>знает открытый ключ Бориса</p>
          </div>
        </Box>
        <Arr />
        <Op icon="lock" title="Шифрует" chip={<KeyChip label="Открытый ключ Бориса" tone="good" />} />
        <Arr />
        <Data label="Шифртекст" value="c41f…07e2" mono />
        <Arr />
        <Op icon="unlock" title="Расшифровывает" chip={<KeyChip label="Закрытый ключ Бориса" tone="danger" />} />
        <Arr />
        <Box className="flex flex-1 items-center gap-3">
          <UserRound className="size-6 shrink-0 text-accent @5xl:size-8" />
          <div>
            <p className={strong}>Борис</p>
            <p className={small}>единственный может прочитать</p>
          </div>
        </Box>
      </div>
      <div className="grid gap-3 @3xl:grid-cols-2 @5xl:gap-6">
        <p className="text-[14px] @5xl:text-[18px]">
          <span className="font-semibold text-good">Открытый ключ </span>
          <span className="text-fg/85">можно публиковать: им только зашифровывают.</span>
        </p>
        <p className="text-[14px] @5xl:text-[18px]">
          <span className="font-semibold text-danger">Закрытый ключ </span>
          <span className="text-fg/85">никогда не покидает владельца: им расшифровывают.</span>
        </p>
      </div>
    </div>
  )
}

/* ───────────── Факторы аутентификации ───────────── */
function Factors() {
  const f = [
    { title: 'Знание', q: 'Что вы знаете', ex: ['Пароль', 'ПИН-код', 'Парольная фраза'] },
    { title: 'Владение', q: 'Что у вас есть', ex: ['Смартфон', 'Аппаратный ключ', 'Смарт-карта'] },
    { title: 'Свойство', q: 'Кто вы', ex: ['Отпечаток пальца', 'Лицо', 'Голос'] },
  ]
  return (
    <div className="flex flex-col gap-2 @5xl:flex-row @5xl:items-stretch @5xl:gap-4">
      {f.map((x, i) => (
        <Fragment key={x.title}>
          {i > 0 && (
            <div className="flex items-center justify-center text-muted">
              <Plus className="size-5 @5xl:size-7" />
            </div>
          )}
          <Box className="flex-1 @5xl:p-7">
            <p className={small}>{x.q}</p>
            <h3 className="mt-1 font-display text-[20px] font-medium text-accent @5xl:mt-2 @5xl:text-[30px]">{x.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-2 @5xl:mt-5">
              {x.ex.map((e) => (
                <li key={e} className="rounded-full bg-raised px-3 py-1 text-[13px] @5xl:text-[16px]">
                  {e}
                </li>
              ))}
            </ul>
          </Box>
        </Fragment>
      ))}
    </div>
  )
}

/* ───────────── Человек посередине ───────────── */
function Mitm() {
  const node = (icon: ReactNode, title: string, text: string, danger = false) => (
    <Box className={`flex flex-1 items-center gap-3 @5xl:flex-col @5xl:items-start @5xl:gap-3 ${danger ? 'border-danger/60 bg-danger/8' : ''}`}>
      <span className={danger ? 'text-danger' : 'text-accent'}>{icon}</span>
      <div>
        <p className={strong}>{title}</p>
        <p className={small}>{text}</p>
      </div>
    </Box>
  )
  const ic = 'size-6 @5xl:size-8'
  return (
    <div className="flex flex-col gap-4 @5xl:gap-6">
      <div className="hidden items-center gap-3 text-[15px] text-muted @5xl:flex">
        <span className="h-px flex-1 border-t-2 border-dashed border-line" />
        <span>Ожидание: прямое подключение к сети кафе</span>
        <span className="h-px flex-1 border-t-2 border-dashed border-line" />
      </div>
      <div className="flex flex-col items-stretch gap-2 @5xl:flex-row @5xl:items-stretch @5xl:gap-3">
        {node(<Laptop className={ic} />, 'Ваше устройство', 'Подключилось к «Cafe_Free_WiFi»')}
        <Arr label="весь трафик" />
        {node(<Router className={ic} />, 'Точка злоумышленника', 'Видит незашифрованные данные, может подменять страницы и DNS', true)}
        <Arr label="пересылает дальше" />
        {node(<Wifi className={ic} />, 'Интернет', 'Сайты отвечают как обычно — подмену не видно')}
      </div>
      <p className="text-[14px] @5xl:text-[18px]">
        <span className="font-semibold text-good">Защита: </span>
        <span className="text-fg/85">HTTPS шифрует содержимое, VPN — весь трафик до доверенного сервера.</span>
      </p>
    </div>
  )
}

/* ───────────── Живая хеш-функция ───────────── */
const ORIGINAL = 'Оценка: 5'

function HashDemo() {
  const { thumb } = useSlide()
  const [text, setText] = useState('Оценка: 4')
  const base = useMemo(() => sha256(ORIGINAL), [])
  const current = useMemo(() => sha256(text), [text])
  const diff = current.split('').filter((c, i) => c !== base[i]).length
  const hex = (h: string, compare?: string) =>
    h.match(/.{1,8}/g)!.map((chunk, ci) => (
      <span key={ci} className="mr-[0.5ch]">
        {chunk.split('').map((c, i) => {
          const changed = compare !== undefined && c !== compare[ci * 8 + i]
          return (
            <span key={i} className={changed ? 'text-warn' : ''}>
              {c}
            </span>
          )
        })}
      </span>
    ))
  return (
    <div className="flex flex-col gap-3 @5xl:gap-5">
      <Box className="flex flex-col gap-2">
        <span className={small}>Исходные данные</span>
        <span className="font-mono text-[15px] font-medium @5xl:text-[20px]">{ORIGINAL}</span>
        <span className="font-mono text-[12px] leading-relaxed break-all text-muted @5xl:text-[17px]">{hex(base)}</span>
      </Box>
      <Box className="flex flex-col gap-2 border-accent/50">
        <label htmlFor="hash-input" className={small}>
          Изменённые данные — попробуйте отредактировать
        </label>
        <input
          id="hash-input"
          value={text}
          disabled={thumb}
          tabIndex={thumb ? -1 : 0}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()}
          spellCheck={false}
          autoComplete="off"
          className="w-full rounded-lg border border-line bg-bg px-3 py-1.5 font-mono text-[15px] font-medium text-fg outline-none focus:border-accent @5xl:text-[20px]"
        />
        <span className="font-mono text-[12px] leading-relaxed break-all @5xl:text-[17px]">{hex(current, base)}</span>
      </Box>
      <p className="text-[14px] @5xl:text-[18px]">
        <span className="tabular font-semibold text-warn">Изменилось {diff} из 64 символов хеша. </span>
        <span className="text-fg/85">Любая подмена данных сразу видна по отпечатку.</span>
      </p>
    </div>
  )
}

/* ───────────── Матрица рисков ───────────── */
function Risk() {
  const impact = ['Высокий', 'Средний', 'Низкий']
  const prob = ['Низкая', 'Средняя', 'Высокая']
  // уровень = индекс вероятности + (2 − индекс ущерба)
  const level = (r: number, c: number) => c + (2 - r)
  const style = (l: number) =>
    l >= 3 ? 'bg-danger/22 text-fg' : l === 2 ? 'bg-warn/20 text-fg' : 'bg-good/16 text-fg'
  const label = (l: number) => (l >= 3 ? 'Высокий' : l === 2 ? 'Средний' : 'Низкий')
  const examples: Record<string, string> = {
    '0-1': 'Отказ единственного диска с дипломом',
    '0-2': 'Повторный пароль от почты',
    '2-2': 'Спам в почтовом ящике',
    '2-0': 'Кража зашифрованного ноутбука',
  }
  return (
    <div className="flex gap-3 @5xl:gap-5">
      <div className="flex w-5 items-center justify-center @5xl:w-7">
        <span className="-rotate-90 text-[12.5px] font-semibold whitespace-nowrap text-muted @5xl:text-[16px]">Ущерб</span>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-[64px_repeat(3,1fr)] gap-1.5 @5xl:grid-cols-[110px_repeat(3,1fr)] @5xl:gap-2">
          {impact.map((imp, r) => (
            <Fragment key={imp}>
              <div className="flex items-center text-[12px] text-muted @5xl:text-[16px]">{imp}</div>
              {prob.map((_, c) => {
                const l = level(r, c)
                const ex = examples[`${r}-${c}`]
                return (
                  <div key={c} className={`flex min-h-[64px] flex-col justify-between rounded-lg p-2 @5xl:min-h-[104px] @5xl:p-3.5 ${style(l)}`}>
                    <span className="text-[11.5px] font-semibold @5xl:text-[15px]">{label(l)}</span>
                    {ex && <span className="text-[11px] leading-tight text-fg/80 @5xl:text-[14.5px]">{ex}</span>}
                  </div>
                )
              })}
            </Fragment>
          ))}
          <div />
          {prob.map((p) => (
            <div key={p} className="pt-1 text-center text-[12px] text-muted @5xl:text-[16px]">
              {p}
            </div>
          ))}
        </div>
        <p className="mt-1 text-center text-[12.5px] font-semibold text-muted @5xl:text-[16px]">Вероятность</p>
      </div>
    </div>
  )
}

/* ───────────── Структура JWT ───────────── */
const JWT_PARTS = [
  {
    title: 'Заголовок',
    raw: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9',
    decoded: '{ "alg": "RS256", "typ": "JWT" }',
    note: 'Алгоритм подписи. Сервер не должен ему слепо доверять',
    color: 'text-warn',
  },
  {
    title: 'Полезная нагрузка',
    raw: 'eyJzdWIiOiJ1c2VyLTQyIiwicm9sZSI6InN0dWRlbnQiLCJleHAiOjE3NjcyMjU2MDB9',
    decoded: '{ "sub": "user-42", "role": "student", "exp": 1767225600 }',
    note: 'Утверждения (claims). Читаются без ключа — это Base64URL, а не шифр',
    color: 'text-accent',
  },
  {
    title: 'Подпись',
    raw: 'kW3n…9xQ',
    decoded: 'RS256( заголовок + "." + нагрузка, закрытый ключ )',
    note: 'Защищает от подмены. Проверяется открытым ключом издателя',
    color: 'text-good',
  },
]

function Jwt() {
  return (
    <div className="flex flex-col gap-4 @5xl:gap-6">
      <Box className="font-mono text-[12.5px] leading-relaxed break-all @5xl:text-[18px]">
        {JWT_PARTS.map((p, i) => (
          <Fragment key={p.title}>
            {i > 0 && <span className="text-muted">.</span>}
            <span className={p.color}>{p.raw}</span>
          </Fragment>
        ))}
      </Box>
      <div className="grid gap-3 @3xl:grid-cols-3 @5xl:gap-5">
        {JWT_PARTS.map((p) => (
          <Box key={p.title} className="flex flex-col gap-2 @5xl:gap-3">
            <span className={`text-[14px] font-semibold @5xl:text-[19px] ${p.color}`}>{p.title}</span>
            <span className="font-mono text-[12.5px] leading-snug break-words @5xl:text-[15.5px]">{p.decoded}</span>
            <span className={small}>{p.note}</span>
          </Box>
        ))}
      </div>
    </div>
  )
}

/* ───────────── Потоки данных и границы доверия ───────────── */
function Zone({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col gap-2.5 rounded-2xl border-2 border-dashed border-warn/55 p-3 @5xl:gap-3 @5xl:p-4 ${className}`}>
      <span className="text-[12px] font-semibold text-warn @5xl:text-[15px]">{title}</span>
      {children}
    </div>
  )
}
function Node({ title, text }: { title: string; text: string }) {
  return (
    <Box className="flex flex-col gap-1 @5xl:p-4">
      <span className={strong}>{title}</span>
      <span className={small}>{text}</span>
    </Box>
  )
}

function Dfd() {
  return (
    <div className="flex flex-col gap-2 @5xl:flex-row @5xl:items-stretch @5xl:gap-3">
      <Zone title="Интернет · недоверенная зона" className="@5xl:w-[230px] @5xl:justify-center">
        <Node title="Браузер (SPA)" text="Любые данные отсюда считаются враждебными" />
      </Zone>
      <Arr label="1 · HTTPS + токен" />
      <Zone title="DMZ" className="@5xl:w-[230px] @5xl:justify-center">
        <Node title="Обратный прокси" text="TLS, лимиты запросов, размер тела" />
      </Zone>
      <Arr label="2 · запрос" />
      <Zone title="Внутренняя зона" className="flex-1">
        <Node title="API-сервер (FastAPI)" text="Аутентификация, проверка прав, валидация" />
        <div className="grid gap-2 @3xl:grid-cols-2 @5xl:gap-3">
          <Node title="3 · База данных" text="Только параметризованные запросы" />
          <Node title="4 · Хранилище файлов" text="Вне публичной директории" />
        </div>
      </Zone>
    </div>
  )
}

export function DiagramView({ d }: { d: Diagram }) {
  switch (d.type) {
    case 'cia':
      return <Cia />
    case 'layers':
      return <Layers layers={d.layers} />
    case 'backup321':
      return <Backup321 />
    case 'symmetric':
      return <Symmetric />
    case 'asymmetric':
      return <Asymmetric />
    case 'factors':
      return <Factors />
    case 'mitm':
      return <Mitm />
    case 'hash':
      return <HashDemo />
    case 'risk':
      return <Risk />
    case 'jwt':
      return <Jwt />
    case 'dfd':
      return <Dfd />
  }
}
