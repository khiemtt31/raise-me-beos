import { AboutSection } from "@/components/about/AboutSection";
import { CareerSection } from "@/components/career/CareerSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { StaticHero } from "@/components/hero/StaticHero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <StaticHero />
        <ProjectsSection />
        <CareerSection />
        <AboutSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
