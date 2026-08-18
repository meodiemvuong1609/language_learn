import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import LoadingIndicator from '@/components/LoadingIndicator';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return <LoadingIndicator message="Đang chuyển hướng..." />;
}

RootPage.layout = Layout;
