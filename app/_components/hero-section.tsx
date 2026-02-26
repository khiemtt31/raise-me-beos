import Image from 'next/image'
import { FaInstagram, FaFacebook, FaLinkedin, FaGithub } from 'react-icons/fa'

import { useTranslations } from 'next-intl'
import { getHeroContent } from '@/skeleton-data/portfolio'

export function HeroSection() {
  const t = useTranslations()
  const heroContent = getHeroContent(t)

  return (
    <section
      id="hero"
      data-section="hero"
      data-sphere
      className="sphere-section grid h-full min-h-0 items-start gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12"
    >
      <div data-reveal className="reveal space-y-6 max-w-2xl md:space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
          {heroContent.pill}
        </div>
        <h1 className="text-[clamp(2rem,4vw,3.75rem)] font-heading leading-tight text-glow">
          {heroContent.title}
        </h1>
        <p className="text-[clamp(0.95rem,1.6vw,1.125rem)] text-[var(--hero-muted)] text-justify">
          {heroContent.subtitle}
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://www.instagram.com/hanzo_hekim/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#E1306C]"
          >
            <FaInstagram size={28} style={{ color: '#E1306C' }} />
          </a>
          <a
            href="https://www.facebook.com/khiem.tran.16718979"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#1877F2]"
          >
            <FaFacebook size={28} style={{ color: '#1877F2' }} />
          </a>
          <a
            href="https://www.linkedin.com/in/khiem-hanzo-tran/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#0A66C2]"
          >
            <FaLinkedin size={28} style={{ color: '#0A66C2' }} />
          </a>
          <a
            href="https://github.com/khiemtt31"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#c9d1d9]"
          >
            <FaGithub size={28} style={{ color: '#c9d1d9' }} />
          </a>
        </div>
      </div>
      <div
        data-reveal
        className="reveal relative h-[clamp(14rem,40vw,24rem)] w-full"
      >
        {/* Cat - Bottom Left */}
        <div className="absolute bottom-0 left-0 z-10 rounded-3xl overflow-hidden w-[clamp(7.5rem,18vw,12rem)] h-[clamp(7.5rem,18vw,12rem)] -rotate-12">
          <Image
            src="/cat.png"
            alt="Cat"
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Dog - Middle Right */}
        <div className="absolute top-1/2 right-0 z-20 rounded-3xl overflow-hidden w-[clamp(9rem,22vw,14rem)] h-[clamp(9rem,22vw,14rem)] rotate-6">
          <Image
            src="/dog.png"
            alt="Dog"
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Me-Dog - Top Left (Highlighted) */}
        <div className="absolute top-0 left-1/4 z-30 rounded-3xl overflow-hidden w-[clamp(10rem,26vw,16rem)] h-[clamp(10rem,26vw,16rem)] -rotate-3 shadow-2xl">
          <Image
            src="/me-dog.png"
            alt={t('HOME.IMAGE.ALT.001')}
            width={600}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
