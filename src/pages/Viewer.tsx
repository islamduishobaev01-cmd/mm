import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize, Moon, Sun, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SlideRenderer, slideLabel } from '../components/slides/SlideRenderer'
import { bySlug, tones } from '../data'
import type { NumberedPresentation } from '../data/types'
import { storage } from '../lib/format'
import { useElementSize, useFullscreen, useIdle } from '../lib/hooks'

const W = 1280
const H = 720

export default function Viewer() {
  const { slug = '' } = useParams()
  const p = bySlug(slug)
  if (!p) return <Navigate to="/" replace />
  return <Deck key={p.slug} p={p} />
}

function Deck({ p }: { p: NumberedPresentation }) {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const last = p.total - 1
  const index = Math.min(Math.max((Number(params.get('s')) || 1) - 1, 0), last)
  const [dir, setDir] = useState(1)
  const [grid, setGrid] = useState(false)
  const [light, setLight] = useState(() => storage.get('slides-theme') === 'light')
  const fs = useFullscreen()
  const idle = useIdle(fs.active && !grid)
  const [areaRef, area] = useElementSize<HTMLDivElement>()

  const go = useCallback(
    (to: number) => {
      const t = Math.min(Math.max(to, 0), last)
      if (t === index) return
      setDir(t > index ? 1 : -1)
      setParams(t === 0 ? {} : { s: String(t + 1) }, { replace: true })
    },
    [index, last, setParams],
  )

  const toggleLight = () =>
    setLight((v) => {
      storage.set('slides-theme', v ? 'dark' : 'light')
      return !v
    })

  useEffect(() => {
    document.title = `${p.number}. ${p.title}`
    return () => {
      document.title = 'Презентации по информационной безопасности'
    }
  }, [p])

  // Клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return
      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault()
          go(index + 1)
          break
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault()
          go(index - 1)
          break
        case 'Home':
          go(0)
          break
        case 'End':
          go(last)
          break
        case 'f':
        case 'F':
        case 'а':
        case 'А':
          fs.toggle()
          break
        case 'g':
        case 'G':
        case 'п':
        case 'П':
          setGrid((v) => !v)
          break
        case 'Escape':
          if (grid) setGrid(false)
          else if (!document.fullscreenElement) navigate('/')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, index, last, grid, fs, navigate])

  // Свайпы
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return
    touch.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = touch.current
    touch.current = null
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(index + (dx < 0 ? 1 : -1))
  }

  // Сцена 1280×720 масштабируется под экран; на узком вертикальном экране слайд перестраивается под ширину
  const fluid = area.width > 0 && area.width < 700 && area.height > area.width
  const scale = Math.min(area.width / W, area.height / H) || 0

  const tone = tones[p.tone]
  const vars = { '--accent': tone.dark, '--accent-d': tone.dark, '--accent-l': tone.light } as CSSProperties
  const progress = ((index + 1) / p.total) * 100
  const chromeHidden = idle ? 'opacity-0 pointer-events-none' : 'opacity-100'

  const variants = useMemo(
    () => ({
      enter: (d: number) => ({ x: d * 48, opacity: 0 }),
      center: { x: 0, opacity: 1 },
      exit: (d: number) => ({ x: d * -48, opacity: 0 }),
    }),
    [],
  )

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy-deep text-fg"
      data-slides={light ? 'light' : 'dark'}
      style={{ ...vars, cursor: idle ? 'none' : undefined }}
      role="region"
      aria-roledescription="презентация"
      aria-label={p.title}
    >
      {/* Верхняя панель */}
      <header
        className={`flex shrink-0 items-center gap-2 pt-[max(8px,env(safe-area-inset-top))] pr-[max(8px,env(safe-area-inset-right))] pb-2 pl-[max(8px,env(safe-area-inset-left))] transition-opacity duration-300 sm:gap-3 sm:px-4 ${chromeHidden}`}
      >
        <Link
          to="/"
          onClick={() => fs.exit()}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-[14px] text-muted hover:bg-white/5 hover:text-fg"
          aria-label="Закрыть презентацию и вернуться в каталог"
        >
          <X className="size-5" />
          <span className="hidden sm:inline">Каталог</span>
        </Link>
        <div className="min-w-0 flex-1 truncate text-center text-[14px] sm:text-[15px]">
          <span className="tabular mr-2 font-semibold" style={{ color: tone.dark }}>
            {p.number}.
          </span>
          {p.title}
        </div>
        <ToolButton onClick={toggleLight} label={light ? 'Тёмные слайды' : 'Светлые слайды для проектора'} pressed={light}>
          {light ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </ToolButton>
        <ToolButton onClick={() => setGrid((v) => !v)} label="Все слайды (G)" pressed={grid}>
          <LayoutGrid className="size-[18px]" />
        </ToolButton>
        {fs.supported && (
          <ToolButton onClick={fs.toggle} label={fs.active ? 'Выйти из полноэкранного режима (F)' : 'Полноэкранный режим (F)'} pressed={fs.active}>
            {fs.active ? <Minimize className="size-[18px]" /> : <Maximize className="size-[18px]" />}
          </ToolButton>
        )}
      </header>

      {/* Сцена */}
      <div
        ref={areaRef}
        className={`relative min-h-0 flex-1 ${fluid ? '' : 'mx-[max(0px,env(safe-area-inset-left))] sm:mx-4'}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: 'pan-y' }}
      >
        {scale > 0 && (
          <div
            className={fluid ? 'absolute inset-0' : 'absolute top-1/2 left-1/2 overflow-hidden rounded-[4px] shadow-[0_0_0_1px_rgba(255,255,255,0.06)]'}
            style={fluid ? undefined : { width: W * scale, height: H * scale, transform: 'translate(-50%, -50%)' }}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={index}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 0.8, 0.3, 1] }}
                className={fluid ? 'absolute inset-0 overflow-y-auto overscroll-contain' : 'absolute inset-0'}
                aria-live="polite"
              >
                {fluid ? (
                  <SlideRenderer presentation={p} index={index} />
                ) : (
                  <div style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                    <SlideRenderer presentation={p} index={index} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Нижняя панель */}
      <footer
        className={`flex shrink-0 items-center gap-3 pt-2 pr-[max(12px,env(safe-area-inset-right))] pb-[max(10px,env(safe-area-inset-bottom))] pl-[max(12px,env(safe-area-inset-left))] transition-opacity duration-300 sm:gap-5 sm:px-6 ${chromeHidden}`}
      >
        <NavButton onClick={() => go(index - 1)} disabled={index === 0} label="Предыдущий слайд (←)">
          <ChevronLeft className="size-6" />
        </NavButton>
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <div
            className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={p.total}
            aria-valuenow={index + 1}
            aria-label="Прогресс презентации"
          >
            <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300" style={{ width: `${progress}%`, background: tone.dark }} />
          </div>
          <span className="tabular shrink-0 text-[14px] text-muted">
            <span className="font-semibold text-fg">{index + 1}</span> / {p.total}
          </span>
        </div>
        <NavButton onClick={() => go(index + 1)} disabled={index === last} label="Следующий слайд (→)" primary>
          <ChevronRight className="size-6" />
        </NavButton>
      </footer>

      <AnimatePresence>
        {grid && (
          <SlideGrid
            p={p}
            current={index}
            onPick={(i) => {
              go(i)
              setGrid(false)
            }}
            onClose={() => setGrid(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ToolButton({ children, onClick, label, pressed }: { children: React.ReactNode; onClick: () => void; label: string; pressed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors hover:bg-white/8 hover:text-fg ${pressed ? 'bg-white/8 text-fg' : 'text-muted'}`}
    >
      {children}
    </button>
  )
}

