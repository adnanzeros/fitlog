'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

import { getWorkoutsSafe } from '@/lib/api';
import { useFitLog } from '@/context/FitLogContext';
import type { Workout } from '@/types/workout';

import SortDropdown, { type SortOption } from '@/components/SortDropdown';

import './MyPlan.css';

type Tab = 'plan' | 'saved';

export default function MyPlan() {
  const { plan, saved, done, ready, removeFromPlan, markAsDone, toggleSaved } =
    useFitLog();

  const [activeTab, setActiveTab] = useState<Tab>('plan');
  const [sortBy, setSortBy] = useState<SortOption>('duration');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load workout data
  useEffect(() => {
    let active = true;

    async function loadWorkouts() {
      setLoading(true);
      setError(null);

      try {
        const result = await getWorkoutsSafe();

        if (!active) return;

        setWorkouts(result.workouts);
        setError(result.error);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error ? err.message : 'Unable to load workouts.',
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();

    return () => {
      active = false;
    };
  }, []);

  // Create a lookup map for workout IDs
  const workoutMap = useMemo(
    () => new Map(workouts.map(workout => [Number(workout.id), workout])),
    [workouts],
  );

  // Select IDs according to the active tab
  const currentIds = activeTab === 'plan' ? plan : saved;

  // Resolve IDs into workout objects
  const currentWorkouts = currentIds
    .map(id => workoutMap.get(Number(id)))
    .filter((workout): workout is Workout => Boolean(workout));

  // Sort workouts without mutating the original list
  const sortedWorkouts = useMemo(() => {
    return [...currentWorkouts].sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          // Shortest duration first
          return Number(a.duration || 0) - Number(b.duration || 0);

        case 'calories':
          // Highest calories first
          return Number(b.caloriesBurned || 0) - Number(a.caloriesBurned || 0);

        case 'rating':
          // Highest rating first
          return Number(b.rating || 0) - Number(a.rating || 0);

        default:
          return 0;
      }
    });
  }, [currentWorkouts, sortBy]);

  // Today's Plan metrics
  const planWorkouts = plan
    .map(id => workoutMap.get(Number(id)))
    .filter((workout): workout is Workout => Boolean(workout));

  const totalMinutes = planWorkouts.reduce(
    (total, workout) => total + Number(workout.duration || 0),
    0,
  );

  const totalCalories = planWorkouts.reduce(
    (total, workout) => total + Number(workout.caloriesBurned || 0),
    0,
  );

  // Mark a plan workout as completed
  const handleMarkAsDone = (workout: Workout) => {
    if (!ready) return;

    if (done.some(id => Number(id) === Number(workout.id))) {
      toast.info('Workout already completed.', {
        description: workout.name,
      });
      return;
    }

    markAsDone(workout.id);

    toast.success('Workout marked as done!', {
      description: workout.name,
    });
  };

  // Remove from the currently selected list
  const handleRemove = (workout: Workout) => {
    if (!ready) return;

    if (activeTab === 'plan') {
      removeFromPlan(workout.id);

      toast.success('Workout removed from today’s plan.', {
        description: workout.name,
      });
    } else {
      toggleSaved(workout.id);

      toast.success('Workout removed from saved list.', {
        description: workout.name,
      });
    }
  };

  // Loading state
  if (!ready || loading) {
    return (
      <section className="my-plan-page">
        <div className="my-plan-container">
          <p className="my-plan-loading">Loading workouts…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="my-plan-page">
      <div className="my-plan-container">
        {/* Header */}
        <header className="my-plan-header">
          <div>
            <p className="my-plan-eyebrow">YOUR WORKOUTS</p>

            <h1>
              MY <span>PLAN</span>
            </h1>

            <p className="my-plan-subtitle">
              Cap of five lifts for today. Finish them, then load more.
            </p>
          </div>

          <Link href="/#library" className="my-plan-browse">
            + Browse workouts
          </Link>
        </header>

        {/* Metrics */}
        <div className="my-plan-metrics">
          <div className="my-plan-metric">
            <span className="metric-icon">▦</span>
            <div>
              <strong>
                {plan.length}
                <small> / 5</small>
              </strong>
              <span>Exercises</span>
            </div>
          </div>

          <div className="my-plan-metric">
            <span className="metric-icon">◷</span>
            <div>
              <strong>
                {totalMinutes}
                <small> min</small>
              </strong>
              <span>Minutes</span>
            </div>
          </div>

          <div className="my-plan-metric">
            <span className="metric-icon">♨</span>
            <div>
              <strong>
                {totalCalories}
                <small> kcal</small>
              </strong>
              <span>Calories</span>
            </div>
          </div>
        </div>

        {/* Tabs and Sort Dropdown */}
        <div className="my-plan-toolbar">
          <div
            className="my-plan-tabs"
            role="tablist"
            aria-label="Workout lists"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'plan'}
              className={activeTab === 'plan' ? 'active' : ''}
              onClick={() => setActiveTab('plan')}
            >
              Today&apos;s Plan <span>{plan.length}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'saved'}
              className={activeTab === 'saved' ? 'active' : ''}
              onClick={() => setActiveTab('saved')}
            >
              Saved <span>{saved.length}</span>
            </button>
          </div>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {/* API Error */}
        {error && (
          <div className="my-plan-error" role="alert">
            Could not load workouts. {error}
          </div>
        )}

        {/* Empty State */}
        {sortedWorkouts.length === 0 ? (
          <div className="my-plan-empty">
            <div className="empty-symbol">＋</div>

            <p className="my-plan-eyebrow">NOTHING HERE YET</p>

            <h2>
              {activeTab === 'plan'
                ? 'Your plan is waiting.'
                : 'No saved workouts yet.'}
            </h2>

            <p>
              {activeTab === 'plan'
                ? 'Browse the library and add a lift to get today moving.'
                : 'Save workouts from the library to find them here later.'}
            </p>

            <Link href="/#library" className="my-plan-empty-button">
              Go to workouts <span>↗</span>
            </Link>
          </div>
        ) : (
          /* Workout List */
          <div className="my-plan-list">
            {sortedWorkouts.map(workout => {
              const isDone = done.some(id => Number(id) === Number(workout.id));

              const isPlanTab = activeTab === 'plan';

              return (
                <article className="my-plan-card" key={workout.id}>
                  {/* Workout Image */}
                  <div className="my-plan-card-image">
                    <img
                      src={workout.image}
                      alt={workout.name}
                      loading="lazy"
                    />
                  </div>

                  {/* Workout Information */}
                  <div className="my-plan-card-content">
                    <p className="my-plan-card-category">
                      {workout.muscleGroups?.join(' / ')}
                    </p>

                    <h2>{workout.name}</h2>

                    <p className="my-plan-card-equipment">
                      {workout.equipment}
                    </p>

                    {/* Workout Stats */}
                    <div className="my-plan-card-stats">
                      <span>◷ {workout.duration} min</span>

                      <span>♨ {workout.caloriesBurned} kcal</span>

                      <span>★ {workout.rating}</span>
                    </div>

                    {/* Actions */}
                    <div className="my-plan-card-actions">
                      <Link
                        href={`/workout/${workout.id}`}
                        className="my-plan-details"
                      >
                        View Details <span>↗</span>
                      </Link>

                      {isPlanTab && (
                        <button
                          type="button"
                          className={`my-plan-done ${
                            isDone ? 'completed' : ''
                          }`}
                          onClick={() => handleMarkAsDone(workout)}
                          disabled={!ready || isDone}
                          aria-label={
                            isDone
                              ? `${workout.name} completed`
                              : `Mark ${workout.name} as done`
                          }
                        >
                          {isDone ? '✓ Completed' : '✓ Mark as Done'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Remove Button - shown on both tabs */}
                  <button
                    type="button"
                    className="my-plan-remove"
                    aria-label={
                      isPlanTab
                        ? `Remove ${workout.name} from plan`
                        : `Remove ${workout.name} from saved`
                    }
                    title={isPlanTab ? 'Remove from plan' : 'Remove from saved'}
                    onClick={() => handleRemove(workout)}
                    disabled={!ready}
                  >
                    ×
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
