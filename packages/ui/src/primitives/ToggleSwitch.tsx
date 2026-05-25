export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  /** Accessible label. Required — the visual track has no text. */
  label: string;
  /** Optional sub-text rendered next to the label. */
  description?: string;
  disabled?: boolean;
  /** Render the label visually next to the toggle (default) or hide it. */
  hideLabel?: boolean;
}

/**
 * ToggleSwitch — iOS-style pill switch. Implemented as a `<button>` with
 * `role="switch"` + `aria-checked`. Space and Enter both toggle.
 */
export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  hideLabel = false,
}: ToggleSwitchProps) {
  const track = `relative inline-block w-8 h-[18px] rounded-full transition-colors flex-shrink-0 ${
    checked ? 'bg-ds-accent' : 'bg-ds-border-strong'
  } ${disabled ? 'opacity-50' : ''}`;
  const thumb = `absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left]`;
  const thumbStyle = { left: checked ? 16 : 2 };

  return (
    <label className={`inline-flex items-center justify-between gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      {!hideLabel && (
        <span className="flex flex-col">
          <span className="text-[13px] font-medium text-ds-ink">{label}</span>
          {description && (
            <span className="text-[11px] text-ds-muted mt-[1px]">{description}</span>
          )}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`${track} focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2`}
      >
        <span aria-hidden="true" className={thumb} style={thumbStyle} />
      </button>
    </label>
  );
}

export default ToggleSwitch;
