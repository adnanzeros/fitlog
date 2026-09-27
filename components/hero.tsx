import Image from 'next/image';
import Link from 'next/link';
import './hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>
            <span>WORKOUT LIBRARY</span>
          </div>

          <h1 className="hero-title">
            TRAIN WITH INTENT.
            <br />
            LOG EVERY SET.
          </h1>

          <p className="hero-description">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          {/* Browse Workout Library */}
          <Link href="/#library" className="hero-button">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6.5 6.5 11 11" />
              <path d="m21 21-4.35-4.35" />
              <path d="M3 3l4.35 4.35" />
              <path d="M3 21l6-6" />
              <path d="M21 3l-6 6" />
              <path d="M6.5 6.5 3 10" />
              <path d="M17.5 17.5 21 14" />
              <path d="m14 3 7 7" />
              <path d="m3 14 7 7" />
            </svg>

            <span>BROWSE WORKOUTS</span>
            <span className="hero-arrow">→</span>
          </Link>
        </div>

        {/* Right Image */}
        <div className="hero-image-wrapper">
          <div className="hero-image-glow"></div>

          <Image
            src="/images/banner.png"
            alt="Athlete training with dumbbells"
            width={520}
            height={460}
            priority
            className="hero-athlete"
            sizes="(max-width: 480px) 100vw, (max-width: 990px) 90vw, 50vw"
          />

          <div className="hero-image-label">
            <span className="hero-label-dot"></span>
            BUILT FOR CONSISTENCY
          </div>
        </div>
      </div>
    </section>
  );
}
