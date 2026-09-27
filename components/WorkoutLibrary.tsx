import Link from 'next/link';
import { getWorkoutsSafe } from '@/lib/api';
import './WorkoutLibrary.css';

export default async function WorkoutLibrary() {
  const { workouts, error } = await getWorkoutsSafe();

  return (
    <section className="workout-library" id="library">
      <div className="library-container">
        <div className="library-header">
          <div>
            <span className="library-eyebrow">THE LIBRARY</span>
            <h2>Find Your Next Workout</h2>
            <p>Twelve lifts covering every major muscle group.</p>
          </div>

          <span className="library-count">{workouts.length} WORKOUTS</span>
        </div>

        {error ? (
          <div className="library-message">
            <h3>Unable to load workouts</h3>
            <p>{error}</p>
            <p>Please refresh the page and try again.</p>
          </div>
        ) : workouts.length === 0 ? (
          <div className="library-message">
            <h3>No workouts found</h3>
            <p>There are no workouts available right now.</p>
          </div>
        ) : (
          <div className="workout-grid">
            {workouts.map(workout => (
              <Link
                href={`/workout/${workout.id}`}
                className="workout-card"
                key={workout.id}
              >
                <div className="workout-image-wrap">
                  <img
                    src={workout.image}
                    alt={workout.name}
                    className="workout-image"
                  />
                  <span className="workout-difficulty">
                    {workout.difficulty}
                  </span>
                </div>

                <div className="workout-card-content">
                  <div className="workout-muscles">
                    {workout.muscleGroups.slice(0, 3).map(muscle => (
                      <span key={muscle}>{muscle}</span>
                    ))}
                  </div>

                  <h3>{workout.name}</h3>
                  <p className="workout-equipment">{workout.equipment}</p>

                  <div className="workout-stats">
                    <span>
                      <span className="stat-icon">◷</span>
                      {workout.duration} min
                    </span>

                    <span>
                      <span className="stat-icon">↗</span>
                      {workout.caloriesBurned} kcal
                    </span>

                    <span className="workout-rating">
                      <span className="stat-icon">★</span>
                      {workout.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
