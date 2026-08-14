import Image from "next/image";

import { projects } from "@/content/projects";

export function ProjectsSection() {
  return (
    <section className="section section--work" id="work" aria-labelledby="projects-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">02 / Selected work</p>
          <h2 id="projects-title">Projects with a point of view.</h2>
        </div>
        <p>Evidence from systems, products, experiments, and tools built across different environments.</p>
      </div>
      <div className="project-list">
        {projects.map((project, index) => {
          const image = project.images[0];
          return (
            <article className="project-feature" key={project.id}>
              <div className="project-feature__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              {image ? (
                <figure className="project-feature__visual">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 760px) calc(100vw - 2 * var(--gutter)), (max-width: 1200px) 48vw, 38rem"
                  />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ) : null}
              <div className="project-feature__body">
                <div className="project-feature__meta"><span>{project.year}</span><span>{project.status}</span></div>
                <h3>{project.title}</h3>
                <p className="project-feature__role">{project.role}</p>
                <p>{project.purpose}</p>
                <p className="project-feature__detail">{project.detailSummary}</p>
                <ul className="tag-list" aria-label={project.title + " technology stack"}>
                  {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
