import Image from 'next/image';
import Link from 'next/link';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + Brand */}
        <Link href="/" className="footer-brand">
          <Image
            src="/images/logo.png"
            alt="FitLog logo"
            width={18}
            height={18}
          />
          <span>FITLOG</span>
        </Link>

        {/* Copyright */}
        <p className="footer-copyright">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
