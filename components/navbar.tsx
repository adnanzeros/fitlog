'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useFitLog } from '@/context/FitLogContext';
import './navbar.css';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const { planCount, savedCount, ready } = useFitLog();

  const closeMenu = () => setMenuOpen(false);

  const workoutActive = pathname === '/';
  const planActive = pathname === '/my-plan';

  const currentPlanCount = ready ? planCount : 0;
  const currentSavedCount = ready ? savedCount : 0;

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
            className={`nav-link ${workoutActive ? 'active' : ''}`}
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className={`nav-link ${planActive ? 'active' : ''}`}
          >
            My Plan
          </Link>
        </nav>

        {/* Desktop Badges */}
        <div className="navbar-badges">
          <Link
            href="/my-plan"
            className="nav-badge plan-badge"
            aria-label={`Today's Plan: ${currentPlanCount} workouts`}
          >
            Plan <span>{currentPlanCount}</span>
          </Link>

          <Link
            href="/my-plan"
            className="nav-badge saved-badge"
            aria-label={`Saved: ${currentSavedCount} workouts`}
          >
            Saved <span>{currentSavedCount}</span>
          </Link>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <button
          type="button"
          className={`mobile-menu-button ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile / Tablet Dropdown */}
      <div
        id="mobile-navigation"
        className={`mobile-menu ${menuOpen ? 'show' : ''}`}
      >
        <Link
          href="/"
          className={`mobile-nav-link ${workoutActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Workout
        </Link>

        <Link
          href="/my-plan"
          className={`mobile-nav-link ${planActive ? 'active' : ''}`}
          onClick={closeMenu}
        >
          My Plan
        </Link>

        <div className="mobile-badges">
          <Link
            href="/my-plan"
            className="nav-badge plan-badge"
            onClick={closeMenu}
            aria-label={`Today's Plan: ${currentPlanCount} workouts`}
          >
            Plan <span>{currentPlanCount}</span>
          </Link>

          <Link
            href="/my-plan"
            className="nav-badge saved-badge"
            onClick={closeMenu}
            aria-label={`Saved: ${currentSavedCount} workouts`}
          >
            Saved <span>{currentSavedCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
