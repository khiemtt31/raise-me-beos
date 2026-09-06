import assert from 'node:assert/strict';
import { test } from 'node:test';

test('contact client shows the quota message as a warning toast', async t => {
  const status = { textContent: '', hidden: true, dataset: {} };
  const button = { disabled: false };
  let submitHandler;
  let response = Response.json({
    message: 'The weekly message limit has been reached. Please try again next week.',
  }, { status: 429 });

  const form = {
    action: '/api/contact',
    addEventListener: (event, handler) => { if (event === 'submit') submitHandler = handler; },
    querySelector: selector => selector === '[data-contact-status]' ? status : button,
    reportValidity: () => true,
    reset: () => {},
  };
  const previousDocument = globalThis.document;
  const previousFormData = globalThis.FormData;
  const previousFetch = globalThis.fetch;
  globalThis.document = { querySelector: () => form };
  globalThis.FormData = class {
    get(field) {
      return { name: 'Visitor', email: 'visitor@example.com', message: 'Hello' }[field];
    }
  };
  globalThis.fetch = async () => response;
  t.after(() => {
    globalThis.document = previousDocument;
    globalThis.FormData = previousFormData;
    globalThis.fetch = previousFetch;
  });

  await import(`../src/scripts/contact-form.ts?client-test=${Date.now()}`);
  await submitHandler({ preventDefault: () => {} });

  assert.equal(status.hidden, false);
  assert.equal(status.textContent, 'The weekly message limit has been reached. Please try again next week.');
  assert.equal(status.dataset.state, 'warning');
  assert.equal(button.disabled, false);

  response = Response.json({ message: 'The message could not be sent. Please try again later.' }, { status: 502 });
  await submitHandler({ preventDefault: () => {} });
  assert.equal(status.textContent, 'The message could not be sent. Please try again later.');
  assert.equal(status.dataset.state, 'error');
});
