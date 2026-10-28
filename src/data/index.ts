import type { NumberedPresentation, Presentation, Section, Tone } from './types'
import p01 from './presentations/01-basics'
import p02 from './presentations/02-threats'
import p03 from './presentations/03-viruses'
import p04 from './presentations/04-passwords'
import p05 from './presentations/05-personal-data'
import p06 from './presentations/06-phishing'
import p07 from './presentations/07-safe-internet'
import p08 from './presentations/08-antivirus'
import p09 from './presentations/09-computer'
import p10 from './presentations/10-social'
import p11 from './presentations/11-2fa'
import p12 from './presentations/12-cybercrime'
import p13 from './presentations/13-encryption'
import p14 from './presentations/14-backup'
import p15 from './presentations/15-email'
import p16 from './presentations/16-mobile'
import p17 from './presentations/17-wifi'
import p18 from './presentations/18-social-engineering'
import p19 from './presentations/19-leaks'
import p20 from './presentations/20-hygiene'

/** Порядок курса. Чтобы добавить презентацию — создайте файл в presentations/ и добавьте его сюда. */
const ordered: Presentation[] = [
  p01, p02, p03, p04, p05, p06, p07, p08, p09, p10,
  p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
]

export const presentations: NumberedPresentation[] = ordered.map((p, i) => ({
  ...p,
  number: i + 1,
  total: p.slides.length + 2, // + титульный и завершающий
}))

export const bySlug = (slug: string) => presentations.find((p) => p.slug === slug)

export const sections: Record<Section, { title: string; text: string }> = {
  basics: { title: 'Основы', text: 'Понятия, угрозы и защита рабочего места' },
  threats: { title: 'Угрозы и атаки', text: 'Как действуют злоумышленники' },
  tech: { title: 'Технологии защиты', text: 'Инструменты, которые защищают данные' },
  practice: { title: 'Повседневная практика', text: 'Правила для учёбы, работы и жизни' },
}

/** Акцент каждой темы. Значения подобраны для тёмного и светлого фона. */
export const tones: Record<Tone, { dark: string; light: string }> = {
  teal: { dark: '#41D3C2', light: '#0B8A7E' },
  cyan: { dark: '#4CC9F0', light: '#0A7FA6' },
  sky: { dark: '#7AA7FF', light: '#2C5FD0' },
  violet: { dark: '#A99BFF', light: '#5B47D6' },
  mint: { dark: '#5FDDA0', light: '#13814C' },
  amber: { dark: '#F4B740', light: '#A86400' },
  coral: { dark: '#FF7A72', light: '#C2362E' },
}

export const totalSlides = presentations.reduce((s, p) => s + p.total, 0)