function NavButton({ children, onClick, disabled, label, primary }: { children: React.ReactNode; onClick: () => void; disabled: boolean; label: string; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-11 shrink-0 place-items-center rounded-full border transition-colors disabled:cursor-default disabled:opacity-30 ${
        primary ? 'border-accent/60 text-accent enabled:hover:bg-accent/12' : 'border-white/15 text-fg enabled:hover:bg-white/8'
      }`}
    >
      {children}
    </button>
  )
}

/* ───────────── Миниатюры ───────────── */
const TW = 232
function SlideGrid({ p, current, onPick, onClose }: { p: NumberedPresentation; current: number; onPick: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('[data-current="true"]')?.focus()
  }, [])
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-10 flex flex-col bg-navy-deep/96 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Все слайды"
    >
      <div className="flex items-center justify-between px-[max(16px,env(safe-area-inset-left))] pt-[max(12px,env(safe-area-inset-top))] pb-3 sm:px-6">
        <h2 className="font-display text-[17px] font-medium">Все слайды</h2>
        <button type="button" onClick={onClose} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[14px] text-muted hover:bg-white/5 hover:text-fg">
          <X className="size-5" /> Закрыть
        </button>
      </div>
      <div ref={ref} className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(24px,env(safe-area-inset-bottom))] sm:px-6">
        <ol className="grid justify-center gap-x-5 gap-y-6" style={{ gridTemplateColumns: `repeat(auto-fill, ${TW}px)` }}>
          {Array.from({ length: p.total }, (_, i) => (
            <li key={i}>
              <button
                type="button"
                data-current={i === current}
                onClick={() => onPick(i)}
                className="group block w-full text-left"
                aria-label={`Слайд ${i + 1}: ${slideLabel(p, i)}`}
              >
                <span
                  className={`relative block overflow-hidden rounded-md ring-2 transition ${i === current ? 'ring-[var(--accent-d)]' : 'ring-transparent group-hover:ring-white/30'}`}
                  style={{ width: TW, height: (TW * H) / W }}
                >
                  <span className="pointer-events-none absolute top-0 left-0 block" style={{ width: W, height: H, transform: `scale(${TW / W})`, transformOrigin: 'top left' }} inert>
                    <SlideRenderer presentation={p} index={i} thumb />
                  </span>
                </span>
                <span className="mt-2 flex gap-2 text-[13px] leading-tight">
                  <span className="tabular font-semibold text-muted">{i + 1}</span>
                  <span className="line-clamp-2 text-fg/85">{slideLabel(p, i)}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </motion.div>
  )
}
