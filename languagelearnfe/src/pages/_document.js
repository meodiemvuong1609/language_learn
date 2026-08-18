import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="vi">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&family=Literata:opsz,wght@7..72,600;7..72,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/apple-touch-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#152238" />
        <meta name="application-name" content="Ngọc Thảo IELTS" />
        <meta property="og:site_name" content="Ngọc Thảo IELTS" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ngocthaoielts.online/" />
        <meta
          property="og:title"
          content="Ngọc Thảo IELTS — Giáo viên IELTS Academic 8.0, dạy online"
        />
        <meta
          property="og:description"
          content="Cô Ngọc Thảo, IELTS Academic 8.0 (CEFR C1). Luyện 1-1 và nhóm nhỏ cho học sinh THPT và sinh viên, dạy online từ Thanh Hóa. Liên hệ Facebook hoặc Zalo 0866 062 701."
        />
        <meta property="og:image" content="https://ngocthaoielts.online/og-image.png" />
        <meta property="og:image:secure_url" content="https://ngocthaoielts.online/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Ngọc Thảo IELTS — giáo viên IELTS Academic 8.0, dạy online từ Thanh Hóa"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Ngọc Thảo IELTS — Giáo viên IELTS Academic 8.0, dạy online"
        />
        <meta
          name="twitter:description"
          content="Cô Ngọc Thảo, IELTS Academic 8.0 (CEFR C1). Luyện 1-1 và nhóm nhỏ cho học sinh THPT và sinh viên, dạy online từ Thanh Hóa."
        />
        <meta name="twitter:image" content="https://ngocthaoielts.online/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
