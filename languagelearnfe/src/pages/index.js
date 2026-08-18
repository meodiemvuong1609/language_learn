import LandingPage from '@/components/landing/LandingPage';

export default function RootPage() {
  return <LandingPage />;
}

RootPage.getLayout = (page) => page;
