'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from './AppShell';
import { Card } from '../primitives/Card';
import { Chip } from '../primitives/Chip';
import { SparkBars } from '../primitives/SparkBars';
import { LiveRegion } from '../primitives/LiveRegion';
import type { Ingredient, UIStrings } from '@nootropic/data';
import type { SearchItem } from '../SearchModal';
import { tpl } from '../templateStrings';

export interface IngredientLibraryProps {
  ingredients: Ingredient[];
  searchItems?: SearchItem[];
  /** Page-locale chrome. Required: the template has no English fallback. */
  uiStrings: UIStrings;
  /** Heading + sub-line shown at the top. */
  hero?: { h1: string; dek: string };
}

type Grade = 'A' | 'B' | 'C';
type GradeFilter = 'All' | Grade;

/**
 * Derive an A/B/C evidence grade from the ingredient's human-effect
 * strength distribution. Used by the library filter row.
 *   strong → A · moderate → B · preliminary | mixed → C
 */
function deriveGrade(ing: Ingredient): Grade {
  const strengths = ing.humanEffects.map((e) => e.evidenceStrength);
  if (strengths.some((s) => s === 'strong')) return 'A';
  if (strengths.some((s) => s === 'moderate')) return 'B';
  return 'C';
}

function totalTrials(ing: Ingredient): number {
  return ing.humanEffects.reduce((sum, e) => sum + (e.studies ?? 0), 0);
}

/** Badge colours per grade; what each grade means is UIStrings.ingredientLibrary.descriptors. */
const GRADE_META: Record<Grade, { tone: 'good' | 'warn' | 'bad'; bg: string; text: string }> = {
  A: { tone: 'good', bg: 'bg-ds-good-soft', text: 'text-ds-good-ink' },
  B: { tone: 'warn', bg: 'bg-ds-warn-soft', text: 'text-ds-warn-ink' },
  C: { tone: 'bad', bg: 'bg-ds-bad-soft', text: 'text-ds-bad-ink' },
};

/**
 * IngredientLibrary — in-app ingredient index. Grade-filtered card +
 * row layout per Phase 1. Grade is derived from the strongest human
 * effect evidence strength (strong→A, moderate→B, else→C). Sparkline
 * shows the human-effect study counts distribution.
 */
