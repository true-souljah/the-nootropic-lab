import { describe, test, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { productsUS } from '@nootropic/data';
import QuizResults from './templates/QuizResults';
import { scoreQuiz, type QuizAnswers } from './templates/quizScoring';
import { LISTICLE_MIN_SCORE, formatListicleScore } from './templates/listicleRanking';

// A product listed for the chosen goal was recommended ("You should try …")
// whatever its score: Energy, very caffeine-sensitive, $58 led to "You should
// try Performance Lab Energy", which our audit scores 4.3/10. The quiz now
// recommends a listed product only at or above the bar a listicle pick needs
// to be ranked (LISTICLE_MIN_SCORE; operator decision 2026-10-19); below it,
// the page calls it the closest match and gives the score.

function pageText(answers: QuizAnswers): string {
  const html = renderToStaticMarkup(<QuizResults products={productsUS} answers={answers} />);
  return html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');
}

const bar = formatListicleScore(LISTICLE_MIN_SCORE);

describe('QuizResults — a listed product below the listicle bar is not recommended', () => {
  test('listed top match below the bar: closest match, with its score and the bar', () => {
    const answers: QuizAnswers = { goals: ['Energy'], caffeine: 'Very sensitive', budget: 58, mbg: 'Not important' };
    const top = scoreQuiz(productsUS, answers)!.top.product;
    // Preconditions from the data: the top match is listed for energy and scores below the bar.
    expect(top.bestFor).toContain('Energy');
    expect(top.score).toBeLessThan(LISTICLE_MIN_SCORE);
    const text = pageText(answers);

    expect(text).not.toContain('You should try');
    expect(text).not.toContain('Our pick for you');
    expect(text).not.toContain('% confidence');
    expect(text).toContain(`${top.name} is the closest match, but it scores ${formatListicleScore(top.score)}/10, below the ${bar} we need to recommend a product.`);
    expect(text).toContain('It is listed for energy and fits your answers best');
  });

  test('names the listed products that do meet the bar but rank lower', () => {
    const answers: QuizAnswers = { goals: ['Energy'], caffeine: 'Very sensitive', budget: 58, mbg: 'Not important' };
    const top = scoreQuiz(productsUS, answers)!.top.product;
    const atBar = productsUS.filter((p) => p !== top && p.bestFor.includes('Energy') && p.score >= LISTICLE_MIN_SCORE).map((p) => p.name);
    expect(atBar.length).toBeGreaterThan(0);
    const names = atBar.length === 1 ? atBar[0] : `${atBar.slice(0, -1).join(', ')} and ${atBar[atBar.length - 1]}`;
    expect(pageText(answers)).toContain(`${names} ${atBar.length === 1 ? 'is' : 'are'} listed for energy too`);
  });

  test('no listed product meets the bar: no sentence about stronger listed products', () => {
    // Today every goal has a listed product at the bar, so this branch is
    // reached by leaving the energy products at the bar out of the catalogue.
    const products = productsUS.filter((p) => !(p.bestFor.includes('Energy') && p.score >= LISTICLE_MIN_SCORE));
    const answers: QuizAnswers = { goals: ['Energy'], caffeine: 'Very sensitive', budget: 58, mbg: 'Not important' };
    const top = scoreQuiz(products, answers)!.top.product;
    expect(top.bestFor).toContain('Energy');
    expect(top.score).toBeLessThan(LISTICLE_MIN_SCORE);
    const html = renderToStaticMarkup(<QuizResults products={products} answers={answers} />);
    const text = html.replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ');

    expect(text).toContain(`${top.name} is the closest match, but it scores ${formatListicleScore(top.score)}/10, below the ${bar} we need to recommend a product.`);
    expect(text).toContain('It is listed for energy and fits your answers best — very sensitive to caffeine, $58/month budget.');
    expect(text).not.toContain('listed for energy too');
  });

  test('a listed top match at or above the bar keeps the recommendation', () => {
    const answers: QuizAnswers = { goals: ['Focus'], caffeine: 'Very sensitive', budget: 70, mbg: 'Somewhat important' };
    const top = scoreQuiz(productsUS, answers)!.top.product;
    expect(top.bestFor).toContain('Focus');
    expect(top.score).toBeGreaterThanOrEqual(LISTICLE_MIN_SCORE);
    const text = pageText(answers);

    expect(text).toContain(`You should try ${top.name}.`);
    expect(text).toContain('Our pick for you');
    expect(text).not.toContain('closest match');
  });
});
