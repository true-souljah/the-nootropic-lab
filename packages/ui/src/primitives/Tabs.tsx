'use client';

import { useRef, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem<T extends string = string> {
  id: T;
  label: ReactNode;
}

export interface TabsProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>;
  value: T;
  onChange: (next: T) => void;
  /** Accessible label for the tab list (e.g. "Product sections"). */
  ariaLabel: string;
  /** Stable ID prefix used by buttons + panels for `aria-controls`/`aria-labelledby`. */
  idPrefix: string;
}

/**
 * Tabs — accessible tablist with roving tabindex + arrow / Home / End
 * keyboard navigation. Automatic activation: arrow keys move focus AND
 * select. Consumers render `<TabPanel>` separately, wiring `idPrefix`
 * and panel `id` to match.
 *
 * Example:
 *   <Tabs idPrefix="product" items={...} value={active} onChange={...} ariaLabel="Product sections" />
 *   <TabPanel idPrefix="product" id="overview" hidden={active !== 'overview'}>...</TabPanel>
 */
export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  ariaLabel,
  idPrefix,
}: TabsProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKey(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = items.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (e.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next !== null) {
      e.preventDefault();
      onChange(items[next].id);
      refs.current[next]?.focus();
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex border-b border-ds-border"
    >
      {items.map((item, index) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${item.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKey(e, index)}
            className={`px-[18px] py-[10px] -mb-px text-[13px] font-semibold border-b-2 transition-colors focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${
              selected
                ? 'text-ds-ink border-ds-accent'
                : 'text-ds-muted border-transparent hover:text-ds-ink-soft'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export interface TabPanelProps {
  idPrefix: string;
  id: string;
  hidden: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * TabPanel — accessible panel paired with a Tabs entry. Hidden via
 * `hidden` attribute when not active (keeps focus order clean).
 */
export function TabPanel({ idPrefix, id, hidden, children, className }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      tabIndex={0}
      hidden={hidden}
      className={className}
    >
      {children}
    </div>
  );
}

export default Tabs;
