import { useEffect, useMemo, useState } from 'react'
import { Modal } from '@/components/ui'

export default function EnrollStudentsModal({
  open,
  onClose,
  students = [],
  enrolledIds = [],
  onSubmit,
  submitting = false,
}) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(() => new Set())

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(new Set())
    }
  }, [open])

  const enrolled = useMemo(() => new Set(enrolledIds.map(String)), [enrolledIds])

  const available = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students.filter((s) => {
      if (enrolled.has(String(s.id))) return false
      if (!q) return true
      const hay = `${s.full_name || ''} ${s.username || ''} ${s.email || ''} ${s.phone || ''}`.toLowerCase()
      return hay.includes(q)
    })
  }, [students, enrolled, query])

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      const key = String(id)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleAll = () => {
    const ids = available.map((s) => String(s.id))
    const allOn = ids.length > 0 && ids.every((id) => selected.has(id))
    setSelected(allOn ? new Set() : new Set(ids))
  }

  const handleClose = () => {
    setQuery('')
    setSelected(new Set())
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ids = [...selected].map(Number)
    if (ids.length === 0) return
    await onSubmit(ids)
    setSelected(new Set())
    setQuery('')
  }

  return (
    <Modal open={open} onClose={handleClose} title="Xếp học sinh vào lớp" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input"
          placeholder="Tìm theo tên, tài khoản, email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={toggleAll} style={{ color: 'var(--moss)' }}>
            {available.length > 0 && available.every((s) => selected.has(String(s.id)))
              ? 'Bỏ chọn tất cả'
              : 'Chọn tất cả danh sách'}
          </button>
          <span style={{ color: 'var(--muted)' }}>Đã chọn {selected.size}</span>
        </div>
        <div className="border max-h-72 overflow-y-auto" style={{ borderColor: 'var(--line)' }}>
          {available.length === 0 ? (
            <p className="p-4 text-sm" style={{ color: 'var(--muted)' }}>
              Không còn học sinh phù hợp (đã xếp hết hoặc không khớp tìm kiếm).
            </p>
          ) : (
            <ul>
              {available.map((s) => {
                const checked = selected.has(String(s.id))
                return (
                  <li key={s.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--line)' }}>
                    <label className="flex items-start gap-3 p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={checked}
                        onChange={() => toggle(s.id)}
                      />
                      <span>
                        <span className="block font-medium">{s.full_name || s.username}</span>
                        <span className="block text-xs" style={{ color: 'var(--muted)' }}>
                          @{s.username}{s.email ? ` · ${s.email}` : ''}{s.phone ? ` · ${s.phone}` : ''}
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={submitting || selected.size === 0}>
          {submitting ? 'Đang xếp...' : `Xếp ${selected.size || ''} học sinh`}
        </button>
      </form>
    </Modal>
  )
}
