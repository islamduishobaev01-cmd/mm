import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bySlug, tones } from '../../data'
import { ciaParts } from '../slides/diagrams'

const related: Record<string, string[]> = {
  c: ['personalnye-dannye', 'shifrovanie', 'utechki-informacii', 'socseti'],
  i: ['shifrovanie', 'virusy', 'elektronnaya-pochta', 'antivirusy'],
  a: ['rezervnoe-kopirovanie', 'kiberprestupnost', 'vidy-ugroz', 'zashchita-kompyutera'],
}

// Вершины треугольника в координатах viewBox 400×340
const pts = [
  { x: 200, y: 34 },
  { x: 40, y: 300 },
  { x: 360, y: 300 },
]

/** Интерактивная триада CIA: выберите свойство — увидите, что оно значит и где о нём рассказано */
export function CiaHero() {
  const [active, setActive] = useState(0)
  const part = ciaParts[active]
  return (
    <div className="flex flex-col gap-5">
      <div className="mx-auto w-full max-w-[460px] px-11 sm:px-8">
      <div className="relative">
        <svg viewBox="0 0 400 340" className="w-full overflow-visible" aria-hidden="true">
          <motion.polygon
            points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="var(--line)"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          />
          {/* Ребро между выбранной вершиной и центром */}
          {pts.map((p, i) => (
            <motion.line
              key={i}
              x1={200}
              y1={211}
              x2={p.x}
              y2={p.y}
              stroke={i === active ? 'var(--accent)' : 'var(--line)'}
              strokeWidth={i === active ? 2 : 1}
              strokeDasharray={i === active ? undefined : '3 5'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.12, duration: 0.6 }}
            />
          ))}
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.4 }} style={{ originX: '200px', originY: '211px' }}>
            <circle cx={200} cy={211} r={44} fill="var(--graphite)" stroke="var(--accent)" strokeWidth={1.5} />
            <text x={200} y={215} textAnchor="middle" fill="var(--white)" style={{ font: '500 11px var(--font-display)' }}>
              Информация
            </text>
          </motion.g>
        </svg>
        {ciaParts.map((p, i) => {
          const pos = pts[i]
          const isActive = i === active
          return (
            <motion.button
              key={p.key}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-pressed={isActive}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.4 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors sm:px-4 sm:py-2 sm:text-[15px] ${
                isActive ? 'border-accent bg-accent text-navy-deep' : 'border-line bg-graphite text-fg hover:border-accent'
              }`}
              style={{ left: `${(pos.x / 400) * 100}%`, top: `${(pos.y / 340) * 100}%` }}
            >
              {p.title}
            </motion.button>
          )
        })}
      </div>
      </div>
      <div className="rounded-2xl border border-line bg-graphite p-5 sm:p-6" aria-live="polite">
        <p className="text-[16px] leading-snug sm:text-[17px]">
          <span className="font-semibold text-accent">{part.title}.</span> {part.text}
        </p>
        <p className="mt-1.5 text-[14px] text-muted">Как обеспечивают: {part.means.toLowerCase()}.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {related[part.key].map((slug) => {
            const p = bySlug(slug)!
            return (
              <li key={slug}>
                <Link
                  to={`/p/${slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-[13px] text-fg/90 transition-colors hover:border-[var(--c)] hover:text-fg"
                  style={{ '--c': tones[p.tone].dark } as React.CSSProperties}
                >
                  <span className="tabular font-semibold" style={{ color: tones[p.tone].dark }}>
                    {p.number}
                  </span>
                  {shortTitle(p.title)}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const shortNames: Record<string, string> = {
  'Информационная безопасность в социальных сетях': 'Безопасность в соцсетях',
  'Причины утечки информации и её последствия': 'Утечки информации',
  'Основные понятия и задачи информационной безопасности': 'Основы ИБ',
  'Виды угроз информационной безопасности': 'Виды угроз',
}

function shortTitle(t: string) {
  if (shortNames[t]) return shortNames[t]
  const cut = t.replace(/ и (его|их|способы|методы|правила).*$/, '')
  return cut.length > 38 ? cut.slice(0, 36).trimEnd() + '…' : cut
}
