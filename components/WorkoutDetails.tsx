'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getWorkouts } from '@/lib/api';
import { useFitLog } from '@/context/FitLogContext';
import type { Workout } from '@/types/workout';

import './WorkoutDetails.css';

export default function WorkoutDetails() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToPlan, toggleSaved, isInPlan, isSaved, ready } = useFitLog();

  // Load workout details from API
  useEffect(() => {
    let active = true;

    async function loadWorkout() {
      setLoading(true);
      setError('');
      setWorkout(null);

      if (!Number.isInteger(id) || id <= 0) {
        setError('Invalid workout ID.');
        setLoading(false);
        return;
      }

      try {
        const workouts = await getWorkouts();

        if (!active) return;

        const found = workouts.find(item => Number(item.id) === id);

        if (found) {
          setWorkout(found);
        } else {
          setError('Workout not found.');
        }
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error ? err.message : 'Unable to load workout.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWorkout();

    return () => {
      active = false;
    };
  }, [id]);

  // Add workout to today's plan
  const handleAddToPlan = () => {
    if (!workout || !ready) return;

    const result = addToPlan(workout.id);

    if (result === 'added') {
      toast.success("Added to today's plan.", {
        description: workout.name,
        duration: 3000,
      });
    } else if (result === 'duplicate') {
      toast.warning('This workout is already in your plan.', {
        description: workout.name,
        duration: 3000,
      });
    } else {
      toast.error('Your plan is full.', {
        description: 'Maximum 5 workouts allowed.',
        duration: 4000,
      });
    }
  };

  // Save or remove workout from saved list
  const handleSave = () => {
    if (!workout || !ready) return;

    const wasSaved = isSaved(workout.id);

    toggleSaved(workout.id);

    if (wasSaved) {
      toast.success('Removed from saved workouts.', {
        description: workout.name,
        duration: 3000,
      });
    } else {
      toast.success('Saved for later.', {
        description: workout.name,
        duration: 3000,
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="details-state" aria-live="polite" aria-busy="true">
        <p>Loading workout...</p>
      </section>
    );
  }

  // Error or invalid workout state
  if (error || !workout) {
    return (
      <section className="details-state">
        <h2>{error || 'Workout not found.'}</h2>

        <Link href="/#library" className="details-back">
          ← Back to Workout Library
        </Link>
      </section>
    );
  }

  const alreadyInPlan = isInPlan(workout.id);
  const alreadySaved = isSaved(workout.id);

  return (
    <section className="workout-details">
      <div className="details-container">
        {/* Back to library */}
        <Link href="/#library" className="details-back">
          ← BACK TO LIBRARY
        </Link>

        <div className="details-grid">
          {/* Left side: Workout image */}
          <div className="details-image-wrap">
            <Image
              src={workout.image}
              alt={workout.name}
              width={900}
              height={1100}
              className="details-image"
              priority
              unoptimized
            />
          </div>

          {/* Right side: Workout information */}
          <div className="details-content">
            {/* Eyebrow */}
            <span className="details-eyebrow">WORKOUT DETAILS</span>

            {/* Workout title */}
            <h1>{workout.name}</h1>

            {/* Muscle group tags */}
            <div className="details-tags">
              {(workout.muscleGroups ?? []).map(muscle => (
                <span key={muscle}>{muscle}</span>
              ))}
            </div>

            {/* Description */}
            <p className="details-description">{workout.description}</p>

            {/* Workout specifications */}
            <div className="details-specs">
              <div className="details-spec-row">
                <span>Equipment</span>
                <strong>{workout.equipment}</strong>
              </div>

              <div className="details-spec-row">
                <span>Difficulty</span>
                <strong>{workout.difficulty}</strong>
              </div>

              <div className="details-spec-row">
                <span>Sets</span>
                <strong>{workout.sets}</strong>
              </div>

              <div className="details-spec-row">
                <span>Reps</span>
                <strong>{workout.reps}</strong>
              </div>

              <div className="details-spec-row">
                <span>Duration</span>
                <strong>{workout.duration} min</strong>
              </div>

              <div className="details-spec-row">
                <span>Calories</span>
                <strong>{workout.caloriesBurned} kcal</strong>
              </div>

              <div className="details-spec-row">
                <span>Rating</span>
                <strong className="details-rating">
                  <span>★</span> {workout.rating}
                </strong>
              </div>
            </div>

            {/* Workout instructions */}
            <div className="details-instructions">
              <h2>INSTRUCTIONS</h2>

              <ol>
                {(workout.instructions ?? []).map((instruction, index) => (
                  <li key={`${index}-${instruction}`}>{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Action buttons */}
            <div className="details-actions">
              {/* Add to today's plan */}
              <button
                type="button"
                className="details-add-btn"
                onClick={handleAddToPlan}
                disabled={!ready || alreadyInPlan}
              >
                {!ready
                  ? 'Loading...'
                  : alreadyInPlan
                    ? '✓ Added to today’s plan'
                    : '▣ Add to today’s plan'}
              </button>

              {/* Save for later */}
              <button
                type="button"
                className={`details-save-btn ${alreadySaved ? 'is-saved' : ''}`}
                onClick={handleSave}
                disabled={!ready}
                aria-pressed={alreadySaved}
              >
                {alreadySaved ? '♥ Saved' : '♡ Save for later'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
