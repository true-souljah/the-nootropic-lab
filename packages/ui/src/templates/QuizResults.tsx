import Link from 'next/link';
import { Card } from '../primitives/Card';
import { BrandMark } from '../primitives/BrandMark';
import { Chip } from '../primitives/Chip';
import { ScorePill } from '../primitives/ScorePill';
import TrackedAffiliateLink from '../TrackedAffiliateLink';
import type { Product } from '@nootropic/data';
import {
  scoreQuiz,
  goalsFit,
  caffeineFit,
  budgetFit,
  mbgFit,
  type QuizAnswers,
} from './quizScoring';

export interface QuizResultsProps {
  products: Product[];
  answers: QuizAnswers;
  /** Where the "retake quiz" link points. */
  quizHref?: string;
}

/**
 * QuizResults — shows the top match + 2 runner-ups + a "why this
 * matched" panel. Minimal chrome per Phase 4. Scoring is computed
 * deterministically from answers via the Phase-5 multiplier tables.
 */
export default function QuizResults({
  products,
  answers,
  quizHref = '/quiz',
}: QuizResultsProps) {
  const result = scoreQuiz(products, answers);

  if (!result) {
    return (
      <NoMatch quizHref={quizHref} />
    );
  }

  const top = result.top.product;
  const goalText = answers.goals.length === 0
    ? 'general cognitive support'
    : answers.goals.length === 1
      ? answers.goals[0].toLowerCase()
      : `${answers.goals[0].toLowerCase()} and ${answers.goals[1].toLowerCase()}`;

  return (
    <div
      className="bg-ds-bg text-ds-ink min-h-screen ds-font-features"
      style={{ fontFamily: 'var(--font-ds-sans)' }}
    >
      <a href="#quiz-results-main-content" className="ds-skip-link">
        Skip to main content
      </a>
      <ResultsHeader quizHref={quizHref} />

      <main id="quiz-results-main-content" className="max-w-[760px] mx-auto px-6 pt-7 pb-12">
        <div className="mb-4">
          <Chip tone="accent">Your match · {result.confidence}% confidence</Chip>
        </div>

        <h1 className="text-[36px] font-bold tracking-[-0.02em] leading-[1.1] m-0 mb-4 text-ds-ink">
          You should try <span className="text-ds-accent">{top.name}</span>.
        </h1>
        <p className="text-[16px] text-ds-ink-soft m-0 mb-8 leading-[1.6]">
          Based on your answers — {goalText}, {answers.caffeine.toLowerCase()} to caffeine, $
          {answers.budget}/month budget — {top.name} is the strongest match in our coverage.{' '}
          {top.summary}
        </p>

        {/* Top recommendation card */}
        <Card padding={24} className="border-ds-accent relative mb-8" style={{ borderWidth: 1.5 }}>
          <div
            className="absolute top-0 left-6 bg-ds-accent text-white text-[10px] uppercase tracking-[0.14em] font-bold px-3 py-1 rounded-b-[6px]"
            aria-hidden="true"
          >
            Our pick for you
          </div>

          <div className="flex gap-5 items-start mt-3 flex-wrap">
            <div
              className="w-16 h-16 bg-ds-ink rounded-[14px] grid place-items-center text-white font-extrabold text-[24px] flex-shrink-0"
              aria-hidden="true"
            >
              {top.name[0]}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex flex-wrap gap-[6px] mb-2">
                {top.editorChoice && <Chip tone="accent">★ Editor&apos;s pick</Chip>}
                {top.caffeineFree ? (
                  <Chip tone="good">Caffeine-free</Chip>
                ) : (
                  <Chip tone="warn">Caffeine</Chip>
                )}
              </div>
              <h2 className="text-[22px] font-bold tracking-[-0.01em] text-ds-ink m-0 mb-1">
                {top.name}
              </h2>
              <div className="text-[13px] text-ds-muted mb-2">{top.brand}</div>
              <p className="text-[14px] text-ds-ink-soft m-0 leading-[1.6]">{top.summary}</p>
            </div>
            <div className="text-right">
              <ScorePill score={top.score} />
              {top.priceMonthlyUSD && (
                <div className="text-[13px] text-ds-muted mt-2 ds-tabular">
                  ${top.priceMonthlyUSD}/mo
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mt-5">
            <TrackedAffiliateLink
              product={top}
              position={1}
              surface="review"
              className="bg-ds-accent hover:bg-ds-accent-press text-white px-5 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              Visit {top.brand} →
            </TrackedAffiliateLink>
            <Link
              href={`/${top.slug}`}
              className="bg-ds-card border border-ds-border text-ds-ink px-5 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline hover:bg-ds-card-sub focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
            >
              Read full review
            </Link>
          </div>
        </Card>

        {/* Why this matched */}
        <Card variant="subdued" padding={22} className="mb-8">
          <h3 className="text-[15px] font-semibold m-0 mb-4 text-ds-ink">Why this matched</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FitRow
              label="Goals fit"
              user={answers.goals.join(', ')}
              productAttr={top.bestFor.join(' · ')}
              tone={goalsFit(top.bestFor, answers.goals) >= 1.0 ? 'good' : 'warn'}
            />
            <FitRow
              label="Caffeine"
              user={answers.caffeine}
              productAttr={top.caffeineFree ? 'Caffeine-free' : 'Contains caffeine'}
              tone={caffeineFit(top.caffeineFree, answers.caffeine) >= 1.0 ? 'good' : 'warn'}
            />
            <FitRow
              label="Budget"
              user={`$${answers.budget}/mo`}
              productAttr={top.priceMonthlyUSD ? `$${top.priceMonthlyUSD}/mo` : '—'}
              tone={budgetFit(top.priceMonthlyUSD, answers.budget) >= 1.0 ? 'good' : 'warn'}
            />
            <FitRow
              label="Money-back"
              user={answers.mbg}
              productAttr={`${top.moneyBackDays} days`}
              tone={mbgFit(top.moneyBackDays, answers.mbg) >= 1.0 ? 'good' : 'warn'}
            />
          </div>
        </Card>

        {/* Runner-ups */}
        {result.runnerUps.length > 0 && (
          <section className="mb-8">
            <h2 className="text-[22px] font-bold tracking-[-0.01em] m-0 mb-4 text-ds-ink">
              If not, try these
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {result.runnerUps.map((r) => (
                <Card key={r.product.slug} padding={20}>
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div>
                      <Link
                        href={`/${r.product.slug}`}
                        className="font-bold text-[15px] text-ds-ink hover:text-ds-accent focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded block"
                      >
                        {r.product.name}
                      </Link>
                      <div className="text-[12px] text-ds-muted">{r.product.brand}</div>
                    </div>
                    <ScorePill score={r.product.score} />
                  </div>
                  <p className="text-[13px] text-ds-ink-soft m-0 leading-[1.55]">{r.product.summary}</p>
                  <div className="text-[12px] text-ds-muted mt-3 ds-tabular">
                    {r.product.priceMonthlyUSD ? `$${r.product.priceMonthlyUSD}/mo` : ''}
                    {r.product.priceMonthlyUSD && ' · '}
                    {r.product.moneyBackDays}-day MBG
                    {r.product.caffeineFree ? ' · caffeine-free' : ''}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="text-center text-[13px] text-ds-muted">
          <Link href={quizHref} className="text-ds-accent underline font-semibold">
            ← Retake quiz
          </Link>
          {' · '}
          <Link href="/best-nootropics" className="text-ds-accent underline font-semibold">
            See all ranked products
          </Link>
        </div>
      </main>
    </div>
  );
}

function FitRow({
  label,
  user,
  productAttr,
  tone,
}: {
  label: string;
  user: string;
  productAttr: string;
  tone: 'good' | 'warn';
}) {
  const dot = tone === 'good' ? 'bg-ds-good' : 'bg-ds-warn';
  return (
    <div className="flex gap-3 items-start">
      <span className={`w-2 h-2 rounded-full ${dot} mt-[7px] shrink-0`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-ds-muted mb-1">
          {label}
        </div>
        <div className="text-[13px] text-ds-ink-soft leading-[1.5]">
          <strong className="text-ds-ink font-semibold">{productAttr}</strong>
          <span className="text-ds-muted"> · you said {user.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
}

function ResultsHeader({ quizHref }: { quizHref: string }) {
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
        href={quizHref}
        className="text-[13px] text-ds-muted hover:text-ds-ink focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2 rounded px-2 py-1"
      >
        Retake quiz →
      </Link>
    </header>
  );
}

function NoMatch({ quizHref }: { quizHref: string }) {
  return (
    <div
      className="bg-ds-bg text-ds-ink min-h-screen ds-font-features"
      style={{ fontFamily: 'var(--font-ds-sans)' }}
    >
      <a href="#quiz-nomatch-main-content" className="ds-skip-link">
        Skip to main content
      </a>
      <ResultsHeader quizHref={quizHref} />
      <main id="quiz-nomatch-main-content" className="max-w-[640px] mx-auto px-6 pt-16 text-center">
        <h1 className="text-[28px] font-bold tracking-[-0.01em] text-ds-ink m-0 mb-3">
          No clear match.
        </h1>
        <p className="text-[14px] text-ds-muted m-0 mb-6 leading-[1.6]">
          Your constraints don&apos;t fit any of the products we currently audit. Try widening your
          budget or relaxing one of the filters.
        </p>
        <Link
          href={quizHref}
          className="inline-block bg-ds-accent hover:bg-ds-accent-press text-white px-6 py-[10px] rounded-[8px] text-[13px] font-semibold no-underline focus-visible:outline-2 focus-visible:outline-ds-focus-ring focus-visible:outline-offset-2"
        >
          Retake quiz →
        </Link>
      </main>
    </div>
  );
}
