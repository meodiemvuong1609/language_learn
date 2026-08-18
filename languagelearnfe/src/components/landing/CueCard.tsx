import { useState } from 'react';
import { site } from '@/content/site';
import { useLocale } from './LocaleContext';

export default function CueCard() {
  const { locale } = useLocale();
  const [flipped, setFlipped] = useState(false);
  const copy = site.hero[locale];
  const card = site.cueCard;

  return (
    <div className="ll-cue-stage">
      <button
        type="button"
        className={`ll-cue ${flipped ? 'is-flipped' : ''}`}
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={copy.flipHint}
      >
        <span className="ll-cue-face ll-cue-front">
          <span className="ll-cue-meta">
            <span className="ll-cue-part">{card.part}</span>
            <span className="ll-cue-time">{card.time}</span>
          </span>
          <span className="ll-cue-prompt">{card.prompt}</span>
          <span className="ll-cue-say">{card.youShouldSay}</span>
          <ul className="ll-cue-bullets">
            {card.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className="ll-cue-explain">{card.explain}</span>
          <span className="ll-cue-hint">{copy.flipHint}</span>
        </span>
        <span className="ll-cue-face ll-cue-back">
          <span className="ll-cue-part">{card.backTitle}</span>
          <span className="ll-cue-back-body">{card.backBody}</span>
          <span className="ll-stamp" aria-hidden>
            {site.band}
          </span>
        </span>
      </button>
      <p className="ll-cue-caption">{copy.caption}</p>
    </div>
  );
}
