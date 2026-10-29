import { ArrowDown, ArrowRight, Check, CircleCheck, Lightbulb, X } from 'lucide-react'
import { Fragment } from 'react'
import type { CodeBlock, CompareSide, Item, Slide } from '../../data/types'
import { pad2 } from '../../lib/format'
import { Icon, IconTile, SlideBody, SlideHeader, SlideShell, gridCols, useSlide } from './primitives'

type Of<K extends Slide['kind']> = Extract<Slide, { kind: K }>

/* ───────────── Крупный тезис ───────────── */
export function StatementSlide({ s }: { s: Of<'statement'> }) {
  return (
    <SlideShell>
      <div className="my-auto flex max-w-[1020px] flex-col gap-5 py-6 @5xl:gap-8 @5xl:py-0">
        {s.label && <p className="text-[14px] font-medium text-accent @5xl:text-[20px]">{s.label}</p>}
        <p className="font-display text-[24px] leading-[1.22] font-normal tracking-[-0.015em] @5xl:text-[46px]">{s.text}</p>
        {s.sub && (
          <p className="max-w-[58ch] border-t border-line pt-5 text-[16px] leading-relaxed text-muted @5xl:pt-7 @5xl:text-[22px]">
            {s.sub}
          </p>
        )}
      </div>
    </SlideShell>
  )
}

/* ───────────── Тезисы с иконками ───────────── */
function ItemTitle({ item }: { item: Item }) {
  return item.mono ? (
    <span className="font-mono text-[14px] font-medium break-all @5xl:text-[19px]">{item.title}</span>
  ) : (
    <span className="text-[16px] font-semibold @5xl:text-[24px]">{item.title}</span>
  )
}