export default function IngredientLibrary({
  ingredients,
  searchItems,
  uiStrings,
  hero,
}: IngredientLibraryProps) {
  const [grade, setGrade] = useState<GradeFilter>('All');
  const s = uiStrings.ingredientLibrary;

  const graded = useMemo(
    () =>
      ingredients.map((ing) => ({
        ing,
        grade: deriveGrade(ing),
        trials: totalTrials(ing),
      })),
    [ingredients]
  );

  const counts = useMemo(
    () => ({
      A: graded.filter((g) => g.grade === 'A').length,
      B: graded.filter((g) => g.grade === 'B').length,
      C: graded.filter((g) => g.grade === 'C').length,
    }),
    [graded]
  );

  const visible = useMemo(
    () => (grade === 'All' ? graded : graded.filter((g) => g.grade === grade)),
    [graded, grade]
  );

  const filterAnnouncement =
    grade === 'All'
      ? tpl(s.showingAll, { n: visible.length })
      : tpl(visible.length === 1 ? s.showingGradeOne : s.showingGrade, { n: visible.length, grade });

  return (
    <AppShell
      mode="persistent"
      breadcrumbs={[{ label: uiStrings.breadcrumb.ingredients }]}
      searchItems={searchItems}
      uiStrings={uiStrings}
      sidebarMeta={tpl(uiStrings.nav.ingredientCount, { n: ingredients.length })}
    >
      <LiveRegion message={filterAnnouncement} />
      <div className="px-7 pt-7 pb-10">
        {/* Header */}
        <div className="flex justify-between items-end mb-[18px] flex-wrap gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.02em] m-0 text-ds-ink">
              {hero?.h1 ?? s.heading}
            </h1>
            <p className="text-[13px] text-ds-muted mt-1 max-w-[680px] m-0">
              {hero?.dek ?? tpl(s.dek, { n: ingredients.length })}
            </p>
          </div>
          <div role="group" aria-label={s.filterAria} className="flex gap-[6px] flex-wrap">
            {(['All', 'A', 'B', 'C'] as GradeFilter[]).map((g) => (
              <Chip key={g} active={grade === g} onClick={() => setGrade(g)}>
                {g === 'All' ? s.allGrades : tpl(s.grade, { grade: g })}
              </Chip>
            ))}
          </div>
        </div>

        {/* Grade legend */}
        <div className="grid gap-3 mb-[18px] grid-cols-1 sm:grid-cols-3">
          {(['A', 'B', 'C'] as Grade[]).map((g) => {
            const m = GRADE_META[g];
            return (
              <Card key={g} padding={16}>
                <div className="flex items-center gap-[14px]">
                  <div
                    className={`w-11 h-11 rounded-[10px] grid place-items-center text-[22px] font-extrabold ${m.bg} ${m.text}`}
                    aria-hidden="true"
                  >
                    {g}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ds-ink">
                      {tpl(s.legendCount, { n: counts[g], grade: g })}
                    </div>
                    <div className="text-[12px] text-ds-muted">{s.descriptors[g]}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <Card padding={28}>
            <p className="text-[13px] text-ds-muted text-center m-0">
              {tpl(s.empty, { grade })}{uiStrings.typography.space}
              <button
                type="button"
                onClick={() => setGrade('All')}
                className="bg-transparent text-ds-accent border-0 underline cursor-pointer text-[13px] font-semibold p-0"
              >
                {s.seeAll}
              </button>
            </p>
          </Card>
        ) : (
          <Card padding={0}>
            <div
              className="grid px-[18px] py-3 border-b border-ds-border text-[11px] uppercase tracking-[0.1em] text-ds-muted font-semibold"
              style={{ gridTemplateColumns: '60px 1.4fr 1fr 80px 2fr' }}
            >
              <div>{s.columns.grade}</div>
              <div>{s.columns.ingredient}</div>
              <div>{s.columns.clinicalDose}</div>
              <div className="text-right">{s.columns.trials}</div>
              <div>{s.columns.ourTake}</div>
            </div>
            {visible.map(({ ing, grade: g, trials }) => {
              const m = GRADE_META[g];
              return (
                <article
                  key={ing.slug}
                  className="grid gap-3 px-[18px] py-4 border-b border-ds-border last:border-b-0 items-center"
                  style={{ gridTemplateColumns: '60px 1.4fr 1fr 80px 2fr' }}
                >
                  <div>
                    <div
                      className={`w-[34px] h-[34px] rounded-[8px] grid place-items-center text-[16px] font-extrabold ${m.bg} ${m.text}`}
                      aria-label={tpl(s.gradeAria, { grade: g })}
                    >
                      {g}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={`/ingredients/${ing.slug}/`}
                      className="font-semibold text-[14px] text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded block truncate"
                    >
                      {ing.name}
                    </Link>
                    <div className="text-[12px] text-ds-muted mt-[2px] leading-[1.4]">
                      {ing.mechanism.split('.')[0]}.
                    </div>
                  </div>
                  <div className="text-[13px] text-ds-ink-soft ds-tabular leading-[1.4]">
                    {ing.clinicalDose}
                  </div>
                  <div className="text-right">
                    <SparkBars
                      values={ing.humanEffects.map((e) => e.studies ?? 0)}
                      colorClass={
                        g === 'A' ? 'bg-ds-good' : g === 'B' ? 'bg-ds-warn' : 'bg-ds-bad'
                      }
                      summary={tpl(s.studyCounts, {
                        name: ing.name,
                        counts: ing.humanEffects.map((e) => `${e.studies ?? s.notCounted}`).join(', '),
                      })}
                      height={20}
                    />
                    <div className="text-[12px] text-ds-muted mt-[2px] ds-tabular">{trials}</div>
                  </div>
                  <div className="text-[13px] text-ds-ink-soft leading-[1.55] line-clamp-3">
                    {ing.studySummary}
                  </div>
                </article>
              );
            })}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
