/**
 * Тематическая «матрица данных»: детерминированный узор из ячеек, своя для каждой темы.
 * Напоминает машиночитаемый код — образ закодированной, защищённой информации.
 */
function rng(seed: string) {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 1000) / 1000
  }
}

const N = 13
const CENTER = [4, 8] // свободная середина под иконку

function isFinder(x: number, y: number) {
  const inCorner = (cx: number, cy: number) => x >= cx && x < cx + 3 && y >= cy && y < cy + 3
  return inCorner(0, 0) || inCorner(N - 3, 0) || inCorner(0, N - 3)
}

export function DataGlyph({ seed, className = '' }: { seed: string; className?: string }) {
  const rand = rng(seed)
  const cells: { x: number; y: number; o: number }[] = []
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (x >= CENTER[0] && x <= CENTER[1] && y >= CENTER[0] && y <= CENTER[1]) continue
      if (isFinder(x, y)) {
        const edge = x % (N - 3) === 1 && y % (N - 3) === 1 ? 1 : 0.9
        cells.push({ x, y, o: edge })
        continue
      }
      const r = rand()
      if (r < 0.42) continue
      cells.push({ x, y, o: r > 0.9 ? 1 : r > 0.75 ? 0.55 : r > 0.6 ? 0.3 : 0.14 })
    }
  }
  const s = 10
  const g = 2.4
  return (
    <svg viewBox={`0 0 ${N * s} ${N * s}`} className={className} aria-hidden="true">
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x * s + g / 2} y={c.y * s + g / 2} width={s - g} height={s - g} rx={1.6} fill="var(--accent)" fillOpacity={c.o} />
      ))}
    </svg>
  )
}
