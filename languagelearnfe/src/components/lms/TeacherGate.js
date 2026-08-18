import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import LoadingIndicator from '@/components/LoadingIndicator'
import { isTeacher } from '@/lib/lms'

export default function TeacherGate({ children }) {
  const router = useRouter()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    if (user && !isTeacher(user)) {
      router.replace('/dashboard')
    }
  }, [user, router])

  if (!user || !isTeacher(user)) {
    return <LoadingIndicator message="Đang kiểm tra quyền cô giáo..." />
  }

  return children
}
