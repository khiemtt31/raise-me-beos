import { spawn } from "node:child_process";
import { once } from "node:events";

const Origin = "http://127.0.0.1:8787";
const StartupTimeout = 30_000;
const Sleep = (Duration) => new Promise((Resolve) => setTimeout(Resolve, Duration));

const Preview = spawn("opennextjs-cloudflare", ["preview"], {
  detached: process.platform !== "win32",
  env: { ...process.env, NO_COLOR: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});

let PreviewOutput = "";
const CaptureOutput = (Chunk) => {
  PreviewOutput = `${PreviewOutput}${Chunk}`.slice(-20_000);
};

Preview.stdout.on("data", CaptureOutput);
Preview.stderr.on("data", CaptureOutput);

function StopPreview() {
  if (Preview.exitCode !== null) return;

  if (process.platform === "win32") {
    Preview.kill("SIGTERM");
  } else {
    process.kill(-Preview.pid, "SIGTERM");
  }
}

async function WaitForPreview() {
  const Deadline = Date.now() + StartupTimeout;

  while (Date.now() < Deadline) {
    if (Preview.exitCode !== null) {
      throw new Error(`OpenNext preview exited before becoming ready.\n${PreviewOutput}`);
    }

    try {
      const Response = await fetch(Origin);
      if (Response.ok) return Response;
    } catch {
      // The preview server is still starting.
    }

    await Sleep(500);
  }

  throw new Error(`OpenNext preview did not become ready within ${StartupTimeout / 1000} seconds.\n${PreviewOutput}`);
}

try {
  const PageResponse = await WaitForPreview();
  const Html = await PageResponse.text();
  const ImagePreloads = Html.match(/<link(?=[^>]*rel="preload")(?=[^>]*as="image")[^>]*>/g) ?? [];
  const PrimaryImage = Html.match(/<img[^>]*alt="Primary portrait of Hanzo Hekim"[^>]*>/)?.[0];
  const ImageSource = PrimaryImage?.match(/src="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");

  if (ImagePreloads.length !== 1) {
    throw new Error(`Expected exactly one image preload, received ${ImagePreloads.length}.`);
  }

  if (!ImageSource?.startsWith("/_next/image?")) {
    throw new Error("The primary hero image is not using the Next.js image optimizer.");
  }

  const ImageResponse = await fetch(new URL(ImageSource, Origin), {
    headers: { accept: "image/webp,image/*" },
  });
  const ImageBytes = await ImageResponse.arrayBuffer();
  const ContentType = ImageResponse.headers.get("content-type");

  await Sleep(100);

  if (!ImageResponse.ok) {
    throw new Error(`The optimized image request returned HTTP ${ImageResponse.status}.`);
  }

  if (ContentType !== "image/webp") {
    throw new Error(`Expected an image/webp response, received ${ContentType ?? "no content type"}.`);
  }

  if (ImageBytes.byteLength === 0) {
    throw new Error("The optimized image response was empty.");
  }

  if (PreviewOutput.includes("env.IMAGES binding is not defined")) {
    throw new Error("The Cloudflare IMAGES binding is not available to the preview worker.");
  }

  console.log(`Image optimization verified: 1 preload, WebP response, ${ImageBytes.byteLength} bytes.`);
} finally {
  StopPreview();
  if (Preview.exitCode === null) {
    await Promise.race([once(Preview, "exit"), Sleep(5_000)]);
  }
}
