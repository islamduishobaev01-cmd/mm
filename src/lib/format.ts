/** Русское склонение: plural(5, ['слайд', 'слайда', 'слайдов']) → «слайдов» */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}

/** Нормализация для поиска: регистр, ё → е, лишние пробелы */
export const normalize = (s: string) => s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim()

export const pad2 = (n: number) => String(n).padStart(2, '0')

/** Безопасная работа с localStorage: в приватных окнах и встраиваемых фреймах он может быть недоступен */
export const storage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* ignore */
    }
  },
}
