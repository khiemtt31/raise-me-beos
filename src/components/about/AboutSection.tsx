import Image from "next/image";

import { aboutContent } from "@/content/about";

export function AboutSection() {
  return (
    <section className="section section--about" id="about" aria-labelledby="about-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">04 / Profile</p>
          <h2 id="about-title">{aboutContent.title}</h2>
        </div>
        <p>{aboutContent.lede}</p>
      </div>
      <div className="about-layout">
        <div className="about-copy">
          <div className="about-block">
            <p className="micro-label">Engineering identity</p>
            <div className="identity-list">
              {aboutContent.skills.map((skill) => (
                <article className="identity-item" key={skill.title}>
                  <h3>{skill.title}</h3>
                  <p>{skill.copy}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="about-block about-block--principles">
            <p className="micro-label">Working principles</p>
            <ol className="principle-list" aria-label="Working principles">
              {aboutContent.principles.map((principle, index) => (
                <li key={principle}><span>{String(index + 1).padStart(2, "0")}</span><strong>{principle}</strong></li>
              ))}
            </ol>
          </div>
          <div className="about-block about-block--interests">
            <p className="micro-label">Personal / interests</p>
            <ul className="interest-list" aria-label="Interests">
              {aboutContent.hobbies.map((hobby) => (
                <li key={hobby.label}><strong>{hobby.label}</strong><span>{hobby.note}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="about-gallery" aria-label="Profile imagery">
          {aboutContent.images.map((image, index) => (
            <figure className={index === 0 ? "about-gallery__feature" : "about-gallery__detail"} key={image.src}>
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 760px) calc(100vw - 2 * var(--gutter)), 40vw" />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
