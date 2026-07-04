"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const media = {
  logo: "https://paralleluniverse.com.ua/wp-content/uploads/2025/06/logo.svg",
  gear1: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/gear1.png",
  gear2: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/gear2.png",
  gear3: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/gear3.png",
  heroVideo1: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/video1.mp4",
  heroVideo2: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/video2.mp4",
  heroMain: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/main1.png",
  heroLines: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/lines.png",
  heroPortal: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/portal.png",
  planetVideo: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/video3.mp4",
  planetLines: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/lines2.png",
  planet1: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/planet1.png",
  planet2: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/planet2.png",
  planet3: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/planet3.png",
  planet4: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/planet4.png",
  casesVideo: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/video4.mp4",
  case1: "https://paralleluniverse.com.ua/wp-content/uploads/2021/03/e1.jpg",
  case2: "https://paralleluniverse.com.ua/wp-content/uploads/2024/02/rsh-24408.jpg",
  case3: "https://paralleluniverse.com.ua/wp-content/uploads/2024/02/rsh-24247.jpg",
  case4: "https://paralleluniverse.com.ua/wp-content/uploads/2024/02/rsh-24470.jpg",
  case5: "https://paralleluniverse.com.ua/wp-content/uploads/2024/03/rsh-24501.jpg",
  case6: "https://paralleluniverse.com.ua/wp-content/uploads/2024/03/rsh-24361.jpg",
  case7: "https://paralleluniverse.com.ua/wp-content/uploads/2024/04/rsh-24488.jpg",
  mount1: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/mount1.png",
  mount2: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/mount2.png",
  about1: "https://paralleluniverse.com.ua/wp-content/uploads/2025/06/w1.jpg",
  about2: "https://paralleluniverse.com.ua/wp-content/uploads/2025/06/w2.jpg",
  about3: "https://paralleluniverse.com.ua/wp-content/uploads/2025/06/w3.jpg",
  footerBg: "https://paralleluniverse.com.ua/wp-content/themes/e-parallel-smooth/images/footer2.png",
  sound: "https://paralleluniverse.com.ua/wp-content/uploads/2025/06/sound.mp3",
} as const;

const navLinks = [
  { label: "About the universe", href: "#top" },
  { label: "Author's works", href: "#works" },
  { label: "About the author", href: "#about" },
  { label: "Events", href: "#events" },
];

const cases = [
  {
    number: "[01]",
    name: "TOGETHER",
    date: "23.03.2021",
    href: "#",
    image: media.case1,
  },
  {
    number: "[02]",
    name: "EVEREST",
    date: "04.02.2024",
    href: "#",
    image: media.case2,
  },
  {
    number: "[03]",
    name: "BLUE HOLE",
    date: "10.02.2024",
    href: "#",
    image: media.case3,
  },
  {
    number: "[04]",
    name: "TIME FLIES",
    date: "24.02.2024",
    href: "#",
    image: media.case4,
  },
  {
    number: "[05]",
    name: "BEE VS FLY",
    date: "12.03.2024",
    href: "#",
    image: media.case5,
  },
  {
    number: "[06]",
    name: "PHARAOHS",
    date: "31.03.2024",
    href: "#",
    image: media.case6,
  },
  {
    number: "[07]",
    name: "SISYPHUS CHOICE",
    date: "14.04.2024",
    href: "#",
    image: media.case7,
  },
] as const;

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/parallel.art.universe?igsh=MTh4enVhanN4NmsyZg%3D%3D&utm_source=qr" },
  { label: "Facebook", href: "https://www.facebook.com/share/1AjUjf9v1Y/?mibextid=wwXIfr" },
] as const;

const aboutPhotos = [media.about1, media.about2, media.about3] as const;

function useRevealObserver() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);
}

function usePreloader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = ready ? previous : "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [ready]);

  return [ready, setReady] as const;
}

