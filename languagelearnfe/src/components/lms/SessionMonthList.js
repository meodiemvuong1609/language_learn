import Link from 'next/link'
import { formatClock, formatDayHeading, groupSessionsByDate } from '@/lib/lms'

export default function SessionMonthList({ sessions, empty, teacher, onAttendance }) {
  const groups = groupSessionsByDate(sessions)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })

  if (!sessions?.length) return empty || null

  return (
    <div className="space-y-6">
      {groups.map(({ date, items }) => (
        <section key={date}>
          <div className="flex items-baseline gap-3 mb-2">
            <p
              className="font-plex text-[11px] tracking-[0.14em] uppercase"
              style={{ color: date === today ? 'var(--stamp)' : 'var(--moss)' }}
            >
              {date === today ? 'hôm nay' : date.split('-').reverse().join('/')}
            </p>
            <h3 className="text-base font-bold capitalize">{formatDayHeading(date)}</h3>
          </div>
          <ul className="space-y-2">
            {items.map((s) => (
              <li key={s.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{s.title || 'Buổi học'}</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {formatClock(s.starts_at)}–{formatClock(s.ends_at)} · {s.course_title} · {s.class_group_name}
                    {s.mode === 'one_on_one' ? ' · 1-1' : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  {s.meet_link && (
                    <a href={s.meet_link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                      Vào Meet
                    </a>
                  )}
                  {teacher && onAttendance && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => onAttendance(s)}>
                      Điểm danh
                    </button>
                  )}
                  {!onAttendance && s.class_group && (
                    <Link href={`/classes/${s.class_group}`} className="btn btn-secondary btn-sm">
                      Lớp
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
