import { ArrowDown, Play, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataGlyph } from '../components/DataGlyph'
import { CiaHero } from '../components/home/CiaHero'
import { Icon } from '../components/slides/primitives'
import { presentations, sections, tones, totalSlides } from '../data'
import type { NumberedPresentation, Section } from '../data/types'
import { normalize, pad2, plural } from '../lib/format'

const gutter = 'pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] sm:px-8 lg:px-12'
const wrap = 'mx-auto w-full max-w-[1360px]'

export default function Home() {
  return (
    <div className="min-h-dvh bg-navy">
      <SiteHeader />
      <main>
        <Hero />
        <Catalog />
      </main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className={`sticky top-[env(safe-area-inset-top)] z-30 border-b border-line/70 bg-navy/90 backdrop-blur-md ${gutter}`}>
      <div className={`${wrap} flex h-16 items-center justify-between gap-4`}>
        <Link to="/" className="flex items-center gap-3" aria-label="На главную">
          <span className="grid size-9 place-items-center rounded-lg bg-graphite ring-1 ring-line">
            <DataGlyph seed="ib" className="size-6" />
          </span>
          <span className="text-[15px] leading-tight font-semibold">
            <span className="sm:hidden">ИБ: презентации</span>
            <span className="hidden sm:inline">Информационная безопасность</span>
            <span className="hidden text-[12.5px] font-normal text-muted sm:block">Учебные презентации</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[14px]">
          <a href="#catalog" className="hidden rounded-lg px-3 py-2 text-muted hover:text-fg sm:inline-block">
            Каталог
          </a>
          <Link to={`/p/${presentations[0].slug}`} className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 font-medium hover:border-accent">
            <Play className="size-4 text-accent" />
            <span>Начать</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className={`blueprint border-b border-line/70 ${gutter}`}>
      <div className={`${wrap} pt-12 pb-14 sm:pt-16 lg:pt-20 lg:pb-20`}>
        <h1 className="font-display leading-[0.98] font-medium tracking-[-0.035em]" style={{ fontSize: 'clamp(25px, 7.4vw, 112px)' }}>
          Информационная
          <br />
          <span className="pl-[0.9em]">безопасность</span>
        </h1>
        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-20">
          <div className="flex flex-col gap-8">
            <p className="max-w-[34ch] text-[19px] leading-snug text-fg/90 sm:text-[23px]">
              {presentations.length} {plural(presentations.length, ['презентация', 'презентации', 'презентаций'])} о защите информации, цифровых
              угрозах, безопасной разработке и работе в современном мире.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-[15px] font-semibold text-navy-deep hover:bg-accent/85">
                <ArrowDown className="size-4" /> Выбрать тему
              </a>
              <Link to={`/p/${presentations[0].slug}`} className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-3 text-[15px] font-semibold hover:border-accent">
                Начать с первой темы
              </Link>
            </div>
            <dl className="tabular grid max-w-[520px] grid-cols-3 gap-4 border-t border-line pt-6 text-[14px] text-muted">
              <div>
                <dt>Тем</dt>
                <dd className="mt-1 text-[22px] font-semibold text-fg">{presentations.length}</dd>
              </div>
              <div>
                <dt>Слайдов</dt>
                <dd className="mt-1 text-[22px] font-semibold text-fg">{totalSlides}</dd>
              </div>
              <div>
                <dt>Разделов</dt>
                <dd className="mt-1 text-[22px] font-semibold text-fg">{Object.keys(sections).length}</dd>
              </div>
            </dl>
            <p className="max-w-[52ch] text-[15px] leading-relaxed text-muted">
              Презентации открываются в браузере и подходят для показа на большом экране: полноэкранный режим, управление стрелками
              клавиатуры и светлая схема слайдов для проектора.
            </p>
          </div>
          <div>
            <p className="mb-4 text-[14px] text-muted">Три цели защиты информации. Выберите свойство:</p>
            <CiaHero />
          </div>
        </div>
      </div>
    </section>
  )
}

type Filter = Section | 'all'

