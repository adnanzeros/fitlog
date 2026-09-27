'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { getWorkouts } from '@/lib/api';
import { useFitLog } from '@/context/FitLogContext';
import type { Workout } from '@/types/workout';

import '@/components/WorkoutDetails.css';

export default function WorkoutDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToPlan, toggleSaved, isInPlan, isSaved, ready } = useFitLog();

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

  const handleAddToPlan = () => {
    if (!workout || !ready) return;

    const result = addToPlan(workout.id);

    if (result === 'added') {
      toast.success("Added to today's plan.", {
        description: workout.name,
      });
    } else if (result === 'duplicate') {
      toast.warning('Already in your plan.', {
        description: workout.name,
      });
    } else {
      toast.error('Your plan is full.', {
        description: 'Maximum 5 workouts allowed.',
      });
    }
  };

  const handleSave = () => {
    if (!workout || !ready) return;

    const wasSaved = isSaved(workout.id);
    toggleSaved(workout.id);

    if (wasSaved) {
      toast.success('Removed from saved workouts.', {
        description: workout.name,
      });
    } else {
      toast.success('Saved for later.', {
        description: workout.name,
      });
    }
  };

  if (loading) {
    return (
      <section className="details-state">
        <p>Loading workout...</p>
      </section>
    );
  }

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

  return (
    <section className="workout-details">
      <div className="details-container">
        <Link href="/#library" className="details-back">
          ← BACK TO LIBRARY
        </Link>

        <div className="details-grid">
          {/* Workout Image */}
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

          {/* Workout Information */}
          <div className="details-content">
            <span className="details-eyebrow">WORKOUT DETAILS</span>

            <h1>{workout.name}</h1>

            <div className="details-tags">
              {workout.muscleGroups.map(muscle => (
                <span key={muscle}>{muscle}</span>
              ))}
            </div>

            <p className="details-description">{workout.description}</p>

            {/* Workout Specs */}
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

            {/* Instructions */}
            <div className="details-instructions">
              <h2>INSTRUCTIONS</h2>

              <ol>
                {workout.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Actions */}
            <div className="details-actions">
              <button
                type="button"
                className="details-add-btn"
                onClick={handleAddToPlan}
                disabled={!ready || isInPlan(workout.id)}
              >
                {!ready
                  ? 'Loading...'
                  : isInPlan(workout.id)
                    ? '✓ Added to today’s plan'
                    : '＋ Add to today’s plan'}
              </button>

              <button
                type="button"
                className={`details-save-btn ${
                  isSaved(workout.id) ? 'is-saved' : ''
                }`}
                onClick={handleSave}
                disabled={!ready}
              >
                {isSaved(workout.id) ? '♥ Saved' : '♡ Save for later'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
