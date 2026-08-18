export const LEARNING_PREFIXES = [
  '/vocabulary',
  '/listening',
  '/speaking',
  '/flashcard',
  '/sentence',
  '/quizzes',
  '/reading',
]

export function isHiddenLearningPath(pathname) {
  return LEARNING_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
}

export function isTeacher(user) {
  return Boolean(user && (user.is_teacher || user.role === 'teacher'))
}

export function isPendingStudent(user) {
  return Boolean(user && !isTeacher(user) && user.status === 'pending')
}

export function listResults(payload) {
  if (!payload) return []
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload.results)) return payload.results
  if (Array.isArray(payload.data)) return payload.data
  return []
}

export function formatWhen(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDayHeading(isoOrKey) {
  const d = isoOrKey.length <= 10 ? new Date(`${isoOrKey}T00:00:00+07:00`) : new Date(isoOrKey)
  return d.toLocaleDateString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatClock(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function vnDateKey(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })
}

export function groupSessionsByDate(sessions) {
  const map = new Map()
  for (const session of sessions || []) {
    const key = vnDateKey(session.starts_at)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(session)
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({ date, items }))
}

export function currentMonthValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date)
  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  return `${year}-${month}`
}

export function shiftMonth(value, delta) {
  const [year, month] = value.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1 + delta, 1))
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function monthLabel(value) {
  const [year, month] = value.split('-').map(Number)
  return `Tháng ${String(month).padStart(2, '0')}/${year}`
}

export function toDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromDatetimeLocal(value) {
  if (!value) return null
  return new Date(value).toISOString()
}

export const ATTENDANCE_LABELS = {
  present: 'Có mặt',
  absent: 'Vắng',
  late: 'Muộn',
  excused: 'Có phép',
}

export const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  active: 'Đã duyệt',
  rejected: 'Từ chối',
}
