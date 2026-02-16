import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatBlogDate, getBlogCategory, getBlogs } from '@/skeleton-data/blogs'
import { getBlogsContent } from '@/skeleton-data/portfolio'

export function BlogsSection() {
  const t = useTranslations()
  const blogsContent = getBlogsContent(t)
  const blogs = getBlogs().slice(0, 6)

  return (
    <section
      id="blogs"
      data-section="blogs"
      data-sphere
      className="sphere-section min-h-[85vh] space-y-10 lg:py-20"
    >
      <div data-reveal className="reveal flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--hero-muted)]">
            {blogsContent.eyebrow}
          </p>
          <h2 className="text-3xl font-heading text-glow md:text-4xl">
            {blogsContent.title}
          </h2>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
        >
          <Link href="/blogs">{blogsContent.cta}</Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {blogs.map((blog, index) => {
          const category = getBlogCategory(blog.category)
          return (
            <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group">
              <article
                data-reveal
                className="reveal glass-panel neon-border rounded-2xl p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--hero-accent)]"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div
                  className={cn(
                    'rounded-xl p-4 text-[10px] uppercase tracking-[0.3em] text-white',
                    blog.cover.className
                  )}
                >
                  {blog.cover.label}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.3em] text-[var(--hero-muted)]">
                  <span
                    className={cn(
                      'rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.3em]',
                      category?.badgeClass ??
                        'border border-[var(--hero-border)] text-[var(--hero-foreground)]'
                    )}
                  >
                    {category?.label ?? blog.category}
                  </span>
                  <span>{formatBlogDate(blog.publishedAt)}</span>
                </div>
                <h3 className="mt-4 text-lg font-heading text-glow">
                  {blog.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--hero-muted)] line-clamp-3">
                  {blog.summary}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--hero-muted)]">
                  <span>{blog.readTime}</span>
                  <span className="text-[var(--hero-accent)]">Read story</span>
                </div>
              </article>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