export function PointsSlide({ s }: { s: Of<'points'> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <ul className={`grid gap-x-12 gap-y-5 @5xl:gap-y-9 ${gridCols(s.items.length)}`}>
          {s.items.map((it) => (
            <li key={it.title} className="flex gap-4 @5xl:gap-5">
              {it.icon && <IconTile name={it.icon} />}
              <div className="min-w-0 pt-0.5">
                <ItemTitle item={it} />
                {it.text && <p className="mt-1 text-[14.5px] leading-snug text-muted @5xl:mt-1.5 @5xl:text-[20px]">{it.text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Карточки ───────────── */
export function CardsSlide({ s }: { s: Of<'cards'> }) {
  const threat = s.variant === 'threat'
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <ul className={`grid gap-3 @5xl:gap-5 ${gridCols(s.items.length)}`}>
          {s.items.map((it) => (
            <li key={it.title} className="flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 @5xl:gap-4 @5xl:p-6">
              <div className="flex items-center justify-between gap-3">
                {it.icon && <IconTile name={it.icon} tone={threat ? 'danger' : 'accent'} />}
                {it.tag && (
                  <span className="rounded-full border border-danger/40 px-2.5 py-0.5 text-[12px] font-medium text-danger @5xl:text-[14px]">
                    {it.tag}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-[16px] leading-tight font-semibold @5xl:text-[21px]">{it.title}</h3>
                {it.text && <p className="mt-1.5 text-[14px] leading-snug text-muted @5xl:text-[17px]">{it.text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Сравнение ───────────── */
function CompareColumn({ side }: { side: CompareSide }) {
  const mark =
    side.tone === 'good' ? (
      <Check className="mt-[3px] size-4 shrink-0 text-good @5xl:mt-1 @5xl:size-6" strokeWidth={2.5} />
    ) : side.tone === 'bad' ? (
      <X className="mt-[3px] size-4 shrink-0 text-danger @5xl:mt-1 @5xl:size-6" strokeWidth={2.5} />
    ) : (
      <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-accent @5xl:mt-3 @5xl:size-2" />
    )
  const head =
    side.tone === 'good' ? 'text-good border-good/50' : side.tone === 'bad' ? 'text-danger border-danger/50' : 'text-accent border-accent/50'
  return (
    <div className="flex flex-col rounded-xl border border-line bg-panel p-5 @5xl:p-8">
      <h3 className={`self-start rounded-full border px-3 py-0.5 text-[14px] font-semibold @5xl:text-[18px] ${head}`}>{side.title}</h3>
      <ul className="mt-4 flex flex-col gap-3 @5xl:mt-6 @5xl:gap-4">
        {side.items.map((t) => (
          <li key={t} className="flex gap-3 text-[15px] leading-snug @5xl:text-[20px]">
            {mark}
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CompareSlide({ s }: { s: Of<'compare'> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <div className="grid gap-4 @3xl:grid-cols-2 @5xl:gap-6">
          <CompareColumn side={s.left} />
          <CompareColumn side={s.right} />
        </div>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Последовательность шагов ───────────── */
export function StepsSlide({ s }: { s: Of<'steps'> }) {
  const n = s.steps.length
  const cols = ['', '', '@5xl:grid-cols-2', '@5xl:grid-cols-3', '@5xl:grid-cols-4', '@5xl:grid-cols-5'][n] ?? '@5xl:grid-cols-3'
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <ol className={`grid gap-x-6 gap-y-5 @3xl:grid-cols-2 @5xl:gap-y-10 ${cols}`}>
          {s.steps.map((st, i) => (
            <li key={st.title} className="flex gap-4 @5xl:flex-col @5xl:gap-0">
              <div className="flex shrink-0 items-center gap-3 @5xl:mb-5">
                <span className="tabular font-display text-[22px] leading-none font-medium text-accent @5xl:text-[44px]">{pad2(i + 1)}</span>
                <span className="hidden h-px flex-1 bg-line @5xl:block" />
              </div>
              <div>
                <h3 className="text-[16px] leading-tight font-semibold @5xl:text-[23px]">{st.title}</h3>
                {st.text && <p className="mt-1.5 text-[14px] leading-snug text-muted @5xl:text-[19px]">{st.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Схема процесса ───────────── */
function FlowNode({ node }: { node: Item }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-xl border border-line bg-panel p-4 @5xl:gap-3 @5xl:p-5">
      {node.icon && <Icon name={node.icon} className="size-5 text-accent @5xl:size-7" />}
      <h3 className="text-[15px] leading-tight font-semibold @5xl:text-[21px]">{node.title}</h3>
      {node.text && <p className="text-[13.5px] leading-snug text-muted @5xl:text-[18px]">{node.text}</p>}
    </div>
  )
}

function Arrow() {
  return (
    <span className="flex shrink-0 items-center justify-center text-accent">
      <ArrowDown className="size-5 @5xl:hidden" />
      <ArrowRight className="hidden size-6 @5xl:block" />
    </span>
  )
}

export function FlowSlide({ s }: { s: Of<'flow'> }) {
  // 6 узлов на сцене делим на два ряда по три, чтобы подписи не сжимались
  const rows = s.nodes.length > 5 ? [s.nodes.slice(0, 3), s.nodes.slice(3)] : [s.nodes]
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center gap-2 @5xl:gap-5">
        {rows.map((row, r) => (
          <Fragment key={r}>
            {r > 0 && (
              <div className="flex justify-center text-accent">
                <ArrowDown className="size-5 @5xl:size-6" />
              </div>
            )}
            <div className="flex flex-col gap-2 @5xl:flex-row @5xl:items-stretch @5xl:gap-3">
              {row.map((node, i) => (
                <Fragment key={node.title}>
                  {i > 0 && <Arrow />}
                  <FlowNode node={node} />
                </Fragment>
              ))}
            </div>
          </Fragment>
        ))}
        {s.caption && <p className="mt-4 max-w-[70ch] text-[14px] text-muted @5xl:mt-6 @5xl:text-[18px]">{s.caption}</p>}
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Временная линия ───────────── */
export function TimelineSlide({ s }: { s: Of<'timeline'> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <ol className="relative flex flex-col gap-5 border-l border-line pl-5 @5xl:grid @5xl:gap-5 @5xl:border-l-0 @5xl:pl-0" style={{ gridTemplateColumns: `repeat(${s.events.length}, minmax(0, 1fr))` }}>
          <span aria-hidden className="absolute top-[54px] right-0 left-0 hidden h-px bg-line @5xl:block" />
          {s.events.map((e) => (
            <li key={e.year + e.title} className="relative">
              <span className="absolute top-[7px] -left-[25px] size-2.5 rounded-full bg-accent @5xl:hidden" />
              <p className="tabular text-[14px] font-semibold text-accent @5xl:h-[40px] @5xl:text-[20px]">{e.year}</p>
              <span className="relative z-10 my-2.5 hidden size-3.5 rounded-full border-[3px] border-accent bg-bg @5xl:block" />
              <h3 className="text-[15px] leading-tight font-semibold @5xl:mt-4 @5xl:text-[19px]">{e.title}</h3>
              <p className="mt-1 text-[13.5px] leading-snug text-muted @5xl:mt-2 @5xl:text-[16px]">{e.text}</p>
            </li>
          ))}
        </ol>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Термины ───────────── */
export function TermsSlide({ s }: { s: Of<'terms'> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title} />
      <SlideBody className="flex flex-col justify-center">
        <dl className={`grid gap-x-14 gap-y-4 @5xl:gap-y-7 ${s.terms.length > 2 ? '@3xl:grid-cols-2' : ''}`}>
          {s.terms.map((t) => (
            <div key={t.term} className="border-t border-line pt-3 @5xl:pt-4">
              <dt className="text-[15.5px] font-semibold text-accent @5xl:text-[21px]">{t.term}</dt>
              <dd className="mt-1 text-[14.5px] leading-snug text-fg/85 @5xl:text-[18px]">{t.def}</dd>
            </div>
          ))}
        </dl>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Таблица ───────────── */
function Cell({ v }: { v: string }) {
  if (v === '●') return <span className="inline-block size-3 rounded-full bg-accent @5xl:size-4" aria-label="да" />
  if (v === '○') return <span className="inline-block size-3 rounded-full border-2 border-accent @5xl:size-4" aria-label="возможно" />
  return <>{v}</>
}

export function TableSlide({ s }: { s: Of<'table'> }) {
  const markOnly = s.rows.every((r) => r.slice(1).every((c) => c === '' || c === '●' || c === '○'))
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <div className="-mx-5 overflow-x-auto px-5 @5xl:mx-0 @5xl:px-0">
          <table className="w-full min-w-[560px] border-collapse text-left @5xl:min-w-0">
            <thead>
              <tr className="border-b-2 border-line">
                {s.head.map((h, i) => (
                  <th key={i} className={`pr-4 pb-3 text-[13px] font-semibold text-muted @5xl:pr-6 @5xl:text-[17px] ${markOnly && i > 0 ? 'text-center' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.rows.map((r, ri) => (
                <tr key={ri} className="border-b border-line align-top">
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className={`py-3 pr-4 text-[14px] leading-snug @5xl:py-[14px] @5xl:pr-6 @5xl:text-[18px] ${
                        ci === 0 ? 'font-semibold' : 'text-fg/85'
                      } ${markOnly && ci > 0 ? 'text-center align-middle' : ''}`}
                    >
                      <Cell v={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.note && <p className="mt-4 text-[13px] text-muted @5xl:mt-5 @5xl:text-[16px]">{s.note}</p>}
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Разбор случая ───────────── */
export function CaseSlide({ s }: { s: Of<'case'> }) {
  return (
    <SlideShell>
      <header>
        <p className="text-[14px] font-medium text-accent @5xl:text-[19px]">Разбор случая: {s.meta}</p>
        <h2 className="mt-1.5 font-display text-[22px] leading-[1.18] font-medium tracking-[-0.01em] @5xl:mt-2 @5xl:text-[38px]">{s.title}</h2>
      </header>
      <SlideBody className="grid gap-5 @5xl:grid-cols-[1.45fr_1fr] @5xl:gap-10">
        <ol className="flex flex-col justify-center gap-4 @5xl:gap-6">
          {s.story.map((st) => (
            <li key={st.label} className="grid gap-1 @5xl:grid-cols-[170px_1fr] @5xl:gap-6">
              <span className="text-[13.5px] font-semibold text-muted @5xl:pt-0.5 @5xl:text-[17px]">{st.label}</span>
              <p className="text-[15px] leading-snug @5xl:text-[19px]">{st.text}</p>
            </li>
          ))}
        </ol>
        <aside className="flex flex-col justify-center gap-3 self-center rounded-2xl bg-accent/10 p-5 @5xl:gap-4 @5xl:p-8">
          <span className="flex items-center gap-2 text-[14px] font-semibold text-accent @5xl:text-[18px]">
            <Lightbulb className="size-4 @5xl:size-5" /> Вывод
          </span>
          <p className="text-[16px] leading-snug font-medium @5xl:text-[22px]">{s.lesson}</p>
        </aside>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Разбор сообщения ───────────── */
function Marked({ text }: { text: string }) {
  const parts = text.split(/(\[\d+\])/g)
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[(\d+)\]$/)
        return m ? <Badge key={i} n={Number(m[1])} inline /> : <Fragment key={i}>{p}</Fragment>
      })}
    </>
  )
}

function Badge({ n, inline = false }: { n: number; inline?: boolean }) {
  return (
    <span
      className={`tabular inline-grid shrink-0 place-items-center rounded-full bg-danger font-sans font-bold text-bg ${
        inline ? 'mr-0.5 ml-1 size-[18px] translate-y-[-1px] align-middle text-[11px] @5xl:size-6 @5xl:text-[14px]' : 'size-6 text-[13px] @5xl:size-8 @5xl:text-[16px]'
      }`}
    >
      {n}
    </span>
  )
}

export function MessageSlide({ s }: { s: Of<'message'> }) {
  const channel = { email: 'Электронное письмо', sms: 'SMS-сообщение', chat: 'Сообщение' }[s.channel]
  const bubble = s.channel !== 'email'
  return (
    <SlideShell>
      <SlideHeader title={s.title} />
      <SlideBody className="grid gap-5 @5xl:grid-cols-[1.25fr_1fr] @5xl:gap-10">
        <figure className="self-center overflow-hidden rounded-2xl border border-line bg-panel">
          <figcaption className="flex items-center justify-between gap-3 border-b border-line bg-raised px-4 py-2.5 text-[12.5px] text-muted @5xl:px-6 @5xl:py-3 @5xl:text-[15px]">
            <span>{channel}</span>
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
              <span className="size-2 rounded-full bg-line" />
            </span>
          </figcaption>
          <div className="px-4 py-4 @5xl:px-6 @5xl:py-5">
            <p className="text-[13.5px] @5xl:text-[17px]">
              <span className="text-muted">{bubble ? '' : 'От: '}</span>
              <span className="font-semibold">
                <Marked text={s.from} />
              </span>
            </p>
            {s.subject && (
              <p className="mt-1 text-[13.5px] @5xl:text-[17px]">
                <span className="text-muted">Тема: </span>
                <span className="font-semibold">
                  <Marked text={s.subject} />
                </span>
              </p>
            )}
            <div className={`mt-4 flex flex-col gap-2.5 @5xl:mt-5 @5xl:gap-3 ${bubble ? '' : 'border-t border-line pt-4 @5xl:pt-5'}`}>
              {s.body.map((p, i) => (
                <p
                  key={i}
                  className={`text-[14.5px] leading-relaxed @5xl:text-[18.5px] ${
                    bubble ? 'max-w-[92%] self-start rounded-2xl rounded-tl-md bg-raised px-3.5 py-2 @5xl:px-4 @5xl:py-2.5' : ''
                  }`}
                >
                  <Marked text={p} />
                </p>
              ))}
            </div>
          </div>
        </figure>
        <div className="self-center">
          <p className="mb-3 text-[14px] font-semibold text-danger @5xl:mb-4 @5xl:text-[18px]">Признаки обмана</p>
          <ol className="flex flex-col gap-3 @5xl:gap-[18px]">
            {s.flags.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-[14.5px] leading-snug @5xl:gap-4 @5xl:text-[18px]">
                <Badge n={i + 1} />
                <span className="pt-0.5">{f}</span>
              </li>
            ))}
          </ol>
        </div>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Список рекомендаций ───────────── */
export function ChecklistSlide({ s }: { s: Of<'checklist'> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <ul className={`grid gap-x-12 gap-y-3 @5xl:gap-y-5 ${s.items.length > 4 ? '@3xl:grid-cols-2' : ''}`}>
          {s.items.map((t) => (
            <li key={t} className="flex gap-3 border-b border-line pb-3 text-[15px] leading-snug @5xl:gap-4 @5xl:pb-5 @5xl:text-[21px]">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent @5xl:size-6" strokeWidth={2} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Фрагменты кода ───────────── */
/** Маркер строчного комментария: комментарии приглушаются, остальной код — без подсветки */
const commentMark: Record<string, string> = { python: '#', yaml: '#', dockerfile: '#', bash: '#', http: '', sql: '--', js: '//', ts: '//', html: '' }

function CodeLine({ line, mark }: { line: string; mark: string }) {
  if (!mark) return <>{line}</>
  if (line.trimStart().startsWith(mark)) return <span className="text-muted">{line}</span>
  const i = line.indexOf(`  ${mark} `)
  if (i < 0) return <>{line}</>
  return (
    <>
      {line.slice(0, i)}
      <span className="text-muted">{line.slice(i)}</span>
    </>
  )
}

function CodePanel({ b, lang, size }: { b: CodeBlock; lang: string; size: string }) {
  const { thumb } = useSlide()
  const tone = b.tone ?? 'neutral'
  const border = tone === 'good' ? 'border-good/45' : tone === 'bad' ? 'border-danger/45' : 'border-line'
  const head = tone === 'good' ? 'text-good' : tone === 'bad' ? 'text-danger' : 'text-muted'
  const mark = commentMark[lang] ?? '#'
  return (
    <figure className={`flex min-w-0 flex-col overflow-hidden rounded-xl border bg-panel ${border}`}>
      <figcaption className={`flex items-center justify-between gap-3 border-b border-line bg-raised px-4 py-2 text-[12.5px] font-semibold @5xl:px-5 @5xl:text-[15px] ${head}`}>
        <span className="flex items-center gap-2">
          {tone === 'good' && <Check className="size-4 @5xl:size-[18px]" strokeWidth={2.5} />}
          {tone === 'bad' && <X className="size-4 @5xl:size-[18px]" strokeWidth={2.5} />}
          {b.label ?? 'Пример'}
        </span>
        <span className="font-mono font-normal text-muted">{lang}</span>
      </figcaption>
      <pre
        tabIndex={thumb ? -1 : 0}
        className={`overflow-x-auto px-4 py-3 font-mono [font-variant-ligatures:none] text-[12.5px] leading-[1.55] text-fg/90 @5xl:px-5 @5xl:py-4 ${size}`}
      >
        <code>
          {b.code.split('\n').map((l, i) => (
            <Fragment key={i}>
              <CodeLine line={l} mark={mark} />
              {'\n'}
            </Fragment>
          ))}
        </code>
      </pre>
    </figure>
  )
}

export function CodeSlide({ s }: { s: Of<'code'> }) {
  const two = s.blocks.length > 1
  const lines = Math.max(...s.blocks.map((b) => b.code.split('\n').length))
  // Размер шрифта на сцене подбирается по самому длинному блоку, чтобы код помещался в 1280×720
  const size = two || lines > 14 ? '@5xl:text-[15px]' : lines > 11 ? '@5xl:text-[16px]' : '@5xl:text-[17px]'
  const side = !two && s.notes
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className={`grid content-center gap-4 @5xl:gap-6 ${side ? '@5xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]' : ''}`}>
        <div className={`grid min-w-0 gap-4 @5xl:gap-5 ${two ? '@5xl:grid-cols-2' : ''}`}>
          {s.blocks.map((b, i) => (
            <CodePanel key={i} b={b} lang={s.lang} size={size} />
          ))}
        </div>
        {s.notes && (
          <ul className={`grid gap-x-10 gap-y-2.5 self-center @5xl:gap-y-4 ${two ? '@3xl:grid-cols-2' : ''}`}>
            {s.notes.map((n) => (
              <li key={n} className="flex gap-3 text-[14px] leading-snug @5xl:text-[18px]">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent @5xl:mt-[10px] @5xl:size-2" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        )}
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Шкала стойкости ───────────── */
export function MeterSlide({ s }: { s: Of<'meter'> }) {
  const max = Math.max(...s.rows.map((r) => r.bits), 1)
  const color = (b: number) => (b < 40 ? 'bg-danger' : b < 60 ? 'bg-warn' : 'bg-good')
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <ul className="flex flex-col gap-3.5 @5xl:gap-[11px]">
          {s.rows.map((r) => (
            <li key={r.label} className="grid items-center gap-x-6 gap-y-1.5 @5xl:grid-cols-[380px_1fr_92px]">
              <div className="min-w-0">
                <p className="text-[14px] leading-tight font-semibold @5xl:text-[17px]">{r.label}</p>
                <p className="mt-0.5 truncate font-mono text-[12.5px] text-muted @5xl:text-[15px]">{r.sample}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-2.5 overflow-hidden rounded-full bg-raised @5xl:h-3.5">
                  <div className={`h-full rounded-full ${color(r.bits)}`} style={{ width: `${Math.max((r.bits / max) * 100, 1.5)}%` }} />
                </div>
                <p className="text-[12.5px] leading-tight text-muted @5xl:text-[14px]">{r.note}</p>
              </div>
              <p className="tabular text-[14px] font-semibold @5xl:text-right @5xl:text-[19px]">{r.bits === 0 ? '≈ 0 бит' : `${r.bits} бит`}</p>
            </li>
          ))}
        </ul>
        {s.note && <p className="mt-4 text-[13px] text-muted @5xl:mt-5 @5xl:text-[16px]">{s.note}</p>}
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Выводы ───────────── */
export function SummarySlide({ s }: { s: Of<'summary'> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title ?? 'Основные выводы'} />
      <SlideBody className="flex flex-col justify-center">
        <ul className="grid gap-x-12 gap-y-5 @3xl:grid-cols-2 @5xl:gap-y-10">
          {s.points.map((p) => (
            <li key={p} className="flex gap-4 text-[16px] leading-snug font-medium @5xl:gap-5 @5xl:text-[26px]">
              <span className="mt-[7px] size-2.5 shrink-0 rotate-45 bg-accent @5xl:mt-[11px] @5xl:size-3" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </SlideBody>
    </SlideShell>
  )
}

/* ───────────── Источники ───────────── */
export function SourcesSlide({ s }: { s: Of<'sources'> }) {
  return (
    <SlideShell>
      <SlideHeader title="Источники" lead="Материалы для самостоятельного изучения. Документы доступны на официальных сайтах организаций." />
      <SlideBody className="flex flex-col justify-center">
        <ol className="flex flex-col">
          {s.items.map((it, i) => (
            <li key={i} className="grid gap-1 border-t border-line py-3 @5xl:grid-cols-[1fr_300px] @5xl:gap-8 @5xl:py-[18px]">
              <span className="text-[14.5px] leading-snug @5xl:text-[20px]">{it.title}</span>
              <span className="text-[13px] text-muted @5xl:text-right @5xl:text-[17px]">{it.org}</span>
            </li>
          ))}
        </ol>
      </SlideBody>
    </SlideShell>
  )
}

