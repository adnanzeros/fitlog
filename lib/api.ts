import type { Workout } from '@/types/workout';

const API_URL = 'https://api.abcz.workers.dev/api/fitlog';

// Fetch all workouts
export async function getWorkouts(): Promise<Workout[]> {
  const response = await fetch(API_URL, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch workouts. Status: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid API response: expected an array');
  }

  return data as Workout[];
}

// Find one workout by ID from all workout data
export async function getWorkoutById(
  id: number | string,
): Promise<Workout | undefined> {
  const workoutId = Number(id);

  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    return undefined;
  }

  const workouts = await getWorkouts();

  return workouts.find(workout => Number(workout.id) === workoutId);
}

// Optional: safely fetch workouts without crashing the page
export async function getWorkoutsSafe(): Promise<{
  workouts: Workout[];
  error: string | null;
}> {
  try {
    const workouts = await getWorkouts();

    return {
      workouts,
      error: null,
    };
  } catch (error) {
    return {
      workouts: [],
      error:
        error instanceof Error
          ? error.message
          : 'Something went wrong while loading workouts.',
    };
  }
}
