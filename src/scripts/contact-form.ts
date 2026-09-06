const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (contactForm) {
	type StatusState = 'success' | 'warning' | 'error' | '';

	class ContactRequestError extends Error {
		status: number;
		constructor(message: string, status: number) {
			super(message);
			this.status = status;
		}
	}

	let submitting = false;
	const submitButton = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');
	const status = contactForm.querySelector<HTMLElement>('[data-contact-status]');

	const setStatus = (message: string, state: StatusState) => {
		if (!status) return;
		status.textContent = message;
		status.hidden = !message;
		if (state) {
			status.dataset.state = state;
		} else {
			delete status.dataset.state;
		}
	};

	const responseMessage = async (response: Response): Promise<string> => {
		const body = await response.text().catch(() => '');
		if (body) {
			try {
				const parsed: unknown = JSON.parse(body);
				if (parsed && typeof parsed === 'object' && 'message' in parsed && typeof parsed.message === 'string') {
					return parsed.message;
				}
			} catch {
				return body.trim();
			}
		}

		if (response.status === 429) return 'The weekly message limit has been reached. Please try again next week.';
		if (response.status === 502) return 'Email delivery is temporarily unavailable. Please try again later.';
		if (response.status === 503) return 'Contact is temporarily unavailable. Please try again later.';
		return 'The message could not be sent. Please try again later.';
	};

	contactForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		if (submitting || !contactForm.reportValidity()) return;

		const formData = new FormData(contactForm);
		const payload = {
			name: formData.get('name'),
			email: formData.get('email'),
			message: formData.get('message'),
		};

		submitting = true;
		if (submitButton) submitButton.disabled = true;
		setStatus('Sending…', '');

		try {
			const response = await fetch(contactForm.action, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				throw new ContactRequestError(await responseMessage(response), response.status);
			}

			const message = await responseMessage(response);
			contactForm.reset();
			setStatus(message || 'Message sent. I’ll get back to you soon.', 'success');
		} catch (error) {
			const message = error instanceof Error
				? error.message
				: 'The message could not be sent. Please email me directly.';
			setStatus(message, error instanceof ContactRequestError && error.status === 429 ? 'warning' : 'error');
		} finally {
			submitting = false;
			if (submitButton) submitButton.disabled = false;
		}
	});
}
