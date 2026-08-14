import { career } from "@/content/career";

export function CareerSection() {
  return (
    <section className="section section--experience" id="experience" aria-labelledby="experience-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">03 / Experience</p>
          <h2 id="experience-title">A record of useful momentum.</h2>
        </div>
        <p>Selected experience across product engineering, systems, and delivery.</p>
      </div>
      <div className="experience-list">
        {career.map((entry, index) => (
          <article className="experience-chapter" key={entry.company + "-" + entry.period}>
            <div className="experience-chapter__marker">
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{entry.period}</span>
            </div>
            <div className="experience-chapter__body">
              <div className="experience-chapter__heading">
                <div>
                  <h3>{entry.company}</h3>
                  <p className="experience-chapter__role">{entry.position}</p>
                </div>
                {entry.current ? <span className="experience-chapter__status">Current</span> : null}
              </div>
              <p className="experience-chapter__profile">{entry.companyProfile}</p>
              <p>{entry.summary}</p>
              <ul className="tag-list" aria-label={entry.company + " skills"}>
                {entry.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
