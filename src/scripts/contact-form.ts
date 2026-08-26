const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (contactForm) {
	const submitButton = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');
	const status = contactForm.querySelector<HTMLElement>('[data-contact-status]');

	const setStatus = (message: string, state: 'success' | 'error' | '') => {
		if (!status) return;
		status.textContent = message;
		if (state) {
			status.dataset.state = state;
		} else {
			delete status.dataset.state;
		}
	};

	contactForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (!contactForm.reportValidity()) return;

		const formData = new FormData(contactForm);
		const payload = {
			name: formData.get('name'),
			email: formData.get('email'),
			message: formData.get('message'),
		};

		if (submitButton) submitButton.disabled = true;
		setStatus('Sending…', '');

		try {
			const response = await fetch(contactForm.action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			const result = await response.json().catch(() => ({}));

			if (!response.ok) {
				throw new Error(result.message || 'The message could not be sent.');
			}

			contactForm.reset();
			setStatus(result.message || 'Message sent. I’ll get back to you soon.', 'success');
		} catch (error) {
			const message = error instanceof Error
				? error.message
				: 'The message could not be sent. Please email me directly.';
			setStatus(message, 'error');
		} finally {
			if (submitButton) submitButton.disabled = false;
		}
	});
}
