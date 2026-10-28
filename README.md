# Информационная безопасность — сайт презентаций

20 учебных презентаций по ИБ (254 слайда) с интерактивным просмотром: клавиатура, свайпы, полноэкранный режим, миниатюры, светлая схема слайдов для проектора.

Стек: React 19, TypeScript, Vite, Tailwind CSS 4, React Router, Lucide React, Framer Motion. Шрифты (Unbounded, Onest, JetBrains Mono) подключены локально через Fontsource — сайт не зависит от Google Fonts.

## Запуск

```bash
npm install
npm run dev            # разработка
npm run build          # сборка в dist/ (любой статический хостинг, в т. ч. GitHub Pages)
npm run build:single   # один самодостаточный HTML-файл в dist-single/ (можно открыть без интернета)
```

Маршрутизация по умолчанию — `HashRouter` (`/#/p/fishing?s=4`), поэтому сборка работает на любом статическом хостинге без настройки сервера. Для «чистых» адресов задайте `VITE_ROUTER=browser` (и `VITE_BASE`, если сайт не в корне) и настройте отдачу `index.html` на все пути.

## Структура

```
src/
  data/
    types.ts                 типы слайдов (16 макетов) и презентаций
    index.ts                 порядок курса, разделы, цвета тем
    presentations/NN-*.ts    по файлу на презентацию
  components/
    slides/layouts.tsx       макеты слайдов
    slides/diagrams.tsx      схемы: CIA, слои защиты, 3-2-1, шифрование, MITM, матрица рисков, живой SHA-256
    slides/SlideRenderer.tsx титульный и завершающий слайды, выбор макета
    home/CiaHero.tsx         интерактивная триада на главной
  pages/Home.tsx, Viewer.tsx
```

## Как добавить презентацию

1. Создайте `src/data/presentations/21-new-topic.ts` по образцу существующих: `slug`, `title`, `description`, `section`, `icon`, `tone`, `subtitle`, `slides`.
2. Добавьте импорт в массив `ordered` в `src/data/index.ts`.

Титульный и завершающий слайды создаются автоматически. Доступные макеты: `statement`, `points`, `cards`, `compare`, `steps`, `flow`, `timeline`, `terms`, `table`, `case`, `message`, `checklist`, `diagram`, `meter`, `summary`, `sources`. TypeScript подскажет поля каждого.

## Управление презентацией

`←` `→` / `Space` — слайды, `Home` / `End` — в начало и конец, `F` — полноэкранный режим, `G` — все слайды, `Esc` — в каталог. На телефоне — свайпы.

## Об источниках

Факты и рекомендации опираются на ISO/IEC 27000/27001/27005/27701, публикации NIST (CSF 2.0, SP 800-63B-4, SP 800-83, SP 800-124 и др.), материалы CISA, NCSC, ENISA, Европола, RFC IETF и законодательство о персональных данных (Закон КР № 58, GDPR, 152-ФЗ). Список источников — на предпоследнем слайде каждой презентации. Конкретные цифры приведены только для широко задокументированных инцидентов (WannaCry, Equifax, Capital One, Colonial Pipeline и др.). Перед использованием в учебном процессе рекомендуется сверить их с первоисточниками.
# mm
