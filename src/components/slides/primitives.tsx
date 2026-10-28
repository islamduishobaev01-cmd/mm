import { createContext, useContext, type ReactNode } from 'react'
import { icons, type IconKey } from '../../lib/icons'
import type { NumberedPresentation } from '../../data/types'

export interface SlideCtx {
  presentation: NumberedPresentation
  index: number
  /** Миниатюра: без интерактива */
  thumb: boolean
}

export const SlideContext = createContext<SlideCtx | null>(null)
export const useSlide = () => {
  const ctx = useContext(SlideContext)
  if (!ctx) throw new Error('useSlide outside SlideContext')
  return ctx
}

export function Icon({ name, className = 'size-5', strokeWidth = 1.75 }: { name: IconKey; className?: string; strokeWidth?: number }) {
  const Cmp = icons[name]
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />
}

/** Квадратная плашка с иконкой в акцентном цвете темы */
export function IconTile({ name, tone = 'accent', size = 'md' }: { name: IconKey; tone?: 'accent' | 'danger'; size?: 'md' | 'lg' }) {
  const color = tone === 'danger' ? 'text-danger bg-danger/12' : 'text-accent bg-accent/12'
  const dims = size === 'lg' ? 'size-10 @5xl:size-14 rounded-xl' : 'size-9 @5xl:size-11 rounded-lg'
  return (
    <span className={`${dims} ${color} grid shrink-0 place-items-center`}>
      <Icon name={name} className={size === 'lg' ? 'size-5 @5xl:size-7' : 'size-[18px] @5xl:size-[22px]'} />
    </span>
  )
}

/** Каркас слайда. В режиме сцены его размер 1280×720, на телефоне — ширина экрана и высота по содержимому. */
export function SlideShell({ children, bare = false }: { children: ReactNode; bare?: boolean }) {
  const { presentation, index } = useSlide()
  return (
    <div className="slide-scope @container relative flex min-h-full w-full flex-col bg-bg text-fg">
      <div className={bare ? 'flex min-h-0 flex-1 flex-col' : 'flex min-h-0 flex-1 flex-col px-5 pt-6 pb-8 @5xl:px-[72px] @5xl:pt-[52px] @5xl:pb-0'}>
        {children}
      </div>
      {!bare && (
        <footer className="mt-auto hidden items-center justify-between px-[72px] pt-4 pb-7 text-[15px] text-muted @5xl:flex">
          <span className="truncate pr-8">
            {presentation.number}. {presentation.title}
          </span>
          <span className="tabular shrink-0">
            {index + 1} / {presentation.total}
          </span>
        </footer>
      )}
    </div>
  )
}

export function SlideHeader({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="shrink-0">
      <h2 className="font-display text-[22px] leading-[1.18] font-medium tracking-[-0.01em] @5xl:text-[38px]">{title}</h2>
      {lead && <p className="mt-2 max-w-[62ch] text-[15px] leading-snug text-muted @5xl:mt-3 @5xl:text-[20px]">{lead}</p>}
    </header>
  )
}

export function SlideBody({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mt-5 min-h-0 flex-1 @5xl:mt-8 ${className}`}>{children}</div>
}

/** Сетка: число колонок на сцене подбирается по количеству элементов, чтобы не оставлять «сирот» */
export function gridCols(n: number) {
  if (n <= 2) return '@3xl:grid-cols-2'
  if (n === 4) return '@3xl:grid-cols-2'
  return '@3xl:grid-cols-2 @5xl:grid-cols-3'
}
