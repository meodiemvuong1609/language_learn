import Head from 'next/head';
import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { pick, site, type Locale } from '@/content/site';
import CueCard from './CueCard';
import { LocaleProvider, useLocale } from './LocaleContext';

function Switcher() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="ll-switch" role="group" aria-label="Language">
      {(['vi', 'en'] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          className={locale === code ? 'is-on' : ''}
          onClick={() => setLocale(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Nav() {
  const { locale } = useLocale();
  const nav = site.nav[locale];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('ll-nav-locked', open);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('ll-nav-locked');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="ll-nav">
      <a href="#top" className="ll-logo" onClick={() => setOpen(false)}>
        <span className="ll-logo-mark">cue</span>
        <span className="ll-logo-text">{site.brand}</span>
      </a>
      <button
        type="button"
        className="ll-menu"
        aria-expanded={open}
        aria-controls="ll-nav-links"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (locale === 'vi' ? 'Đóng' : 'Close') : (locale === 'vi' ? 'Menu' : 'Menu')}
      </button>
      {open ? (
        <button
          type="button"
          className="ll-nav-scrim"
          aria-label={locale === 'vi' ? 'Đóng menu' : 'Close menu'}
          onClick={() => setOpen(false)}
        />
      ) : null}
      <nav id="ll-nav-links" className={open ? 'is-open' : ''} onClick={() => setOpen(false)}>
        <a href="#about">{nav.about}</a>
        <a href="#programs">{nav.programs}</a>
        <a href="#method">{nav.method}</a>
        <a href="#faq">{nav.faq}</a>
        <a href="#contact">{nav.contact}</a>
        <Link href="/login">{nav.login}</Link>
        <Switcher />
      </nav>
    </header>
  );
}

function Hero() {
  const { locale } = useLocale();
  const persona = site.persona[locale];
  const hero = site.hero[locale];

  return (
    <section className="ll-hero" id="top">
      <div className="ll-hero-copy ll-reveal">
        <p className="ll-eyebrow">{hero.eyebrow}</p>
        <h1>{persona.headline}</h1>
        <p className="ll-lead">{persona.lead}</p>
        <div className="ll-hero-actions">
          <a className="ll-btn ll-btn-stamp" href={site.contact.facebook} target="_blank" rel="noopener noreferrer">
            {hero.primaryCta}
          </a>
          <a className="ll-btn ll-btn-ghost" href={site.contact.zalo} target="_blank" rel="noopener noreferrer">
            {hero.secondaryCta}
          </a>
        </div>
        <ul className="ll-stats">
          {persona.stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <CueCard />
    </section>
  );
}

function About() {
  const { locale } = useLocale();
  const persona = site.persona[locale];
  const nav = site.nav[locale];

  return (
    <section className="ll-section" id="about">
      <div className="ll-section-head ll-reveal">
        <p className="ll-eyebrow">{nav.about}</p>
        <h2>
          {persona.name}
          <span className="ll-role"> {persona.role}</span>
        </h2>
      </div>
      <div className="ll-about">
        <div>
          <p className="ll-bio">{persona.bio}</p>
          <ul className="ll-creds">
            {persona.credentials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <figure className="ll-trf ll-reveal">
          <img
            src={site.proofImage.src}
            alt={site.proofImage.alt[locale]}
            width={720}
            height={420}
          />
          <figcaption>{site.proofImage.caption[locale]}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Programs() {
  const { locale } = useLocale();
  const programs = pick(site.programs, locale);
  const nav = site.nav[locale];

  return (
    <section className="ll-section" id="programs">
      <div className="ll-section-head ll-reveal">
        <p className="ll-eyebrow">{nav.programs}</p>
        <h2>{site.programsHead[locale]}</h2>
      </div>
      <div className="ll-program-grid">
        {programs.map((program) => (
          <article key={program.title} className="ll-program ll-reveal">
            <p className="ll-band">{program.band}</p>
            <h3>{program.title}</h3>
            <p className="ll-duration">{program.duration}</p>
            <p>{program.blurb}</p>
            <ul>
              {program.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Method() {
  const { locale } = useLocale();
  const method = site.method[locale];

  return (
    <section className="ll-section" id="method">
      <div className="ll-section-head ll-reveal">
        <p className="ll-eyebrow">{site.nav[locale].method}</p>
        <h2>{method.title}</h2>
        <p className="ll-lead">{method.lead}</p>
      </div>
      <ol className="ll-steps">
        {method.steps.map((step, index) => (
          <li key={step.title} className="ll-reveal">
            <span className="ll-step-idx">{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Proof() {
  const { locale } = useLocale();
  const proof = site.proof[locale];

  return (
    <section className="ll-section" id="proof">
      <div className="ll-section-head ll-reveal">
        <h2>{proof.title}</h2>
      </div>
      <div className="ll-quotes">
        {proof.items.map((item) => (
          <blockquote key={item.name} className="ll-reveal">
            <p>“{item.quote}”</p>
            <footer>{item.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const { locale } = useLocale();
  const items = pick(site.faq, locale);
  const [open, setOpen] = useState(0);

  return (
    <section className="ll-section" id="faq">
      <div className="ll-split">
        <div className="ll-section-head">
          <p className="ll-eyebrow">FAQ</p>
          <h2>{site.faqHead[locale]}</h2>
        </div>
        <div className="ll-faq">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.q} className="ll-faq-item">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  {item.q}
                </button>
                {isOpen ? <p>{item.a}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const { locale } = useLocale();
  const copy = site.contactCopy[locale];
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('7.0');
  const [message, setMessage] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    window.location.href = site.contact.phoneHref;
  };

  return (
    <section className="ll-section ll-contact" id="contact">
      <div className="ll-contact-card ll-reveal">
        <p className="ll-eyebrow">{site.nav[locale].contact}</p>
        <h2>{copy.title}</h2>
        <p className="ll-lead">{copy.lead}</p>
        <p className="ll-meta">
          {site.contact.city[locale]}
          <br />
          {site.contact.hours[locale]}
          <br />
          {site.contact.phone}
        </p>
        <p className="ll-social">
          <a href={site.contact.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <span aria-hidden>·</span>
          <a href={site.contact.zalo} target="_blank" rel="noopener noreferrer">
            Zalo
          </a>
        </p>
        <form className="ll-form" onSubmit={onSubmit}>
          <label>
            {copy.nameLabel}
            <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </label>
          <label>
            {copy.goalLabel}
            <input value={goal} onChange={(e) => setGoal(e.target.value)} />
          </label>
          <label className="ll-span">
            {copy.messageLabel}
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
          </label>
          <div className="ll-form-actions">
            <a className="ll-btn ll-btn-stamp" href={site.contact.facebook} target="_blank" rel="noopener noreferrer">
              {copy.facebook}
            </a>
            <a className="ll-btn ll-btn-ghost" href={site.contact.zalo} target="_blank" rel="noopener noreferrer">
              {copy.zalo}
            </a>
            <button type="submit" className="ll-btn ll-btn-ghost">
              {copy.submit}
            </button>
          </div>
        </form>
        <p className="ll-note">{copy.note}</p>
      </div>
    </section>
  );
}

function Seo() {
  const { locale } = useLocale();
  const seo = site.seo[locale];
  const persona = site.persona[locale];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: persona.name,
    jobTitle: persona.role,
    knowsLanguage: ['vi', 'en'],
    address: { '@type': 'PostalAddress', addressLocality: persona.location, addressCountry: 'VN' },
    telephone: site.contact.phoneHref,
    sameAs: [site.contact.facebook],
  };

  return (
    <Head>
      <title>{seo.title}</title>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <meta property="og:image" content={site.proofImage.src} />
      <meta name="description" content={seo.description} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={seo.ogLocale} />
      <meta property="og:locale:alternate" content={locale === 'vi' ? 'en_US' : 'vi_VN'} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Head>
  );
}

function LandingInner() {
  const { locale } = useLocale();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.ll-reveal'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      nodes.forEach((node) => node.classList.add('ll-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ll-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [locale]);

  return (
    <div className="ll-landing">
      <Seo />
      <Nav />
      <main>
        <Hero />
        <About />
        <Programs />
        <Method />
        <Proof />
        <Faq />
        <Contact />
      </main>
      <footer className="ll-footer">
        <span>{site.footer[locale]}</span>
        <span className="ll-footer-links">
          <a href={site.contact.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
          <a href={site.contact.zalo} target="_blank" rel="noopener noreferrer">
            Zalo
          </a>
          <a href={site.contact.phoneHref}>{site.contact.phone}</a>
        </span>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <LocaleProvider>
      <LandingInner />
    </LocaleProvider>
  );
}
