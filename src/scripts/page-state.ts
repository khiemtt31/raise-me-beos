type View = 'hero' | 'about' | 'contacts';

const page = document.querySelector<HTMLElement>('.site-shell');
const viewLinks = {
	about: document.querySelector<HTMLAnchorElement>('[data-view-link="about"]'),
	contacts: document.querySelector<HTMLAnchorElement>('[data-view-link="contacts"]'),
};

if (page) {
	document.documentElement.classList.add('has-js');

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const transitionDuration = reduceMotion ? 0 : 900;
	const viewFromHash = (): View => {
		const hash = window.location.hash.toLowerCase();
		if (hash === '#about-me' || hash === '#aboutme') return 'about';
		if (hash === '#contacts') return 'contacts';
		return 'hero';
	};

	let currentView: View = viewFromHash();
	let transitionLocked = false;

	const updateNavigationState = () => {
		for (const [view, link] of Object.entries(viewLinks)) {
			if (!link) continue;
			if (view === currentView) {
				link.setAttribute('aria-current', 'page');
			} else {
				link.removeAttribute('aria-current');
			}
		}
	};

	const setView = (nextView: View, updateUrl = true) => {
		if (nextView === currentView) return;

		currentView = nextView;
		page.dataset.view = nextView;
		updateNavigationState();

		if (updateUrl) {
			const nextUrl = nextView === 'hero'
				? `${window.location.pathname}${window.location.search}`
				: nextView === 'about' ? '#about-me' : '#contacts';
			history.pushState(null, '', nextUrl);
		}

		transitionLocked = true;
		window.setTimeout(() => {
			transitionLocked = false;
		}, transitionDuration);
	};

	const moveView = (direction: 1 | -1) => {
		const views: View[] = ['hero', 'about', 'contacts'];
		const nextIndex = Math.max(0, Math.min(views.length - 1, views.indexOf(currentView) + direction));
		setView(views[nextIndex]);
	};

	const preservesNativeKeyboardBehavior = (target: EventTarget | null): boolean => {
		if (!(target instanceof HTMLElement)) return false;
		return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName);
	};

	page.dataset.view = currentView;
	updateNavigationState();

	for (const [view, link] of Object.entries(viewLinks) as Array<[View, HTMLAnchorElement | null]>) {
		link?.addEventListener('click', (event) => {
			event.preventDefault();
			setView(view);
		});
	}

	const syncViewWithUrl = () => {
		const nextView = viewFromHash();

		if (nextView === currentView) {
			page.dataset.view = nextView;
			updateNavigationState();
			return;
		}

		setView(nextView, false);
	};

	window.addEventListener('hashchange', syncViewWithUrl);
	window.addEventListener('popstate', syncViewWithUrl);

	window.addEventListener(
		'wheel',
		(event) => {
			event.preventDefault();

			if (transitionLocked || Math.abs(event.deltaY) < 12) return;
			moveView(event.deltaY > 0 ? 1 : -1);
		},
		{ passive: false },
	);

	window.addEventListener('keydown', (event) => {
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
		if (preservesNativeKeyboardBehavior(event.target)) return;

		if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
			event.preventDefault();
			if (!transitionLocked) moveView(1);
		}

		if (['ArrowUp', 'PageUp'].includes(event.key)) {
			event.preventDefault();
			if (!transitionLocked) moveView(-1);
		}

		if (event.key === 'Home') {
			event.preventDefault();
			if (!transitionLocked) setView('hero');
		}

		if (event.key === 'End') {
			event.preventDefault();
			if (!transitionLocked) setView('contacts');
		}
	});

	let touchStartY = 0;

	window.addEventListener(
		'touchstart',
		(event) => {
			touchStartY = event.changedTouches[0]?.clientY ?? 0;
		},
		{ passive: true },
	);

	window.addEventListener(
		'touchend',
		(event) => {
			if (transitionLocked) return;

			const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY;
			const distance = touchStartY - touchEndY;

			if (Math.abs(distance) < 50) return;
			moveView(distance > 0 ? 1 : -1);
		},
		{ passive: true },
	);
}
