import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  formatBlogDate,
  getBlogBySlug,
  getBlogCategory,
  getBlogs,
  getRelatedBlogs,
} from '@/skeleton-data/blogs'
import { PortfolioFooter } from '../../_components/portfolio-footer'
import { PortfolioHeader } from '../../_components/portfolio-header'

type BlogDetailPageProps = {
  params: {
    slug: string
  }
}

export const generateStaticParams = () =>
  getBlogs().map((blog) => ({ slug: blog.slug }))

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const blog = getBlogBySlug(params.slug)

  if (!blog) {
    notFound()
  }

  const category = getBlogCategory(blog.category)
  const related = getRelatedBlogs(blog.slug, 3)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-[var(--hero-foreground)]">
      <div className="relative z-10 font-mono">
        <PortfolioHeader />

        <main className="mx-auto w-full px-6 pb-14 pt-10 md:px-10 md:pt-24 xl:px-16">
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="text-[var(--hero-muted)] hover:text-[var(--hero-foreground)] hover:bg-[var(--hero-surface)]/50"
            >
              <Link href="/blogs" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Blogs
              </Link>
            </Button>
          </div>

          <section className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1',
                      category?.badgeClass ??
                        'border border-[var(--hero-border)] text-[var(--hero-foreground)]'
                    )}
                  >
                    {category?.label ?? blog.category}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatBlogDate(blog.publishedAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {blog.readTime}
                  </span>
                </div>

                <h1 className="text-4xl font-heading text-glow md:text-5xl">
                  {blog.title}
                </h1>
                <p className="text-lg text-[var(--hero-muted)]">{blog.subtitle}</p>
                <p className="text-base text-[var(--hero-muted)]">{blog.summary}</p>

                <div className="flex items-center gap-4 rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full border border-[var(--hero-border)]">
                    <Image
                      src={blog.author.avatar}
                      alt={blog.author.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--hero-foreground)]">
                      {blog.author.name}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                      {blog.author.role} - {blog.author.handle}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'rounded-3xl p-8 text-white shadow-xl',
                  blog.cover.className
                )}
              >
                <p className="text-xs uppercase tracking-[0.3em]">{blog.cover.label}</p>
                <div className="mt-6 space-y-3">
                  {blog.highlights.map((highlight) => (
                    <div key={highlight.title} className="rounded-2xl bg-black/20 p-4">
                      <p className="text-sm font-semibold">{highlight.title}</p>
                      <p className="mt-2 text-xs text-white/80">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="space-y-10">
              {blog.sections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <h2 className="text-2xl font-heading text-glow">
                    {section.title}
                  </h2>
                  {section.paragraphs.map((paragraph, index) => (
                    <p
                      key={`${section.id}-paragraph-${index}`}
                      className="text-[var(--hero-muted)]"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc pl-6 text-[var(--hero-muted)] space-y-2">
                      {section.bullets.map((bullet, index) => (
                        <li key={`${section.id}-bullet-${index}`}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                  {section.callout && (
                    <div className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/50 p-4 text-sm text-[var(--hero-foreground)]">
                      {section.callout}
                    </div>
                  )}
                </div>
              ))}
            </article>

            <aside className="space-y-6">
              <div className="glass-panel neon-border rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Signal stats
                </p>
                <div className="mt-4 space-y-3">
                  {blog.stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 px-4 py-3 text-sm"
                    >
                      <span className="text-[var(--hero-muted)]">
                        {stat.label}
                      </span>
                      <span className="font-semibold text-[var(--hero-foreground)]">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel neon-border rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Key takeaways
                </p>
                <div className="mt-4 space-y-3">
                  {blog.highlights.map((highlight) => (
                    <div
                      key={highlight.title}
                      className="rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4"
                    >
                      <p className="text-sm font-semibold text-[var(--hero-foreground)]">
                        {highlight.title}
                      </p>
                      <p className="mt-2 text-xs text-[var(--hero-muted)]">
                        {highlight.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel neon-border rounded-3xl p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Tags
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--hero-border)] px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[var(--hero-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </section>

          {related.length > 0 && (
            <section className="mt-14 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Related stories
                </p>
                <h2 className="text-3xl font-heading text-glow">Keep reading</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blogs/${post.slug}`}
                    className="group"
                  >
                    <article className="glass-panel neon-border rounded-3xl p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--hero-accent)]">
                      <div
                        className={cn(
                          'rounded-2xl p-4 text-[10px] uppercase tracking-[0.3em] text-white',
                          post.cover.className
                        )}
                      >
                        {post.cover.label}
                      </div>
                      <div className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                        {formatBlogDate(post.publishedAt)} - {post.readTime}
                      </div>
                      <h3 className="mt-3 text-lg font-heading text-glow">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--hero-muted)] line-clamp-3">
                        {post.summary}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <PortfolioFooter />
      </div>
    </div>
  )
}