function Catalog() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const list = useMemo(() => {
    const q = normalize(query)
    return presentations.filter(
      (p) => (filter === 'all' || p.section === filter) && (!q || normalize(`${p.title} ${p.description}`).includes(q)),
    )
  }, [query, filter])

  const chips: { id: Filter; title: string; count: number }[] = [
    { id: 'all', title: 'Все темы', count: presentations.length },
    ...(Object.keys(sections) as Section[]).map((id) => ({
      id,
      title: sections[id].title,
      count: presentations.filter((p) => p.section === id).length,
    })),
  ]

  return (
    <section id="catalog" className={`scroll-mt-16 ${gutter}`}>
      <div className={`${wrap} py-14 sm:py-20`}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-[28px] leading-tight font-medium tracking-[-0.02em] sm:text-[40px]">Каталог презентаций</h2>
            <p className="mt-2 text-[16px] text-muted">Темы расположены в рекомендуемом порядке изучения.</p>
          </div>
          <div className="relative w-full lg:w-[400px]">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
            <label htmlFor="catalog-search" className="sr-only">
              Поиск по названию и описанию
            </label>
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск: пароль, фишинг, Wi-Fi…"
              autoComplete="off"
              className="h-12 w-full rounded-xl border border-line bg-graphite pr-11 pl-12 text-[15px] text-fg placeholder:text-muted/80 focus:border-accent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Очистить поиск"
                className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-fg"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="-mx-4 mt-6 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="radiogroup" aria-label="Раздел">
          <div className="flex gap-2">
            {chips.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium whitespace-nowrap transition-colors ${
                  filter === c.id ? 'border-accent bg-accent/12 text-fg' : 'border-line text-muted hover:border-white/30 hover:text-fg'
                }`}
              >
                {c.title}
                <span className="tabular text-[12.5px] opacity-70">{c.count}</span>
              </button>
            ))}
          </div>
        </div>

        {list.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <li key={p.slug} className="flex">
                <Card p={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
            <p className="text-[18px] font-semibold">По запросу «{query}» ничего не найдено</p>
            <p className="mt-2 text-[15px] text-muted">Попробуйте другое слово или посмотрите все темы раздела.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
              className="mt-6 rounded-xl border border-line px-5 py-2.5 text-[15px] font-semibold hover:border-accent"
            >
              Показать все темы
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function Card({ p }: { p: NumberedPresentation }) {
  const c = tones[p.tone].dark
  return (
    <article
      className="group relative flex w-full flex-col rounded-2xl border border-line bg-graphite p-5 transition-colors hover:border-[var(--c)] has-[a:focus-visible]:border-[var(--c)] sm:p-6"
      style={{ '--c': c } as React.CSSProperties}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="tabular font-display text-[15px] font-medium text-muted">{pad2(p.number)}</span>
        <span className="grid size-11 place-items-center rounded-xl" style={{ color: c, background: `color-mix(in srgb, ${c} 13%, transparent)` }}>
          <Icon name={p.icon} className="size-[22px]" />
        </span>
      </div>
      <h3 className="mt-4 text-[18px] leading-snug font-semibold text-balance">{p.title}</h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.description}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="tabular text-[13px] text-muted">
          {p.total} {plural(p.total, ['слайд', 'слайда', 'слайдов'])}
        </span>
        <Link
          to={`/p/${p.slug}`}
          className="rounded-lg px-1 text-[14px] font-semibold after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none"
          style={{ color: c }}
        >
          Открыть презентацию
        </Link>
      </div>
    </article>
  )
}

function SiteFooter() {
  return (
    <footer className={`border-t border-line/70 ${gutter}`}>
      <div className={`${wrap} grid gap-8 py-10 text-[14px] leading-relaxed text-muted md:grid-cols-2`}>
        <p className="max-w-[60ch]">
          Материалы подготовлены на основе международных стандартов ISO/IEC, публикаций NIST, рекомендаций CISA, NCSC и ENISA, материалов OWASP и RFC IETF, а также
          законодательства о персональных данных. Источники указаны на последних слайдах каждой презентации.
        </p>
        <div>
          <p className="font-semibold text-fg">Управление презентацией</p>
          <ul className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            <Kbd k="← →">предыдущий и следующий слайд</Kbd>
            <Kbd k="F">полноэкранный режим</Kbd>
            <Kbd k="G">все слайды</Kbd>
            <Kbd k="Esc">вернуться в каталог</Kbd>
          </ul>
          <p className="mt-2">На телефоне листайте слайды свайпом.</p>
        </div>
      </div>
    </footer>
  )
}

function Kbd({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <>
      <li className="contents">
        <kbd className="rounded-md border border-line bg-graphite px-2 py-0.5 text-center font-sans text-[12.5px] text-fg">{k}</kbd>
        <span>{children}</span>
      </li>
    </>
  )
}
