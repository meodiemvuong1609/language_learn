import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { getMe, setToken } from '@/store/authSlice';
import LoadingIndicator from './LoadingIndicator';

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);
  const userRef = useRef(user);
  userRef.current = user;

  // `ready` gates rendering until the client has verified the cookie. It is
  // always false during SSR/prerender, so we never touch `router` in render
  // (which has no router instance on the server).
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const cookieToken = Cookies.get('token') || null;

    if (!cookieToken) {
      router.replace('/login');
      return;
    }

    // Sync redux with the cookie so data-fetching pages relying on
    // state.auth.token work after a hard reload.
    dispatch(setToken(cookieToken));

    if (!userRef.current) {
      dispatch(getMe())
        .unwrap()
        .catch(() => {
          Cookies.remove('token');
          router.replace('/login');
        });
    }

    setReady(true);
  }, [dispatch, router]);

  if (!ready) {
    return <LoadingIndicator message="Đang kiểm tra đăng nhập..." />;
  }

  return children;
}
