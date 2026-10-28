import { MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, HashRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { bySlug } from './data'

const Viewer = lazy(() => import('./pages/Viewer'))

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname === '/') return
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/** В режиме одного файла адрес хранится в памяти, а в адресную строку пишется только #slug темы */
function HashSync() {
  const { pathname } = useLocation()
  useEffect(() => {
    const slug = pathname.startsWith('/p/') ? pathname.slice(3) : ''
    const next = slug ? `#${slug}` : ''
    if (window.location.hash !== next) {
      try {
        history.replaceState(null, '', next || window.location.pathname + window.location.search)
      } catch {
        /* ignore */
      }
    }
  }, [pathname])
  return null
}

function AppRoutes() {
  return (
    <>
      <ScrollReset />
      <Suspense fallback={<div className="fixed inset-0 bg-navy-deep" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/p/:slug" element={<Viewer />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function App() {
  const memory = import.meta.env.VITE_ROUTER === 'memory'
  const content = (
    <MotionConfig reducedMotion="user">
      <AppRoutes />
      {memory && <HashSync />}
    </MotionConfig>
  )
  if (memory) {
    const slug = window.location.hash.slice(1)
    const initial = slug && bySlug(slug) ? `/p/${slug}` : '/'
    return <MemoryRouter initialEntries={[initial]}>{content}</MemoryRouter>
  }
  // По умолчанию — HashRouter: работает на любом статическом хостинге (GitHub Pages и т. п.) без настройки сервера.
  // VITE_ROUTER=browser включает «чистые» адреса, если сервер отдаёт index.html на все пути.
  if (import.meta.env.VITE_ROUTER === 'browser') return <BrowserRouter basename={import.meta.env.VITE_BASE ?? '/'}>{content}</BrowserRouter>
  return <HashRouter>{content}</HashRouter>
}
