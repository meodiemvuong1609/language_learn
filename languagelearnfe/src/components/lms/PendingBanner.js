import Link from 'next/link'

export default function PendingBanner() {
  return (
    <div className="border p-5 mb-6" style={{ background: 'var(--cue)', borderColor: 'var(--ink)' }}>
      <p className="font-plex text-[11px] tracking-[0.14em] uppercase mb-2" style={{ color: 'var(--stamp)' }}>
        chờ duyệt
      </p>
      <h2 className="text-xl font-bold mb-2">Tài khoản đang chờ cô Ngọc Thảo duyệt</h2>
      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Bạn đã đăng ký thành công. Khi được duyệt, lịch học và khóa học sẽ hiện ở đây.
        Liên hệ Zalo 0866 062 701 nếu cần gấp.
      </p>
      <Link href="/" className="inline-block mt-3 text-sm" style={{ color: 'var(--moss)' }}>
        Về trang giới thiệu
      </Link>
    </div>
  )
}
