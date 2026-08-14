import { contactContent } from "@/content/social";

export function ContactSection() {
  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">05 / Contact</p>
          <h2 id="contact-title">Let’s build something real.</h2>
        </div>
        <p>{contactContent.lede}</p>
      </div>
      <div className="contact-layout">
        <p className="contact-statement">Good work starts with a clear problem, a careful conversation, and room to make something useful.</p>
        <address className="contact-identity">
          <span className="micro-label">Public contact</span>
          <strong>{contactContent.name}</strong>
          <span>{contactContent.role}</span>
          <a className="contact-email" href={`mailto:${contactContent.email}`}>
            {contactContent.email}
            <span aria-hidden="true">↗</span>
          </a>
        </address>
      </div>
    </section>
  );
}
