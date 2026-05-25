'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  QuizResults,
  type CaffeineSensitivity,
  type MBGImportance,
  type QuizAnswers,
  type QuizGoal,
} from '@nootropic/ui';
import { productsUS } from '@nootropic/data';

const VALID_GOALS: QuizGoal[] = ['Focus', 'Memory', 'Energy', 'Mood', 'Sleep recovery', 'Aging support'];

function decodeAnswers(params: URLSearchParams): QuizAnswers | null {
  const rawGoals = params.get('goals') ?? '';
  const goals = rawGoals
    .split(',')
    .map((g) => g.trim())
    .filter((g): g is QuizGoal => VALID_GOALS.includes(g as QuizGoal));

  const caffeineCode = params.get('caf') ?? '';
  const caffeine: CaffeineSensitivity | null =
    caffeineCode === 'v'
      ? 'Very sensitive'
      : caffeineCode === 'm'
        ? 'Moderate'
        : caffeineCode === 'n'
          ? 'Not sensitive'
          : null;

  const budgetRaw = Number(params.get('budget'));
  const budget = Number.isFinite(budgetRaw) && budgetRaw >= 20 && budgetRaw <= 200 ? budgetRaw : NaN;

  const mbgCode = params.get('mbg') ?? '';
  const mbg: MBGImportance | null =
    mbgCode === 'v'
      ? 'Very important'
      : mbgCode === 's'
        ? 'Somewhat important'
        : mbgCode === 'n'
          ? 'Not important'
          : mbgCode === 'd'
            ? "I don't know yet"
            : null;

  if (caffeine === null || mbg === null || !Number.isFinite(budget) || goals.length === 0) {
    return null;
  }
  return { goals, caffeine, budget, mbg };
}

function ResultsBody() {
  const router = useRouter();
  const params = useSearchParams();
  const answers = decodeAnswers(params);

  useEffect(() => {
    if (!answers) router.replace('/quiz');
  }, [answers, router]);

  if (!answers) return null;
  return <QuizResults products={productsUS} answers={answers} quizHref="/quiz" />;
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={null}>
      <ResultsBody />
    </Suspense>
  );
}
