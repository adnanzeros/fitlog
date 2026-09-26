'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import './navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo + Brand */}
        <Link href="/" className="navbar-logo" onClick={closeMenu}>
          <Image
            src="/images/logo.png"
            alt="FitLog logo"
            width={22}
            height={22}
            priority
          />
          <span>FITLOG</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-menu">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className={`nav-link ${pathname === '/my-plan' ? 'active' : ''}`}
          >
            My Plan
          </Link>
        </nav>

        {/* Desktop Badges */}
        <div className="navbar-badges">
          <Link href="/my-plan" className="nav-badge plan-badge">
            Plan <span>0</span>
          </Link>

          <Link href="/saved" className="nav-badge saved-badge">
            Saved <span>0</span>
          </Link>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          type="button"
          className={`mobile-menu-button ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile / Tablet Dropdown */}
      <div className={`mobile-menu ${menuOpen ? 'show' : ''}`}>
        <Link
          href="/"
          className={`mobile-nav-link ${pathname === '/' ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Workout
        </Link>

        <Link
          href="/my-plan"
          className={`mobile-nav-link ${
            pathname === '/my-plan' ? 'active' : ''
          }`}
          onClick={closeMenu}
        >
          My Plan
        </Link>

        <div className="mobile-badges">
          <Link
            href="/my-plan"
            className="nav-badge plan-badge"
            onClick={closeMenu}
          >
            Plan <span>0</span>
          </Link>

          <Link
            href="/saved"
            className="nav-badge saved-badge"
            onClick={closeMenu}
          >
            Saved <span>0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
