import { ArrowRight, LayoutGrid, MessagesSquare, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { presentations, sections } from '../../data'
import type { NumberedPresentation, Slide } from '../../data/types'
import { plural, pad2 } from '../../lib/format'
import { DataGlyph } from '../DataGlyph'
import { DiagramView } from './diagrams'
import * as L from './layouts'
import { Icon, SlideBody, SlideContext, SlideHeader, SlideShell, useSlide } from './primitives'

/* ───────────── Титульный слайд ───────────── */
function TitleSlide() {
  const { presentation: p } = useSlide()
  return (
    <SlideShell bare>
      <div className="blueprint relative flex flex-1 flex-col gap-8 overflow-hidden px-5 pt-8 pb-10 @5xl:flex-row @5xl:items-center @5xl:gap-16 @5xl:px-[72px] @5xl:py-0">
        <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-5 @5xl:gap-8">
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-muted @5xl:text-[19px]">
            <span className="tabular font-semibold text-accent">Тема {p.number} из {presentations.length}</span>
            <span>{sections[p.section].title}</span>
          </p>
          <h1 className="font-display text-[30px] leading-[1.08] font-medium tracking-[-0.02em] @5xl:text-[56px]">{p.title}</h1>
          <p className="max-w-[40ch] text-[16px] leading-snug text-muted @5xl:text-[24px]">{p.subtitle}</p>
          <p className="tabular text-[13px] text-muted @5xl:mt-6 @5xl:text-[17px]">
            {p.total} {plural(p.total, ['слайд', 'слайда', 'слайдов'])}. Курс «Информационная безопасность»
          </p>
        </div>
        <div className="relative mx-auto w-[200px] shrink-0 @5xl:mx-0 @5xl:w-[380px]">
          <DataGlyph seed={p.slug} className="w-full" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="grid size-[64px] place-items-center rounded-2xl bg-bg text-accent ring-1 ring-accent/40 @5xl:size-[120px] @5xl:rounded-3xl">
              <Icon name={p.icon} className="size-8 @5xl:size-14" strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

/* ───────────── Завершающий слайд ───────────── */
function EndSlide() {
  const { presentation: p, thumb } = useSlide()
  const next = presentations[p.number] as NumberedPresentation | undefined
  const tab = thumb ? -1 : 0
  const btn = 'inline-flex items-center gap-2.5 rounded-xl px-4 py-3 text-[14px] font-semibold transition-colors @5xl:px-6 @5xl:py-4 @5xl:text-[18px]'
  return (
    <SlideShell>
      <div className="my-auto flex flex-col gap-6 py-6 @5xl:gap-10 @5xl:py-0">
        <div className="flex items-center gap-3 text-accent">
          <MessagesSquare className="size-6 @5xl:size-9" strokeWidth={1.5} />
          <span className="text-[14px] font-medium @5xl:text-[20px]">Тема {pad2(p.number)} завершена</span>
        </div>
        <h2 className="font-display text-[30px] leading-[1.08] font-medium tracking-[-0.02em] @5xl:text-[64px]">Вопросы и обсуждение</h2>
        <p className="max-w-[52ch] text-[15px] leading-snug text-muted @5xl:text-[22px]">
          Обсудите, какие из рассмотренных угроз встречались вам лично и какие меры защиты вы уже применяете.
        </p>
        <div className="flex flex-wrap gap-3 @5xl:mt-4 @5xl:gap-4">
          {next && (
            <Link to={`/p/${next.slug}`} tabIndex={tab} className={`${btn} bg-accent text-bg hover:bg-accent/85`}>
              Следующая тема: {next.number}. {next.title.length > 42 ? next.title.slice(0, 40).trimEnd() + '…' : next.title}
              <ArrowRight className="size-4 @5xl:size-5" />
            </Link>
          )}
          <Link to={`/p/${p.slug}`} tabIndex={tab} className={`${btn} border border-line hover:border-accent`}>
            <RotateCcw className="size-4 @5xl:size-5" /> С начала
          </Link>
          <Link to="/" tabIndex={tab} className={`${btn} border border-line hover:border-accent`}>
            <LayoutGrid className="size-4 @5xl:size-5" /> Все презентации
          </Link>
        </div>
      </div>
    </SlideShell>
  )
}

function DiagramSlide({ s }: { s: Extract<Slide, { kind: 'diagram' }> }) {
  return (
    <SlideShell>
      <SlideHeader title={s.title} lead={s.lead} />
      <SlideBody className="flex flex-col justify-center">
        <DiagramView d={s.diagram} />
        {s.caption && <p className="mt-4 max-w-[75ch] text-[13.5px] text-muted @5xl:mt-6 @5xl:text-[17px]">{s.caption}</p>}
      </SlideBody>
    </SlideShell>
  )
}

function Content({ s }: { s: Slide }) {
  switch (s.kind) {
    case 'statement':
      return <L.StatementSlide s={s} />
    case 'points':
      return <L.PointsSlide s={s} />
    case 'cards':
      return <L.CardsSlide s={s} />
    case 'compare':
      return <L.CompareSlide s={s} />
    case 'steps':
      return <L.StepsSlide s={s} />
    case 'flow':
      return <L.FlowSlide s={s} />
    case 'timeline':
      return <L.TimelineSlide s={s} />
    case 'terms':
      return <L.TermsSlide s={s} />
    case 'table':
      return <L.TableSlide s={s} />
    case 'case':
      return <L.CaseSlide s={s} />
    case 'message':
      return <L.MessageSlide s={s} />
    case 'checklist':
      return <L.ChecklistSlide s={s} />
    case 'code':
      return <L.CodeSlide s={s} />
    case 'meter':
      return <L.MeterSlide s={s} />
    case 'summary':
      return <L.SummarySlide s={s} />
    case 'sources':
      return <L.SourcesSlide s={s} />
    case 'diagram':
      return <DiagramSlide s={s} />
  }
}

/** Отрисовывает слайд по номеру: 0 — титульный, последний — завершающий */
export function SlideRenderer({ presentation, index, thumb = false }: { presentation: NumberedPresentation; index: number; thumb?: boolean }) {
  const last = presentation.total - 1
  return (
    <SlideContext.Provider value={{ presentation, index, thumb }}>
      {index === 0 ? <TitleSlide /> : index === last ? <EndSlide /> : <Content s={presentation.slides[index - 1]} />}
    </SlideContext.Provider>
  )
}

/** Название слайда для миниатюр и подписей */
export function slideLabel(p: NumberedPresentation, index: number): string {
  if (index === 0) return 'Титульный слайд'
  if (index === p.total - 1) return 'Вопросы и обсуждение'
  const s = p.slides[index - 1]
  if ('title' in s && s.title) return s.title
  if (s.kind === 'statement') return s.label ?? 'Ключевая мысль'
  if (s.kind === 'summary') return 'Основные выводы'
  if (s.kind === 'sources') return 'Источники'
  return `Слайд ${index + 1}`
}
