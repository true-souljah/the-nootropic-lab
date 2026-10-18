import { Fragment, type ReactNode } from 'react';

/**
 * Fills the `{name}` placeholders of a locale template with text or
 * elements, so a translated sentence can keep a link or an emphasized
 * word wherever its language puts it. Unknown placeholders stay as written.
 */
export function fillNodes(template: string, values: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    return key !== undefined && key in values ? <Fragment key={i}>{values[key]}</Fragment> : part;
  });
}
