import type { ReactNode } from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  /** Omit on the last (current-page) item. */
  href?: string;
}

export interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
  /** Right-aligned slot for search, actions, or the affiliate disclosure link. */
  actions?: ReactNode;
  /** Inline affiliate-disclosure link rendered between the breadcrumb and actions. */
  disclosure?: ReactNode;
}

/**
 * BreadcrumbBar — top-bar component with breadcrumb trail, optional
 * inline affiliate-disclosure link, and a right-aligned actions slot.
 * Wraps the breadcrumb in <nav aria-label="Breadcrumb"> with an
 * ordered list; current page (last item) is plain text with
 * aria-current="page".
 */
export function BreadcrumbBar({ items, actions, disclosure }: BreadcrumbBarProps) {
  return (
    <div className="bg-ds-card border-b border-ds-border px-7 py-[14px] flex items-center justify-between sticky top-0 z-[5]">
      <div className="flex items-center gap-[14px]">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[13px] text-ds-muted m-0 p-0 list-none">
            {items.map((item, i) => {
              const isLast = i === items.length - 1;
              return (
                <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                  {i > 0 && <span className="text-ds-faint" aria-hidden="true">/</span>}
                  {isLast || !item.href ? (
                    <span
                      aria-current={isLast ? 'page' : undefined}
                      className="text-ds-ink font-semibold"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-ds-muted font-medium hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded-[4px]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
        {disclosure && (
          <>
            <span className="text-ds-border" aria-hidden="true">·</span>
            {disclosure}
          </>
        )}
      </div>
      {actions && <div className="flex items-center gap-[10px]">{actions}</div>}
    </div>
  );
}

export default BreadcrumbBar;
