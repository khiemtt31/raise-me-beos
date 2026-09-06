import { spawn, spawnSync } from 'node:child_process';

const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const build = spawnSync(packageManager, ['build'], { stdio: 'inherit' });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status ?? 1);

const processes = [
	spawn(packageManager, ['run', 'dev:worker'], { stdio: 'inherit' }),
	spawn(packageManager, ['run', 'dev:astro'], {
		stdio: 'inherit',
		env: { ...process.env, ASTRO_DEV_BACKGROUND: '0' },
	}),
];

let stopping = false;

const stop = (code = 0) => {
	if (stopping) return;
	stopping = true;
	for (const child of processes) child.kill('SIGTERM');
	process.exitCode = code;
};

for (const child of processes) {
	child.on('error', error => {
		console.error(error);
		stop(1);
	});
	child.on('exit', (code, signal) => {
		if (!stopping) {
			console.error(`Development server stopped (${signal ?? `exit ${code ?? 1}`}).`);
			stop(code ?? 1);
		}
	});
}

process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
