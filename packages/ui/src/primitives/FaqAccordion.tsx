export interface FaqItem {
  /** Question text. */
  q: string;
  /** Answer text. */
  a: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Heading level inside `<summary>`. Default 3 (h3). */
  headingLevel?: 2 | 3 | 4;
  /** Override the gap between accordion items (Tailwind value, default `gap-3`). */
  gapClass?: string;
}

/**
 * FaqAccordion — extracted from the 12 places it was duplicated
 * (Listicle, HeadToHead, ThreeWay, IngredientDetail, plus 8 per-region
 * /best-nootropics pages). Native `<details>`/`<summary>` for keyboard
 * + assistive-tech accessibility; `<summary>` contains a real heading so
 * the FAQ outline survives heading-nav (per accessibility lead's
 * M3F batched review).
 */
export function FaqAccordion({
  items,
  headingLevel = 3,
  gapClass = 'gap-3',
}: FaqAccordionProps) {
  if (items.length === 0) return null;
  const Heading: 'h2' | 'h3' | 'h4' =
    headingLevel === 2 ? 'h2' : headingLevel === 4 ? 'h4' : 'h3';

  return (
    <div className={`flex flex-col ${gapClass}`}>
      {items.map((item) => (
        <details
          key={item.q}
          className="border border-ds-border rounded-[10px] p-5 group open:bg-ds-card-sub"
        >
          <summary className="faq-question font-semibold text-ds-ink text-[15px] cursor-pointer list-none flex justify-between items-center gap-3 focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded">
            <Heading className="font-semibold text-[15px] text-ds-ink m-0">
              {item.q}
            </Heading>
            <span
              aria-hidden="true"
              className="text-ds-muted group-open:rotate-180 transition-transform"
            >
              ▾
            </span>
          </summary>
          <p className="text-[14px] text-ds-ink-soft leading-[1.6] mt-3 mb-0">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export default FaqAccordion;
