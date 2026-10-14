import { Fragment } from 'react';
import { disclaimerParts } from '@nootropic/data';

/**
 * Renders a regional health disclaimer with its language runs marked. The JP
 * disclaimer's Japanese half stays on the English JP host as a protective
 * notice (owner decision 2026-10-13) and renders inside <span lang="ja">, with
 * the English half after it, the text unchanged. Any other disclaimer renders
 * as plain text, exactly as `{text}` did.
 */
export default function DisclaimerText({ text }: { text: string }) {
  return (
    <>
      {disclaimerParts(text).map((part, i) =>
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
