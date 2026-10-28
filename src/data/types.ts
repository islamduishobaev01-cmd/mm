import type { IconKey } from '../lib/icons'

/** Цветовая тема презентации внутри общей дизайн-системы */
export type Tone = 'teal' | 'cyan' | 'sky' | 'amber' | 'coral' | 'violet' | 'mint'

export type Section = 'basics' | 'threats' | 'tech' | 'practice'

export interface Item {
  title: string
  text?: string
  icon?: IconKey
  /** Заголовок — техническая строка (адрес, код), набирается моноширинным шрифтом */
  mono?: boolean
}

export interface CompareSide {
  title: string
  /** good — правильно / защищено, bad — ошибка / угроза, neutral — просто вариант */
  tone: 'good' | 'bad' | 'neutral'
  items: string[]
}

export type Diagram =
  | { type: 'cia' }
  | { type: 'layers'; layers: Item[] }
  | { type: 'backup321' }
  | { type: 'symmetric' }
  | { type: 'asymmetric' }
  | { type: 'factors' }
  | { type: 'mitm' }
  | { type: 'hash' }
  | { type: 'risk' }

export type Slide =
  /** Крупный тезис */
  | { kind: 'statement'; label?: string; text: string; sub?: string }
  /** Тезисы с пояснениями */
  | { kind: 'points'; title: string; lead?: string; items: Item[] }
  /** Карточки: угрозы, примеры, категории */
  | { kind: 'cards'; title: string; lead?: string; items: (Item & { tag?: string })[]; variant?: 'threat' | 'neutral' }
  /** Сравнение в двух колонках */
  | { kind: 'compare'; title: string; lead?: string; left: CompareSide; right: CompareSide }
  /** Пронумерованная последовательность действий */
  | { kind: 'steps'; title: string; lead?: string; steps: Item[] }
  /** Схема процесса со стрелками */
  | { kind: 'flow'; title: string; lead?: string; nodes: Item[]; caption?: string }
  /** Временная линия */
  | { kind: 'timeline'; title: string; lead?: string; events: { year: string; title: string; text: string }[] }
  /** Термины и определения */
  | { kind: 'terms'; title: string; terms: { term: string; def: string }[] }
  /** Сравнительная таблица */
  | { kind: 'table'; title: string; lead?: string; head: string[]; rows: string[][]; note?: string }
  /** Разбор реального случая */
  | { kind: 'case'; title: string; meta: string; story: { label: string; text: string }[]; lesson: string }
  /** Разбор сообщения с отмеченными признаками обмана. В body маркер [n] ставит метку */
  | {
      kind: 'message'
      title: string
      channel: 'email' | 'sms' | 'chat'
      from: string
      subject?: string
      body: string[]
      flags: string[]
    }
  /** Список рекомендаций */
  | { kind: 'checklist'; title: string; lead?: string; items: string[] }
  /** Схема / диаграмма */
  | { kind: 'diagram'; title: string; lead?: string; diagram: Diagram; caption?: string }
  /** Шкала стойкости */
  | { kind: 'meter'; title: string; lead?: string; rows: { label: string; sample: string; bits: number; note: string }[]; note?: string }
  /** Выводы */
  | { kind: 'summary'; title?: string; points: string[] }
  /** Источники */
  | { kind: 'sources'; items: { title: string; org: string }[] }

export interface Presentation {
  slug: string
  title: string
  description: string
  section: Section
  icon: IconKey
  tone: Tone
  /** Подзаголовок на титульном слайде */
  subtitle: string
  slides: Slide[]
}

export interface NumberedPresentation extends Presentation {
  number: number
  /** Слайдов всего, включая титульный и завершающий */
  total: number
}
