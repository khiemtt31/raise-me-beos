type View = 'hero' | 'about';

const page = document.querySelector<HTMLElement>('.site-shell');
const aboutLink = document.querySelector<HTMLAnchorElement>('.nav-container__link');

if (page) {
	document.documentElement.classList.add('has-js');

	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const transitionDuration = reduceMotion ? 0 : 900;
	let currentView: View = window.location.hash === '#about-me' ? 'about' : 'hero';
	let transitionLocked = false;

	const updateNavigationState = () => {
		if (currentView === 'about') {
			aboutLink?.setAttribute('aria-current', 'page');
		} else {
			aboutLink?.removeAttribute('aria-current');
		}
	};

	const setView = (nextView: View, updateUrl = true) => {
		if (nextView === currentView) return;

		currentView = nextView;
		page.dataset.view = nextView;
		updateNavigationState();

		if (updateUrl) {
			const nextUrl = nextView === 'about'
				? '#about-me'
				: `${window.location.pathname}${window.location.search}`;
			history.pushState(null, '', nextUrl);
		}

		transitionLocked = true;
		window.setTimeout(() => {
			transitionLocked = false;
		}, transitionDuration);
	};

	page.dataset.view = currentView;
	updateNavigationState();

	aboutLink?.addEventListener('click', (event) => {
		event.preventDefault();
		setView('about');
	});

	const syncViewWithUrl = () => {
		setView(window.location.hash === '#about-me' ? 'about' : 'hero', false);
	};

	window.addEventListener('hashchange', syncViewWithUrl);
	window.addEventListener('popstate', syncViewWithUrl);

	window.addEventListener(
		'wheel',
		(event) => {
			event.preventDefault();

			if (transitionLocked || Math.abs(event.deltaY) < 12) return;
			setView(event.deltaY > 0 ? 'about' : 'hero');
		},
		{ passive: false },
	);

	window.addEventListener('keydown', (event) => {
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

		const nextView: View | null = ['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)
			? 'about'
			: ['ArrowUp', 'PageUp', 'Home'].includes(event.key)
				? 'hero'
				: null;

		if (!nextView || transitionLocked) return;

		event.preventDefault();
		setView(nextView);
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
			setView(distance > 0 ? 'about' : 'hero');
		},
		{ passive: true },
	);
}
