'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type AddToPlanResult = 'added' | 'duplicate' | 'limit' | 'invalid';

type FitLogContextType = {
  plan: number[];
  saved: number[];
  done: number[];
  planCount: number;
  savedCount: number;
  ready: boolean;
  addToPlan: (id: number) => AddToPlanResult;
  removeFromPlan: (id: number) => void;
  toggleSaved: (id: number) => void;
  markAsDone: (id: number) => void;
  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
};

const FitLogContext = createContext<FitLogContextType | undefined>(undefined);

const PLAN_KEY = 'fitlog-plan';
const SAVED_KEY = 'fitlog-saved';
const DONE_KEY = 'fitlog-done';
const PLAN_LIMIT = 5;

// Read and validate IDs from LocalStorage
function readIds(key: string): number[] {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) return [];

    return [
      ...new Set(
        parsed.filter(
          (id): id is number =>
            typeof id === 'number' && Number.isInteger(id) && id > 0,
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function FitLogProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  // Load saved data once after the component mounts
  useEffect(() => {
    const storedPlan = readIds(PLAN_KEY).slice(0, PLAN_LIMIT);
    const storedSaved = readIds(SAVED_KEY);
    const storedDone = readIds(DONE_KEY);

    setPlan(storedPlan);
    setSaved(storedSaved);

    // Keep completed IDs that are still in today's plan
    setDone(storedDone.filter(id => storedPlan.includes(id)));

    setReady(true);
  }, []);

  // Persist data after initialization
  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
      localStorage.setItem(DONE_KEY, JSON.stringify(done));
    } catch (error) {
      console.error('FitLog storage save error:', error);
    }
  }, [plan, saved, done, ready]);

  // Add a workout to today's plan
  const addToPlan = (id: number): AddToPlanResult => {
    if (!Number.isInteger(id) || id <= 0) {
      return 'invalid';
    }

    if (plan.includes(id)) {
      return 'duplicate';
    }

    if (plan.length >= PLAN_LIMIT) {
      return 'limit';
    }

    setPlan(current => {
      if (current.includes(id) || current.length >= PLAN_LIMIT) {
        return current;
      }

      return [...current, id];
    });

    return 'added';
  };

  // Remove a workout from today's plan and its completed list
  const removeFromPlan = (id: number) => {
    if (!Number.isInteger(id) || id <= 0) return;

    setPlan(current => current.filter(item => item !== id));

    setDone(current => current.filter(item => item !== id));
  };

  // Add or remove a workout from saved list
  const toggleSaved = (id: number) => {
    if (!Number.isInteger(id) || id <= 0) return;

    setSaved(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id],
    );
  };

  // Mark a workout as completed without toggling it off
  const markAsDone = (id: number) => {
    if (!Number.isInteger(id) || id <= 0) return;

    if (!plan.includes(id)) return;

    setDone(current => (current.includes(id) ? current : [...current, id]));
  };

  // Check whether a workout is already in today's plan
  const isInPlan = (id: number) => {
    return plan.includes(id);
  };

  // Check whether a workout is saved
  const isSaved = (id: number) => {
    return saved.includes(id);
  };

  return (
    <FitLogContext.Provider
      value={{
        plan,
        saved,
        done,
        planCount: plan.length,
        savedCount: saved.length,
        ready,
        addToPlan,
        removeFromPlan,
        toggleSaved,
        markAsDone,
        isInPlan,
        isSaved,
      }}
    >
      {children}
    </FitLogContext.Provider>
  );
}

// Custom hook to access FitLog context
export function useFitLog() {
  const context = useContext(FitLogContext);

  if (!context) {
    throw new Error('useFitLog must be used inside FitLogProvider');
  }

  return context;
}