function MenuGlyph({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SoundGlyph({ active }: { active: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M5 15V9h4l5-4v14l-5-4H5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17 9c1.2 1.2 1.2 4.8 0 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M19.5 6.5c2.6 2.6 2.6 8.4 0 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M5 15V9h4l5-4v14l-5-4H5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M7 17L17 7M11 7h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      data-reveal
      className={`reveal ${align === "center" ? "mx-auto max-w-4xl text-center" : "max-w-4xl text-left"}`}
    >
      <p className="text-[10px] uppercase tracking-[0.55em] text-[var(--muted)]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,4.9rem)] leading-[0.92] text-[var(--foreground)]">
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-[clamp(0.95rem,1.55vw,1.08rem)] leading-8 text-[var(--muted)] ${align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

function Preloader({ ready, onEnter }: { ready: boolean; onEnter: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(25,21,16,0.98),rgba(7,6,5,0.99))] transition-all duration-700 ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}
      aria-hidden={ready}
    >
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(231,220,199,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(231,220,199,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative flex flex-col items-center gap-8 px-4 text-center">
        <div className="flex items-end justify-center gap-3 sm:gap-5">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 animate-[spin_14s_linear_infinite]">
            <Image src={media.gear2} alt="" fill sizes="96px" className="object-contain" priority />
          </div>
          <button
            type="button"
            onClick={onEnter}
            className="group relative grid h-40 w-40 place-items-center rounded-full border border-[rgba(231,220,199,0.45)] bg-[rgba(17,14,11,0.65)] text-[var(--foreground)] shadow-[0_0_0_1px_rgba(231,220,199,0.12),0_0_60px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-[1.02]"
          >
            <span className="absolute inset-0 rounded-full border border-[rgba(231,220,199,0.25)] animate-[spin_18s_linear_infinite]" />
            <span className="absolute inset-4 rounded-full border border-[rgba(231,220,199,0.12)] animate-[spin_8s_linear_infinite_reverse]" />
            <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(231,220,199,0.08),transparent_65%)] opacity-80" />
            <span className="relative max-w-[9rem] text-[10px] uppercase tracking-[0.55em] text-[var(--accent)] sm:text-[11px]">
              enter the universe
            </span>
          </button>
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 animate-[spin_11s_linear_infinite_reverse]">
            <Image src={media.gear3} alt="" fill sizes="96px" className="object-contain" priority />
          </div>
        </div>
        <div className="relative h-14 w-14 animate-[spin_10s_linear_infinite]">
          <Image src={media.gear1} alt="" fill sizes="56px" className="object-contain" priority />
        </div>
        <p className="text-[10px] uppercase tracking-[0.55em] text-[var(--muted)]">
          loading the portal
        </p>
      </div>
    </div>
  );
}

function Header({
  menuOpen,
  onMenuToggle,
  soundOn,
  onSoundToggle,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  soundOn: boolean;
  onSoundToggle: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border)] bg-[rgba(11,9,7,0.84)] backdrop-blur-2xl">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="#top" className="flex items-center gap-3 text-[var(--foreground)]">
          <Image src={media.logo} alt="Parallel universe" width={160} height={44} priority className="h-9 w-auto sm:h-10" />
        </Link>

        <nav className="hidden items-center gap-7 xl:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.42em] text-[var(--muted)] transition-colors duration-200 hover:text-[var(--foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#contacts"
            className="hidden rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-[var(--muted)] transition-colors duration-200 hover:border-[var(--border-strong)] hover:text-[var(--foreground)] sm:inline-flex"
          >
            Contacts
          </Link>
          <button
            type="button"
            className="hidden rounded-full border border-[var(--border)] px-3 py-2 text-[10px] uppercase tracking-[0.45em] text-[var(--foreground)] sm:inline-flex"
            aria-label="English"
          >
            EN
          </button>
          <button
            type="button"
            className="hidden rounded-full border border-[var(--border)] px-3 py-2 text-[10px] uppercase tracking-[0.45em] text-[var(--muted)] sm:inline-flex"
            aria-label="Ukrainian"
          >
            UK
          </button>
          <button
            type="button"
            onClick={onSoundToggle}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-[10px] uppercase tracking-[0.35em] text-[var(--foreground)] transition-colors duration-200 hover:border-[var(--border-strong)]"
            aria-pressed={soundOn}
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
          >
            <SoundGlyph active={soundOn} />
            <span className="hidden md:inline">{soundOn ? "Sound on" : "Sound"}</span>
          </button>
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-3 text-[var(--foreground)] transition-colors duration-200 hover:border-[var(--border-strong)] xl:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <MenuGlyph open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden border-t border-[var(--border)] bg-[rgba(11,9,7,0.95)]">
          <div className="container-shell py-6">
            <div className="grid gap-4 text-center">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl border border-[var(--border)] px-4 py-4 text-[11px] uppercase tracking-[0.45em] text-[var(--foreground)]"
                  onClick={onMenuToggle}
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid gap-3 sm:grid-cols-2">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl border border-[var(--border)] px-4 py-4 text-[11px] uppercase tracking-[0.35em] text-[var(--muted)]"
                  >
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CaseCard({
  number,
  name,
  date,
  image,
  href,
  compact = false,
}: {
  number: string;
  name: string;
  date: string;
  image: string;
  href: string;
  compact?: boolean;
}) {
  return (
    <a
      href={href}
      className={`group block overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[rgba(18,15,11,0.9)] transition-transform duration-300 hover:-translate-y-1 ${compact ? "" : "sm:col-span-2"}`}
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[4/3]" : "aspect-[16/11]"}`}>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(11,9,7,0.68))]" />
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[var(--muted)]">{number}</span>
          <span className="uppercase tracking-[0.32em] text-[var(--foreground)]">{name}</span>
        </div>
        <span className="text-[11px] text-[var(--muted)]">{"// "}{date}</span>
      </div>
    </a>
  );
}

export default function Home() {
  const [ready, setReady] = usePreloader();
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useRevealObserver();

  useEffect(() => {
    if (soundOn) {
      audioRef.current?.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  }, [soundOn]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="noise" />
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(231,220,199,0.08),transparent_38%),linear-gradient(180deg,#0c0b0a_0%,#090806_28%,#090806_60%,#120f0b_100%)]" />
      <div className="fixed inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,rgba(231,220,199,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(231,220,199,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />

      <Preloader ready={ready} onEnter={() => setReady(true)} />
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
        soundOn={soundOn}
        onSoundToggle={() => setSoundOn((value) => !value)}
      />

      <main className={`relative transition-[filter,opacity] duration-700 ${ready ? "opacity-100 blur-0" : "opacity-70 blur-sm"}`}>
        <section id="top" className="min-h-[100svh] pt-28 lg:pt-32">
          <div className="container-shell grid min-h-[calc(100svh-7rem)] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div data-reveal className="reveal space-y-8">
              <p className="text-[10px] uppercase tracking-[0.55em] text-[var(--muted)]">About the universe</p>
              <div className="space-y-5">
                <h1 className="font-display text-[clamp(4.2rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-[var(--foreground)]">
                  Parallel <span className="text-[#d9cfb6]">universe</span>
                </h1>
                <div className="text-[clamp(0.95rem,1.6vw,1.15rem)] uppercase tracking-[0.48em] text-[var(--muted-strong)]">
                  Ihor Yaskevych
                </div>
              </div>
              <p className="max-w-xl text-[clamp(1rem,1.6vw,1.2rem)] leading-8 text-[var(--muted)]">
                A steampunk and readymade art project built as a portal into alternate realities, sculptural stories, and deeply personal quests.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#works"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--accent)] px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-[var(--background)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Explore works <ArrowGlyph />
                </Link>
                <Link
                  href="#contacts"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-transparent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-[var(--foreground)] transition-colors duration-300 hover:border-[var(--border-strong)]"
                >
                  Contacts <ArrowGlyph />
                </Link>
              </div>
            </div>

            <div data-reveal className="reveal relative h-[34rem] lg:h-[42rem]">
              <div className="absolute inset-0 overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[rgba(18,15,12,0.68)] shadow-[0_30px_120px_rgba(0,0,0,0.38)]">
                <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-85">
                  <source src={media.heroVideo1} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_30%),linear-gradient(180deg,rgba(9,8,6,0.12),rgba(9,8,6,0.75))]" />
                <Image src={media.heroMain} alt="Main artwork" fill priority className="object-cover opacity-70 mix-blend-screen" />
                <Image src={media.heroLines} alt="Decorative lines" fill className="object-cover opacity-55" />
                <div className="absolute inset-0 p-4 sm:p-6">
                  <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-[rgba(231,220,199,0.08)]">
                    <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-30">
                      <source src={media.heroVideo2} type="video/mp4" />
                    </video>
                    <Image src={media.heroPortal} alt="Portal overlay" fill className="object-contain p-6 opacity-70" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(231,220,199,0.08),transparent_55%)]" />
                    <div className="absolute left-5 top-5 rounded-full border border-[var(--border)] bg-[rgba(9,8,6,0.35)] px-3 py-2 text-[10px] uppercase tracking-[0.45em] text-[var(--muted)]">
                      [ 01 ]
                    </div>
                    <div className="absolute bottom-5 left-5 max-w-[18rem] rounded-[1.25rem] border border-[var(--border)] bg-[rgba(9,8,6,0.55)] p-4 text-sm leading-7 text-[var(--muted)]">
                      The universe is a layered machine of memory, motion, and light.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="universe" className="py-20 lg:py-28">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Signal story"
              title="An original art project in the sculpture genre, combining steampunk and readymade styles"
              description="I created unique sculptures, each of which is a philosophical dialogue about the flow of time, the meaning of life, human choice, and inner transformation."
            />

            <div data-reveal className="reveal mt-12 relative">
              <div className="relative mx-auto max-w-[74rem] overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[rgba(16,13,10,0.72)] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.4)] lg:p-8">
                <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-55">
                  <source src={media.planetVideo} type="video/mp4" />
                </video>
                <Image src={media.planetLines} alt="Lines" fill className="object-cover opacity-60" />
                <div className="relative aspect-[16/10] min-h-[28rem] overflow-hidden rounded-[1.75rem] border border-[rgba(231,220,199,0.08)] bg-[radial-gradient(circle_at_center,rgba(231,220,199,0.14),transparent_40%),linear-gradient(180deg,rgba(8,7,6,0.2),rgba(8,7,6,0.65))]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[18rem] w-[18rem] rounded-full border border-[rgba(231,220,199,0.15)] bg-[rgba(7,6,5,0.3)] shadow-[0_0_0_1px_rgba(231,220,199,0.08),0_0_90px_rgba(231,220,199,0.08)] sm:h-[22rem] sm:w-[22rem]">
                      <video autoPlay loop muted playsInline className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] rounded-full object-cover opacity-70">
                        <source src={media.planetVideo} type="video/mp4" />
                      </video>
                    </div>
                  </div>

                  <div className="absolute left-5 top-8 max-w-[11rem] text-[0.9rem] uppercase leading-6 tracking-[0.25em] text-[var(--foreground)] sm:left-8 sm:top-10 sm:max-w-[14rem] sm:text-[1rem]">
                    This is not just art
                  </div>
                  <div className="absolute right-5 bottom-8 max-w-[11rem] text-right text-[0.9rem] uppercase leading-6 tracking-[0.25em] text-[var(--foreground)] sm:right-8 sm:bottom-10 sm:max-w-[14rem] sm:text-[1rem]">
                    This is a mirror of yourself.
                  </div>

                  {[
                    { src: media.planet1, className: "left-5 top-8 h-28 w-28 sm:h-36 sm:w-36" },
                    { src: media.planet2, className: "right-8 top-1/2 h-32 w-32 -translate-y-1/2 sm:h-40 sm:w-40" },
                    { src: media.planet3, className: "left-1/3 bottom-6 h-24 w-24 sm:h-32 sm:w-32" },
                    { src: media.planet4, className: "right-1/4 bottom-4 h-24 w-24 sm:h-32 sm:w-32" },
                  ].map((planet, index) => (
                    <Image
                      key={`${planet.src}-${index}`}
                      src={planet.src}
                      alt=""
                      width={320}
                      height={320}
                      className={`absolute object-contain opacity-90 drop-shadow-[0_0_24px_rgba(231,220,199,0.14)] ${planet.className}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="works" className="py-20 lg:py-28">
          <div className="container-shell">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
              <div data-reveal className="reveal">
                <div className="panel-strong overflow-hidden rounded-[2.25rem]">
                  <video autoPlay loop muted playsInline className="h-full min-h-[30rem] w-full object-cover opacity-80">
                    <source src={media.casesVideo} type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="space-y-8">
                <SectionHeading
                  eyebrow="Latest works"
                  title="I found my Parallel Universe"
                  description="and ready to share the story of my search with you"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  {cases.map((item, index) => (
                    <div key={item.name} className={index < 2 ? "sm:col-span-2" : ""}>
                      <CaseCard {...item} compact={index >= 2} />
                    </div>
                  ))}
                </div>

                <div className="text-center sm:text-left">
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 border-b border-[var(--border-strong)] pb-1 text-[10px] uppercase tracking-[0.45em] text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)]"
                  >
                    all works of the author <ArrowGlyph />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="py-20 lg:py-28">
          <div className="container-shell">
            <SectionHeading
              eyebrow="Inspiration"
              title="Between the peak and the abyss: the birth of inspiration"
              description="I started creating after realizing my extreme passions, when I visited the summit of Everest (8848 meters) and dived 60 meters into the depths of the sea (Blue Hole)."
              align="center"
            />

            <div data-reveal className="reveal mt-12 overflow-hidden rounded-[2.25rem] border border-[var(--border)] bg-[rgba(15,12,9,0.72)] shadow-[0_30px_120px_rgba(0,0,0,0.4)]">
              <div className="relative min-h-[34rem] overflow-hidden">
                <Image src={media.mount1} alt="Mountain base" fill className="object-cover opacity-80" />
                <Image src={media.mount2} alt="Mountain peak" fill className="object-cover opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(231,220,199,0.12),transparent_42%),linear-gradient(180deg,rgba(9,8,6,0.08),rgba(9,8,6,0.72))]" />
                <div className="absolute inset-x-0 bottom-8 text-center">
                  <h3 className="font-display text-[clamp(1.8rem,3vw,3.5rem)] text-[var(--foreground)]">
                    This is not just a summit.
                  </h3>
                  <p className="mt-3 text-[10px] uppercase tracking-[0.55em] text-[var(--muted)]">
                    It is the moment inspiration wakes up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 lg:py-28">
          <div className="container-shell">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid gap-4 sm:grid-cols-3">
                {aboutPhotos.map((src, index) => (
                  <div key={src} data-reveal className={`reveal overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[rgba(17,13,10,0.8)] ${index === 1 ? "sm:translate-y-8" : index === 2 ? "sm:-translate-y-8" : ""}`}>
                    <div className="relative aspect-[4/5]">
                      <Image src={src} alt="About the author" fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>

              <div data-reveal className="reveal flex flex-col justify-between gap-10">
                <div className="max-w-2xl">
                  <p className="text-[10px] uppercase tracking-[0.55em] text-[var(--muted)]">About the author</p>
                  <h2 className="mt-4 font-display text-[clamp(2.2rem,4vw,4.6rem)] leading-[0.92] text-[var(--foreground)]">
                    Impressions that turned into creativity
                  </h2>
                  <p className="mt-5 text-[clamp(0.95rem,1.55vw,1.08rem)] leading-8 text-[var(--muted)]">
                    It was then that the world opened up before me in completely new dimensions and meanings, and I felt a desire to share my impressions with others. Each of my works is a part of this story, like a small foundation block for building a magnificent structure called MAN OF PLANET EARTH!!!
                  </p>
                </div>

                <Link
                  href="#contacts"
                  className="inline-flex w-fit items-center gap-2 border-b border-[var(--border-strong)] pb-1 text-[10px] uppercase tracking-[0.45em] text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  more about the author <ArrowGlyph />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="contacts" className="relative mt-12 border-t border-[var(--border)] pb-8 pt-20">
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-55">
          <Image src={media.footerBg} alt="Footer background" fill className="object-cover opacity-30" />
          <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-20">
            <source src={media.heroVideo2} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,6,0.4),rgba(9,8,6,0.92))]" />
        </div>

        <div className="container-shell space-y-12">
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
            <div data-reveal className="reveal space-y-5">
              <h2 className="font-display text-[clamp(2.4rem,4.3vw,5.2rem)] leading-[0.9] text-[var(--foreground)]">
                These are not just sculptures
              </h2>
              <h3 className="font-display text-[clamp(1.7rem,3vw,3.2rem)] leading-[0.96] text-[var(--muted-strong)]">
                these are portals to alternate realities
              </h3>
              <p className="max-w-2xl text-[clamp(0.95rem,1.5vw,1.05rem)] leading-8 text-[var(--muted)]">
                Stay up to date with the latest news and upcoming exhibitions
              </p>

              <form
                className="panel flex max-w-2xl flex-col gap-3 rounded-[999px] p-3 sm:flex-row"
                onSubmit={(event) => event.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="enter your email"
                  className="min-w-0 flex-1 rounded-full bg-transparent px-5 py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[rgba(231,220,199,0.45)]"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[var(--accent)] px-7 py-3 text-[10px] uppercase tracking-[0.45em] text-[var(--background)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  subscribe
                </button>
              </form>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-6">
                <Link href="#top" className="block">
                  <Image src={media.logo} alt="Parallel universe" width={180} height={50} className="h-10 w-auto" />
                </Link>
                <nav className="space-y-3 text-[11px] uppercase tracking-[0.38em] text-[var(--muted)]">
                  {navLinks.slice(1).concat({ label: "Contacts", href: "#contacts" }).map((item) => (
                    <div key={item.label}>
                      <Link href={item.href} className="transition-colors duration-200 hover:text-[var(--foreground)]">
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="space-y-5">
                <a href="tel:380970008848" className="block text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)]">
                  +38(097) 000 88 48
                </a>
                <p className="text-[var(--muted)]">Mini Art Gallery<br />Lviv, Teatralna St. 12</p>
                <div className="space-y-2 text-[11px] uppercase tracking-[0.38em] text-[var(--muted)]">
                  {socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="block transition-colors duration-200 hover:text-[var(--foreground)]">
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--border)] pt-6 text-[11px] uppercase tracking-[0.32em] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <div>© 2026 parallel universe by ihor yaskevych</div>
            <div className="text-center">
              <Link href="#" className="transition-colors duration-200 hover:text-[var(--foreground)]">
                Privacy Policy
              </Link>
            </div>
            <div className="sm:text-right">
              <span className="text-[var(--muted)]">Website by </span>
              <a href="https://esfirum.com" target="_blank" rel="noopener noreferrer" className="text-[var(--foreground)] transition-colors duration-200 hover:text-[var(--accent)]">
                esfirum agency
              </a>
            </div>
          </div>
        </div>
      </footer>

      <audio ref={audioRef} loop preload="none">
        <source src={media.sound} type="audio/mpeg" />
      </audio>
    </div>
  );
}
