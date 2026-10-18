import { Fragment } from 'react';
import { disclaimerParts } from '@nootropic/data';
import type { DisclaimerPart } from '@nootropic/data';

/** Renders language runs in order; a run with `lang` sits inside <span lang>. */
export function LanguageRuns({ parts }: { parts: readonly DisclaimerPart[] }) {
  return (
    <>
      {parts.map((part, i) =>
        part.lang ? (
          <span key={i} lang={part.lang}>
            {part.text}
          </span>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        ),
      )}
    </>
  );
}

/**
 * Renders a regional health disclaimer with its language runs marked. The JP
 * disclaimer's Japanese half stays on the English JP host as a protective
 * notice (owner decision 2026-10-13) and renders inside <span lang="ja">, with
 * the English half after it, the text unchanged. Any other disclaimer renders
 * as plain text, exactly as `{text}` did.
 */
export default function DisclaimerText({ text }: { text: string }) {
  const parts = disclaimerParts(text);
  // One run in the page language: the bare string, so the page and its RSC
  // payload stay exactly what `{text}` produced.
  if (parts.length === 1 && !parts[0].lang) return parts[0].text;
  return <LanguageRuns parts={parts} />;
}
