import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/authSlice'
import { api } from '@/services/api'

export function useLogout() {
  const router = useRouter()
  const dispatch = useDispatch()

  return async () => {
    try {
      await api.logout()
    } catch {
      /* still clear local session */
    }
    dispatch(logout())
    router.push('/login')
  }
}
