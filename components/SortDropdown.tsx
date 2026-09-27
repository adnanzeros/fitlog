'use client';

import './SortDropdown.css';

export type SortOption = 'duration' | 'calories' | 'rating';

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="sort-dropdown">
      <label htmlFor="my-plan-sort">Sort By</label>

      <div className="sort-dropdown-select-wrap">
        <select
          id="my-plan-sort"
          className="sort-dropdown-select"
          value={value}
          onChange={event => onChange(event.target.value as SortOption)}
          aria-label="Sort workouts by"
        >
          <option value="duration">Duration</option>
          <option value="calories">Calories</option>
          <option value="rating">Rating</option>
        </select>

        <span className="sort-dropdown-arrow" aria-hidden="true">
          ▾
        </span>
      </div>
    </div>
  );
}
