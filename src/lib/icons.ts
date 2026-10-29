import {
  Activity, AlertTriangle, Banknote, BadgeCheck, Binary, BookOpen, Bug, Building2, Camera, Cloud,
  CreditCard, DatabaseBackup, Download, Drama, Eye, EyeOff, FileLock2, FileWarning, Fingerprint, Fish,
  Gavel, Ghost, Globe, HardDrive, Hash, Key, KeyRound, Laptop, Layers, Lightbulb, Link, Lock, Mail,
  MapPin, MessageSquareWarning, MonitorSmartphone, Network, Phone, QrCode, Radar, RefreshCw, Router,
  Scale, ScanSearch, Server, ServerCrash, ShieldAlert, ShieldCheck, ShieldHalf, Siren, Skull, Smartphone,
  Sparkles, Target, Trash2, Usb, UserLock, UserX, Users, Wifi, Zap, Clock, Shuffle,
  Ban, Boxes, Braces, ClipboardCheck, Code, Container, Cookie, Database, FileCode, Filter, Gauge, GitBranch,
  ListChecks, Package, Plug, Route, ScrollText, SearchCode, Settings, Terminal, Timer, Upload, UserCheck, Webhook, Workflow,
  type LucideIcon,
} from 'lucide-react'

/** Реестр иконок: в данных презентаций иконки указываются строковым ключом */
export const icons = {
  activity: Activity, alert: AlertTriangle, money: Banknote, badge: BadgeCheck, binary: Binary,
  book: BookOpen, bug: Bug, building: Building2, camera: Camera, cloud: Cloud, card: CreditCard,
  backup: DatabaseBackup, download: Download, mask: Drama, eye: Eye, eyeOff: EyeOff, fileLock: FileLock2,
  fileWarn: FileWarning, fingerprint: Fingerprint, fish: Fish, gavel: Gavel, ghost: Ghost, globe: Globe,
  disk: HardDrive, hash: Hash, key: Key, keyRound: KeyRound, laptop: Laptop, layers: Layers,
  idea: Lightbulb, link: Link, lock: Lock, mail: Mail, pin: MapPin, msgWarn: MessageSquareWarning,
  devices: MonitorSmartphone, network: Network, phone: Phone, qr: QrCode, radar: Radar, refresh: RefreshCw,
  router: Router, scale: Scale, scan: ScanSearch, server: Server, crash: ServerCrash, shieldAlert: ShieldAlert,
  shield: ShieldCheck, shieldHalf: ShieldHalf, siren: Siren, skull: Skull, smartphone: Smartphone,
  sparkles: Sparkles, target: Target, trash: Trash2, usb: Usb, userLock: UserLock, userX: UserX,
  users: Users, wifi: Wifi, zap: Zap, clock: Clock, shuffle: Shuffle,
  ban: Ban, boxes: Boxes, braces: Braces, clipboard: ClipboardCheck, code: Code, container: Container, cookie: Cookie,
  database: Database, fileCode: FileCode, filter: Filter, gauge: Gauge, git: GitBranch, listChecks: ListChecks,
  package: Package, plug: Plug, route: Route, scroll: ScrollText, searchCode: SearchCode, settings: Settings,
  terminal: Terminal, timer: Timer, upload: Upload, userCheck: UserCheck, webhook: Webhook, workflow: Workflow,
} satisfies Record<string, LucideIcon>

export type IconKey = keyof typeof icons
