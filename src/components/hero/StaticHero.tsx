import Image from "next/image";

import { profile } from "@/content/profile";

export function StaticHero() {
  return (
    <section className="hero section" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow">01 / Introduction</p>
        <h1 id="hero-title">{profile.name}</h1>
        <p className="hero__role">{profile.role}</p>
        <p className="hero__intro">{profile.intro}</p>
        <p className="hero__quote">“{profile.quote}”</p>
        <div className="hero__actions">
          <a className="text-link text-link--primary" href="#work">
            View selected work <span aria-hidden="true">↘</span>
          </a>
          <a className="text-link" href="#contact">
            Start a conversation <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
      <figure className="hero__visual">
        <Image
          src={profile.heroImage.src}
          alt={profile.heroImage.alt}
          width={profile.heroImage.width}
          height={profile.heroImage.height}
          priority
          sizes="(max-width: 760px) 100vw, (max-width: 1200px) 46vw, 34rem"
        />
        <figcaption>
          <span>Portrait study</span>
          <span aria-hidden="true">/</span>
          <span>Static composition</span>
        </figcaption>
      </figure>
    </section>
  );
}
