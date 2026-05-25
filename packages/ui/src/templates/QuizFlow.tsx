'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '../primitives/Card';
import { BrandMark } from '../primitives/BrandMark';
import type { Product } from '@nootropic/data';
import type {
  QuizAnswers,
  QuizGoal,
  CaffeineSensitivity,
  MBGImportance,
} from './quizScoring';

export interface QuizFlowProps {
  /** Products surfaced in Step 3's "N products match" indicator. */
  products: Product[];
  /** Where to send the user when they tap "Skip the quiz". */
  skipHref?: string;
  /** Results route — receives encoded answers as query params. */
  resultsHref?: string;
}

const GOALS: Array<{ id: QuizGoal; desc: string }> = [
  { id: 'Focus', desc: 'Sharper attention during deep work' },
  { id: 'Memory', desc: 'Better recall + long-term retention' },
  { id: 'Energy', desc: 'Sustained drive without the crash' },
  { id: 'Mood', desc: 'Stress + emotional regulation' },
  { id: 'Sleep recovery', desc: 'Restorative sleep + next-day clarity' },
  { id: 'Aging support', desc: 'Long-term brain health' },
];

const CAFFEINE: Array<{ id: CaffeineSensitivity; desc: string }> = [
  { id: 'Very sensitive', desc: 'Coffee jitters, sleep disruption, or anxiety from any stimulant.' },
  { id: 'Moderate', desc: 'OK with 1 cup of coffee a day but more makes me jittery.' },
  { id: 'Not sensitive', desc: 'Tolerate caffeine well — daily coffee drinker, no effect on sleep.' },
];

const MBG_OPTIONS: Array<{ id: MBGImportance; desc: string }> = [
  { id: 'Very important', desc: 'I need a long guarantee window to feel safe trying it.' },
  { id: 'Somewhat important', desc: 'Nice to have but not a deal-breaker.' },
  { id: 'Not important', desc: "I'll commit if the formula is right." },
  { id: "I don't know yet", desc: 'Honestly unsure — surface the best matches and let me decide.' },
];

const STEP_COUNT = 5;

function encodeAnswers(a: QuizAnswers): string {
  const params = new URLSearchParams();
  params.set('goals', a.goals.join(','));
  params.set('caf', a.caffeine === 'Very sensitive' ? 'v' : a.caffeine === 'Moderate' ? 'm' : 'n');
  params.set('budget', String(a.budget));
  params.set(
    'mbg',
    a.mbg === 'Very important'
      ? 'v'
      : a.mbg === 'Somewhat important'
        ? 's'
        : a.mbg === 'Not important'
          ? 'n'
          : 'd'
  );
  return params.toString();
}

/**
 * QuizFlow — 5-step interactive matchmaking quiz. Single client
 * component with state machine. Minimal chrome per Phase 4 (green
 * flask + "Skip the quiz" link, progress bar, centered 720px column).
 * Step 5 is a 1.5-second loading screen before redirecting to results.
 */
