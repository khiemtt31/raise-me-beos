import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Astro can inline small bundles. Catch that before shipping a CSP that blocks them.
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
for (const [, attributes, content] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  assert.match(attributes, /\bsrc="\//, 'Built scripts must load from the same origin');
  assert.equal(content.trim(), '', 'Built scripts must not contain inline code');
}
assert.doesNotMatch(html, /<style\b/i, 'Built styles must be external');
assert.doesNotMatch(html, /<[^>]+\s(?:style|on\w+)\s*=/i, 'Inline styles/handlers conflict with CSP');
assert.equal(
  await readFile(new URL('../dist/_headers', import.meta.url), 'utf8'),
  await readFile(new URL('../public/_headers', import.meta.url), 'utf8'),
  'Built security headers must match source',
);
console.log('Built assets are compatible with the external-only script/style policy.');
