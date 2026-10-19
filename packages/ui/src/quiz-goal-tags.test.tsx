import { describe, test, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { productsUS } from '@nootropic/data';
import QuizResults from './templates/QuizResults';
import { goalsFit, listsGoal, scoreQuiz, type QuizAnswers } from './templates/quizScoring';

// The quiz describes "Aging support" as "Long-term brain health", but no
// product carries an "Aging support" tag: products are tagged "Long-term brain
// health". The goal therefore matched nothing, and every "Aging support" answer
// got a product listed for something else (operator decision 2026-10-19: the
// goal matches the "Long-term brain health" tag).

describe('quiz goal → bestFor tags', () => {
  test('Aging support matches products tagged "Long-term brain health"', () => {
    expect(listsGoal(['Long-term brain health'], 'Aging support')).toBe(true);
    expect(listsGoal(['Aging support'], 'Aging support')).toBe(true);
    expect(listsGoal(['Focus', 'Memory'], 'Aging support')).toBe(false);
    expect(goalsFit(['Long-term brain health'], ['Aging support'])).toBe(1.2);
    expect(goalsFit(['Focus'], ['Aging support'])).toBe(0.4);
  });

  test('the other goals match only their own tag', () => {
    expect(listsGoal(['Long-term brain health'], 'Memory')).toBe(false);
    expect(goalsFit(['Focus', 'Memory'], ['Focus', 'Memory'])).toBe(1.2);
    expect(goalsFit(['Focus'], ['Focus', 'Memory'])).toBe(0.85);
  });

  test('an Aging support answer recommends a product tagged "Long-term brain health"', () => {
    // Precondition from the data: no product is tagged "Aging support" itself.
    expect(productsUS.filter((p) => p.bestFor.includes('Aging support'))).toHaveLength(0);
    expect(productsUS.some((p) => p.bestFor.includes('Long-term brain health'))).toBe(true);

    const answers: QuizAnswers = { goals: ['Aging support'], caffeine: 'Moderate', budget: 70, mbg: 'Not important' };
    const top = scoreQuiz(productsUS, answers)!.top.product;
    expect(top.bestFor).toContain('Long-term brain health');

    const html = renderToStaticMarkup(<QuizResults products={productsUS} answers={answers} />);
    const text = html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    expect(text).toContain(`You should try ${top.name}.`);
    expect(text).not.toContain('closest match');
  });
});
