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
      <div data-reveal className="reveal space-y-7 max-w-2xl md:space-y-9">

        {/* Luxury pill badge */}
        <div
          className="inline-flex items-center gap-3"
        >
          {/* Decorative lines flanking badge */}
          <span
            className="h-px w-8"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A227)' }}
          />
          <span
            className="inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-[10px] uppercase tracking-[0.4em]"
            style={{
              border: '1px solid rgba(201,162,39,0.4)',
              background: 'rgba(201,162,39,0.06)',
              color: '#C9A227',
              boxShadow: '0 0 16px rgba(255,215,0,0.08), inset 0 0 12px rgba(201,162,39,0.05)',
              fontFamily: 'var(--font-orbitron)',
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: '#FFD700', boxShadow: '0 0 6px #FFD700' }}
            />
            {heroContent.pill}
          </span>
          <span
            className="h-px w-8"
            style={{ background: 'linear-gradient(90deg, #C9A227, transparent)' }}
          />
        </div>

        {/* Main heading */}
        <h1
          className="text-[clamp(2rem,4vw,3.75rem)] font-heading leading-tight"
          style={{
            color: '#F5D862',
            textShadow:
              '0 0 8px rgba(255,215,0,0.4), 0 0 24px rgba(201,162,39,0.25), 0 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {heroContent.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-[clamp(0.95rem,1.6vw,1.125rem)] text-justify leading-relaxed"
          style={{ color: 'rgba(240,192,64,0.60)' }}
        >
          {heroContent.subtitle}
        </p>

        {/* Gold divider */}
        <div
          className="h-px w-24"
          style={{ background: 'linear-gradient(90deg, #FFD700, rgba(201,162,39,0.15))' }}
        />

        {/* Social links */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/hanzo_hekim/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#E1306C]"
          >
            <FaInstagram size={26} style={{ color: 'rgba(240,192,64,0.65)' }} className="hover:color-[#E1306C] transition-all duration-300" />
          </a>
          <a
            href="https://www.facebook.com/khiem.tran.16718979"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#1877F2]"
          >
            <FaFacebook size={26} style={{ color: 'rgba(240,192,64,0.65)' }} />
          </a>
          <a
            href="https://www.linkedin.com/in/khiem-hanzo-tran/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_#0A66C2]"
          >
            <FaLinkedin size={26} style={{ color: 'rgba(240,192,64,0.65)' }} />
          </a>
          <a
            href="https://github.com/khiemtt31"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-all duration-300 ease-out hover:scale-[1.2] hover:drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]"
          >
            <FaGithub size={26} style={{ color: 'rgba(240,192,64,0.65)' }} />
          </a>
        </div>
      </div>

      {/* Image cluster */}
      <div
        data-reveal
        className="reveal relative h-[clamp(14rem,40vw,24rem)] w-full"
      >
        {/* Cat - Bottom Left */}
        <div
          className="absolute bottom-0 left-0 z-10 rounded-3xl overflow-hidden w-[clamp(7.5rem,18vw,12rem)] h-[clamp(7.5rem,18vw,12rem)] -rotate-12"
          style={{
            boxShadow: '0 0 0 1px rgba(201,162,39,0.3), 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(201,162,39,0.12)',
          }}
        >
          <Image
            src="/cat.png"
            alt="Cat"
            width={400}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Dog - Middle Right */}
        <div
          className="absolute top-1/2 right-0 z-20 rounded-3xl overflow-hidden w-[clamp(9rem,22vw,14rem)] h-[clamp(9rem,22vw,14rem)] rotate-6"
          style={{
            boxShadow: '0 0 0 1px rgba(201,162,39,0.3), 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(201,162,39,0.12)',
          }}
        >
          <Image
            src="/dog.png"
            alt="Dog"
            width={500}
            height={500}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Me-Dog - Top Left (Highlighted) */}
        <div
          className="absolute top-0 left-1/4 z-30 rounded-3xl overflow-hidden w-[clamp(10rem,26vw,16rem)] h-[clamp(10rem,26vw,16rem)] -rotate-3"
          style={{
            boxShadow: '0 0 0 1.5px rgba(255,215,0,0.55), 0 16px 48px rgba(0,0,0,0.7), 0 0 32px rgba(201,162,39,0.25)',
          }}
        >
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

