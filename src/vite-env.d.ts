/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_ROUTER?: 'hash' | 'browser' | 'memory'
  readonly VITE_BASE?: string
}
