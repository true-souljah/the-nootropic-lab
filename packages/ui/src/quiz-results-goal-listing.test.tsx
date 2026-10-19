import { describe, test, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { productsUS } from '@nootropic/data';
import QuizResults from './templates/QuizResults';
import { scoreQuiz, type QuizAnswers } from './templates/quizScoring';

// The quiz matches goals to each product's `bestFor` uses. When no product is
// listed for the chosen goal, or the ones that are rank lower on the other
// answers, the top match is listed for none of the goals. The results page
// used to say "You should try <product>" anyway: picking "Sleep recovery" told
// visitors to try NatureBell Ginkgo + Ginseng, listed only for Budget, Memory
// and a TCM-inspired formula (live, 2026-10-14). It must call such a product
// the closest match and say why, and keep the recommendation wording when the
// top match is listed for a goal.

function pageText(answers: QuizAnswers): string {
  const html = renderToStaticMarkup(<QuizResults products={productsUS} answers={answers} />);
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

function topOf(answers: QuizAnswers) {
  return scoreQuiz(productsUS, answers)!.top.product;
}

describe('QuizResults — a top match listed for none of the goals is not recommended for them', () => {
  test('a goal no product is listed for: closest match, and the page says no product is listed for it', () => {
    const answers: QuizAnswers = { goals: ['Sleep recovery'], caffeine: 'Moderate', budget: 60, mbg: 'Not important' };
    // Precondition from the data: no US product lists sleep recovery.
    expect(productsUS.filter((p) => p.bestFor.includes('Sleep recovery'))).toHaveLength(0);
    const top = topOf(answers);
    const text = pageText(answers);

    expect(text).not.toContain('You should try');
    expect(text).not.toContain('Our pick for you');
    expect(text).not.toContain('% confidence');
    expect(text).toContain(`${top.name} is the closest match, but it isn't listed for sleep recovery.`);
    expect(text).toContain(`None of the ${productsUS.length} products we review is listed for sleep recovery yet.`);
  });

  test('a goal whose listed products rank lower on the other answers: names them and calls the top the closest match', () => {
    const answers: QuizAnswers = { goals: ['Focus'], caffeine: 'Very sensitive', budget: 30, mbg: 'Somewhat important' };
    const top = topOf(answers);
    // Precondition from the data: the top match is not listed for focus, but others are.
    expect(top.bestFor).not.toContain('Focus');
    const listed = productsUS.filter((p) => p.bestFor.includes('Focus')).map((p) => p.name);
    expect(listed.length).toBeGreaterThan(1);
    const text = pageText(answers);

    expect(text).not.toContain('You should try');
    expect(text).toContain(`${top.name} is the closest match, but it isn't listed for focus.`);
    const names = `${listed.slice(0, -1).join(', ')} and ${listed[listed.length - 1]}`;
    expect(text).toContain(`${names} are listed for focus but rank below ${top.name} on your answers as a whole`);
  });

  test('two goals, top listed for neither: the headline names both with "or"', () => {
    const answers: QuizAnswers = { goals: ['Mood', 'Sleep recovery'], caffeine: 'Moderate', budget: 60, mbg: 'Not important' };
    const top = topOf(answers);
    expect(pageText(answers)).toContain(`${top.name} is the closest match, but it isn't listed for mood or sleep recovery.`);
  });

  test('three goals (possible through the results URL): listed as "a, b or c"', () => {
    // Aging support now matches "Long-term brain health", so the three goals
    // here pair the two uncovered ones with Focus at a $30 budget, where no
    // caffeine-free product listed for focus fits.
    const answers: QuizAnswers = { goals: ['Mood', 'Sleep recovery', 'Focus'], caffeine: 'Very sensitive', budget: 30, mbg: 'Not important' };
    const top = topOf(answers);
    expect(top.bestFor).not.toContain('Focus');
    expect(pageText(answers)).toContain(`${top.name} is the closest match, but it isn't listed for mood, sleep recovery or focus.`);
  });

  test('a top match listed for the goal keeps the recommendation', () => {
    const answers: QuizAnswers = { goals: ['Focus'], caffeine: 'Very sensitive', budget: 70, mbg: 'Somewhat important' };
    const top = topOf(answers);
    expect(top.bestFor).toContain('Focus');
    const text = pageText(answers);

    expect(text).toContain(`You should try ${top.name}.`);
    expect(text).toContain('Our pick for you');
    expect(text).not.toContain('closest match');
  });
});
