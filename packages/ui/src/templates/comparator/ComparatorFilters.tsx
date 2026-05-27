// The filter body used by both the desktop sticky sidebar and the mobile
// bottom-sheet. `idPrefix` keeps form ids unique between the two render
// locations (so a label `for=` only resolves to its own input).

import type { Dispatch, SetStateAction } from 'react';
import { Chip } from '../../primitives/Chip';
import { ToggleSwitch } from '../../primitives/ToggleSwitch';
import { GOALS, GRADES } from './constants';
import type { Goal, Grade } from './constants';

export interface ComparatorFiltersProps {
  /** Unique prefix for form element ids (e.g. 'd' for desktop, 'm' for mobile). */
  idPrefix: 'd' | 'm';
  bestFor: Goal;
  setBestFor: Dispatch<SetStateAction<Goal>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  grade: Grade;
  setGrade: Dispatch<SetStateAction<Grade>>;
  caffeineFreeOnly: boolean;
  setCaffeineFreeOnly: Dispatch<SetStateAction<boolean>>;
  euCompliantOnly: boolean;
  setEuCompliantOnly: Dispatch<SetStateAction<boolean>>;
  handsOnOnly: boolean;
  setHandsOnOnly: Dispatch<SetStateAction<boolean>>;
  showCommission: boolean;
  setShowCommission: Dispatch<SetStateAction<boolean>>;
  onReset: () => void;
}

export function ComparatorFilters({
  idPrefix,
  bestFor,
  setBestFor,
  maxPrice,
  setMaxPrice,
  grade,
  setGrade,
  caffeineFreeOnly,
  setCaffeineFreeOnly,
  euCompliantOnly,
  setEuCompliantOnly,
  handsOnOnly,
  setHandsOnOnly,
  showCommission,
  setShowCommission,
  onReset,
}: ComparatorFiltersProps) {
  return (
    <>
      <div className="text-[11px] uppercase tracking-[0.14em] text-ds-muted font-semibold mb-3">
        Filters
      </div>
      <div className="mb-[22px]">
        <div className="text-[12px] font-semibold mb-2 text-ds-ink">Goal</div>
        <div role="group" aria-label="Filter by goal" className="flex flex-wrap gap-[6px]">
          {GOALS.map((g) => (
            <Chip key={g} active={bestFor === g} onClick={() => setBestFor(g)}>
              {g}
            </Chip>
          ))}
        </div>
      </div>
      <div className="mb-[22px]">
        <div className="flex justify-between mb-2">
          <label htmlFor={`${idPrefix}-max-price`} className="text-[12px] font-semibold text-ds-ink">
            Max $/month
          </label>
          <span className="text-[12px] font-bold text-ds-accent ds-tabular">${maxPrice}</span>
        </div>
        <input
          id={`${idPrefix}-max-price`}
          type="range"
          min={20}
          max={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: 'var(--color-ds-accent)' }}
        />
        <div className="flex justify-between text-[10px] text-ds-muted mt-[2px] ds-tabular">
          <span>$20</span>
          <span>$100</span>
        </div>
      </div>
      <fieldset className="mb-[22px] m-0 p-0 border-0">
        <legend className="text-[12px] font-semibold mb-2 text-ds-ink">Our grade</legend>
        <div className="flex flex-col gap-1">
          {GRADES.map(({ id, tone }) => {
            const dotClass =
              tone === 'good'
                ? 'bg-ds-good'
                : tone === 'warn'
                  ? 'bg-ds-warn'
                  : tone === 'bad'
                    ? 'bg-ds-bad'
                    : '';
            return (
              <label key={id} className="flex gap-2 items-center cursor-pointer py-1">
                <input
                  type="radio"
                  name={`${idPrefix}-grade`}
                  checked={grade === id}
                  onChange={() => setGrade(id)}
                  style={{ accentColor: 'var(--color-ds-accent)' }}
                />
                {dotClass && <span aria-hidden="true" className={`w-2 h-2 rounded-full ${dotClass}`} />}
                <span className="text-[13px] text-ds-ink">{id}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="mb-[22px] pt-[14px] border-t border-ds-border flex flex-col gap-[14px]">
        <ToggleSwitch checked={caffeineFreeOnly} onChange={setCaffeineFreeOnly} label="Caffeine-free only" />
        <ToggleSwitch checked={euCompliantOnly} onChange={setEuCompliantOnly} label="EU-compliant only" />
        <ToggleSwitch checked={handsOnOnly} onChange={setHandsOnOnly} label="★ Hands-on tested only" />
        <ToggleSwitch
          checked={showCommission}
          onChange={setShowCommission}
          label="Show our commission"
          description="Doesn't change scores"
        />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="w-full bg-transparent text-ds-muted border border-ds-border py-2 rounded-[8px] text-[12px] font-medium cursor-pointer hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
      >
        Reset all filters
      </button>
    </>
  );
}