export default function QuizFlow({
  products,
  skipHref = '/best-nootropics',
  resultsHref = '/quiz/results',
}: QuizFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState<QuizGoal[]>([]);
  const [caffeine, setCaffeine] = useState<CaffeineSensitivity | null>(null);
  const [budget, setBudget] = useState(60);
  const [mbg, setMbg] = useState<MBGImportance | null>(null);

  function toggleGoal(g: QuizGoal) {
    setGoals((prev) => {
      if (prev.includes(g)) return prev.filter((x) => x !== g);
      if (prev.length >= 2) return [...prev.slice(1), g];
      return [...prev, g];
    });
  }

  const canContinue =
    (step === 1 && goals.length > 0) ||
    (step === 2 && caffeine !== null) ||
    (step === 3 && budget >= 20 && budget <= 100) ||
    (step === 4 && mbg !== null) ||
    step === 5;

  function next() {
    if (step === 4 && mbg !== null) {
      setStep(5);
      const answers: QuizAnswers = {
        goals,
        caffeine: caffeine!,
        budget,
        mbg,
      };
      // Brief artificial delay so the loading screen registers
      setTimeout(() => {
        router.push(`${resultsHref}?${encodeAnswers(answers)}`);
      }, 1500);
      return;
    }
    if (canContinue) setStep((s) => Math.min(STEP_COUNT, s + 1));
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  // Number of products that fit the budget — surfaced in Step 3.
  const budgetMatches = products.filter(
    (p) => (p.priceMonthlyUSD ?? Infinity) <= budget
  ).length;

  return (
    <div
      className="bg-ds-bg text-ds-ink min-h-screen ds-font-features"
      style={{ fontFamily: 'var(--font-ds-sans)' }}
    >
      <QuizHeader skipHref={skipHref} />

      <main className="max-w-[720px] mx-auto px-6 pt-7 pb-12">
        <ProgressIndicator step={step} total={STEP_COUNT} />

        {step === 1 && (
          <Step
            title="What are you optimizing for?"
            subtitle="Pick up to 2. We'll match products whose evidence focuses on these goals."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const selected = goals.includes(g.id);
                return (
                  <SelectableCard
                    key={g.id}
                    selected={selected}
                    onClick={() => toggleGoal(g.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[15px] text-ds-ink">{g.id}</div>
                        <div className="text-[12.5px] text-ds-muted mt-[2px]">{g.desc}</div>
                      </div>
                      {selected && <CheckBadge />}
                    </div>
                  </SelectableCard>
                );
              })}
            </div>
            <p className="text-[12px] text-ds-muted mt-3 m-0">
              {goals.length === 0
                ? 'Pick at least one.'
                : `${goals.length} of 2 selected.`}
            </p>
          </Step>
        )}

        {step === 2 && (
          <Step
            title="How sensitive are you to caffeine?"
            subtitle="Caffeine-containing stacks can amplify focus — but only if your body tolerates them."
          >
            <div className="flex flex-col gap-3">
              {CAFFEINE.map((c) => (
                <SelectableCard
                  key={c.id}
                  selected={caffeine === c.id}
                  onClick={() => setCaffeine(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <RadioDot selected={caffeine === c.id} />
                    <div>
                      <div className="font-semibold text-[15px] text-ds-ink">{c.id}</div>
                      <div className="text-[12.5px] text-ds-muted mt-[2px]">{c.desc}</div>
                    </div>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step
            title="What's your monthly budget?"
            subtitle="Most fully-dosed formulas land between $40 and $80/month."
          >
            <Card padding={24}>
              <div className="flex justify-between items-baseline mb-4 flex-wrap gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-ds-muted font-semibold">
                    Your budget
                  </div>
                  <div className="text-[40px] font-bold tracking-[-0.02em] text-ds-accent ds-tabular mt-1">
                    ${budget}
                    <span className="text-[14px] text-ds-muted font-medium ml-1">/mo</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[12px] text-ds-muted">
                    {budgetMatches} of {products.length} products match
                  </div>
                  <div
                    className={`inline-flex items-center gap-[5px] text-[12px] mt-1 font-semibold px-2 py-[2px] rounded-full ${
                      budget >= 70
                        ? 'bg-ds-good-soft text-ds-good-ink'
                        : budget >= 40
                          ? 'bg-ds-accent-soft text-ds-accent'
                          : 'bg-ds-warn-soft text-ds-warn-ink'
                    }`}
                  >
                    <span aria-hidden="true">●</span>
                    {budget >= 70 ? 'Premium' : budget >= 40 ? 'Sweet spot' : 'Bargain'}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={30}
                max={100}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
                aria-label="Monthly budget"
                style={{ accentColor: 'var(--color-ds-accent)' }}
              />
              <div className="flex justify-between text-[10px] text-ds-muted mt-1 ds-tabular">
                <span>$30</span>
                <span>$100</span>
              </div>
            </Card>
            {budget < 40 && (
              <Card variant="subdued" padding={16} className="mt-3 border-l-[3px] border-l-ds-warn">
                <div className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">
                  <strong className="text-ds-warn-ink">Heads up:</strong> products under $40/month
                  typically underdose at least one flagship ingredient. You may want to budget at
                  least $45–50 to cover a fully-dosed formula.
                </div>
              </Card>
            )}
          </Step>
        )}

        {step === 4 && (
          <Step
            title="How important is the money-back guarantee?"
            subtitle="Longer guarantees give cognitive-supplement timelines (8–12 weeks for Bacopa, etc.) room to play out."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {MBG_OPTIONS.map((m) => (
                <SelectableCard
                  key={m.id}
                  selected={mbg === m.id}
                  onClick={() => setMbg(m.id)}
                >
                  <div className="flex items-center gap-3">
                    <RadioDot selected={mbg === m.id} />
                    <div>
                      <div className="font-semibold text-[15px] text-ds-ink">{m.id}</div>
                      <div className="text-[12.5px] text-ds-muted mt-[2px]">{m.desc}</div>
                    </div>
                  </div>
                </SelectableCard>
              ))}
            </div>
          </Step>
        )}

        {step === 5 && (
          <div className="text-center pt-10">
            <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ds-ink m-0 mb-3">
              Building your stack&hellip;
            </h1>
            <p className="text-[14px] text-ds-muted m-0 mb-8">
              Scoring {products.length} products against your answers.
            </p>
            <div
              className="w-[60px] h-[60px] mx-auto rounded-full border-[5px] border-ds-border border-t-ds-accent animate-spin"
              role="status"
              aria-label="Building your stack"
            />
          </div>
        )}

        {step < 5 && (
          <div className="flex justify-between items-center mt-9">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="bg-transparent text-ds-muted border-0 cursor-pointer text-[13px] font-medium hover:text-ds-ink disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded px-3 py-2"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canContinue}
              className="bg-ds-accent hover:bg-ds-accent-press disabled:opacity-50 disabled:cursor-not-allowed text-white border-0 cursor-pointer px-6 py-[10px] rounded-[8px] text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              {step === 4 ? 'See my matches →' : 'Continue →'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function QuizHeader({ skipHref }: { skipHref: string }) {
  return (
    <header
      role="banner"
      className="bg-ds-card border-b border-ds-border px-6 py-[14px] flex justify-between items-center sticky top-0 z-10"
    >
      <Link href="/" className="flex items-center gap-[10px]" aria-label="Nootropic Lab">
        <BrandMark size={28} />
        <span className="font-bold text-[15px] text-ds-ink tracking-tight">Nootropic Lab</span>
      </Link>
      <Link
        href={skipHref}
        className="text-[13px] text-ds-muted hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded px-2 py-1"
      >
        Skip the quiz →
      </Link>
    </header>
  );
}

function ProgressIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-7">
      <div className="text-[11px] uppercase tracking-[0.12em] text-ds-muted font-semibold mb-2">
        Question {step} of {total}
      </div>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Quiz progress, step ${step} of ${total}`}
        className="flex gap-1"
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-[6px] flex-1 rounded-full ${i < step ? 'bg-ds-accent' : 'bg-ds-border'}`}
          />
        ))}
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div>
      <h1 className="text-[32px] font-bold tracking-[-0.02em] text-ds-ink m-0 mb-2 leading-[1.1]">
        {title}
      </h1>
      <p className="text-[13.5px] text-ds-muted m-0 mb-7 leading-[1.55]">{subtitle}</p>
      {children}
    </div>
  );
}

function SelectableCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left w-full p-[18px] rounded-[10px] border bg-ds-card transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 ${
        selected
          ? 'border-ds-accent bg-ds-accent-soft'
          : 'border-ds-border hover:border-ds-border-strong'
      }`}
      style={{ borderWidth: selected ? 1.5 : 1 }}
    >
      {children}
    </button>
  );
}

function CheckBadge() {
  return (
    <div
      className="w-5 h-5 bg-ds-accent rounded-full grid place-items-center text-white text-[12px] font-bold shrink-0"
      aria-hidden="true"
    >
      ✓
    </div>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <span
      className={`w-[22px] h-[22px] rounded-full border-2 shrink-0 grid place-items-center ${
        selected ? 'border-ds-accent' : 'border-ds-border-strong'
      }`}
      aria-hidden="true"
    >
      {selected && <span className="w-[10px] h-[10px] bg-ds-accent rounded-full" />}
    </span>
  );
}
