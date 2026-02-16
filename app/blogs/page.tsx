import Link from 'next/link'
import { ArrowUpRight, Calendar, Clock, Flame } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  formatBlogDate,
  getBlogCategories,
  getBlogCategory,
  getBlogs,
  getFeaturedBlog,
  getLatestBlogs,
  getTrendingBlogs,
} from '@/skeleton-data/blogs'
import { PortfolioFooter } from '../_components/portfolio-footer'
import { PortfolioHeader } from '../_components/portfolio-header'

export default function BlogsPage() {
  const blogs = getBlogs()
  const featured = getFeaturedBlog()
  const latest = getLatestBlogs(4, [featured.slug])
  const trending = getTrendingBlogs(3)
  const categories = getBlogCategories()
  const excludedSlugs = new Set([featured.slug, ...latest.map((blog) => blog.slug)])
  const remaining = blogs.filter((blog) => !excludedSlugs.has(blog.slug))
  const categoryCounts = blogs.reduce<Record<string, number>>((acc, blog) => {
    acc[blog.category] = (acc[blog.category] ?? 0) + 1
    return acc
  }, {})
  const lastUpdated = formatBlogDate(blogs[0]?.publishedAt ?? new Date().toISOString())

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent text-[var(--hero-foreground)]">
      <div className="relative z-10 font-mono">
        <PortfolioHeader />

        <main className="mx-auto w-full px-6 pb-14 pt-10 md:px-10 md:pt-24 xl:px-16">
          <section className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                Signal Newsroom
              </p>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-4 max-w-2xl">
                  <h1 className="text-4xl font-heading text-glow md:text-5xl">
                    Blog Dispatches
                  </h1>
                  <p className="text-lg text-[var(--hero-muted)]">
                    A live desk of product notes, design rituals, and launch updates. Every story is a signal from the lab.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
                  >
                    <a href="#all">All stories</a>
                  </Button>
                  <Button
                    asChild
                    className="neon-border bg-[var(--hero-accent)] text-[var(--hero-accent-contrast)] hover:bg-[var(--hero-accent-strong)]"
                  >
                    <a href="#categories">Browse channels</a>
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-panel neon-border rounded-2xl p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Total stories
                </p>
                <p className="mt-2 text-2xl font-heading text-glow">
                  {blogs.length.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="glass-panel neon-border rounded-2xl p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Channels
                </p>
                <p className="mt-2 text-2xl font-heading text-glow">
                  {categories.length.toString().padStart(2, '0')}
                </p>
              </div>
              <div className="glass-panel neon-border rounded-2xl p-4 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Last update
                </p>
                <p className="mt-2 text-2xl font-heading text-glow">{lastUpdated}</p>
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <Link href={`/blogs/${featured.slug}`} className="group">
              <article className="glass-panel neon-border rounded-3xl p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--hero-accent)]">
                <div
                  className={cn(
                    'rounded-2xl p-6 text-xs uppercase tracking-[0.3em] text-white',
                    featured.cover.className
                  )}
                >
                  {featured.cover.label}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  <span
                    className={cn(
                      'rounded-full px-3 py-1',
                      getBlogCategory(featured.category)?.badgeClass ??
                        'border border-[var(--hero-border)] text-[var(--hero-foreground)]'
                    )}
                  >
                    {getBlogCategory(featured.category)?.label ?? featured.category}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatBlogDate(featured.publishedAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-heading text-glow md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-base text-[var(--hero-muted)]">
                  {featured.summary}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--hero-accent)]">
                  Read the feature <ArrowUpRight className="h-4 w-4" />
                </div>
              </article>
            </Link>

            <div className="space-y-6">
              <div className="glass-panel neon-border rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                    Latest dispatches
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--hero-accent)]">
                    Live
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {latest.map((blog) => (
                    <Link
                      key={blog.slug}
                      href={`/blogs/${blog.slug}`}
                      className="block rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4 transition-all duration-300 hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]/70"
                    >
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                        <span>
                          {getBlogCategory(blog.category)?.label ?? blog.category}
                        </span>
                        <span>{formatBlogDate(blog.publishedAt)}</span>
                      </div>
                      <h3 className="mt-2 text-sm font-heading text-glow">
                        {blog.title}
                      </h3>
                      <p className="mt-2 text-xs text-[var(--hero-muted)] line-clamp-2">
                        {blog.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="glass-panel neon-border rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                    Trending signals
                  </p>
                  <Flame className="h-4 w-4 text-[var(--hero-accent)]" />
                </div>
                <div className="mt-4 space-y-3">
                  {trending.map((blog, index) => (
                    <Link
                      key={blog.slug}
                      href={`/blogs/${blog.slug}`}
                      className="flex items-start gap-3 rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface)]/40 p-4 transition-all duration-300 hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]/70"
                    >
                      <span className="text-xs font-heading text-[var(--hero-accent)]">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-sm font-heading text-glow">
                          {blog.title}
                        </h3>
                        <p className="mt-2 text-xs text-[var(--hero-muted)] line-clamp-2">
                          {blog.summary}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="categories" className="mt-14 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  Channels
                </p>
                <h2 className="text-3xl font-heading text-glow">Browse by focus</h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
              >
                <a href="#all">View all stories</a>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="glass-panel neon-border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.3em]',
                        category.badgeClass
                      )}
                    >
                      {category.label}
                    </span>
                    <span className="text-xs text-[var(--hero-muted)]">
                      {categoryCounts[category.id] ?? 0}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-[var(--hero-muted)]">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="all" className="mt-14 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  All stories
                </p>
                <h2 className="text-3xl font-heading text-glow">More from the lab</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {remaining.map((blog) => (
                <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group">
                  <article className="glass-panel neon-border rounded-3xl p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--hero-accent)]">
                    <div
                      className={cn(
                        'rounded-2xl p-5 text-[10px] uppercase tracking-[0.3em] text-white',
                        blog.cover.className
                      )}
                    >
                      {blog.cover.label}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                      <span
                        className={cn(
                          'rounded-full px-2 py-1',
                          getBlogCategory(blog.category)?.badgeClass ??
                            'border border-[var(--hero-border)] text-[var(--hero-foreground)]'
                        )}
                      >
                        {getBlogCategory(blog.category)?.label ?? blog.category}
                      </span>
                      <span>{formatBlogDate(blog.publishedAt)}</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h3 className="mt-4 text-xl font-heading text-glow">
                      {blog.title}
                    </h3>
                    <p className="mt-3 text-sm text-[var(--hero-muted)] line-clamp-3">
                      {blog.summary}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <PortfolioFooter />
      </div>
    </div>
  )
}
