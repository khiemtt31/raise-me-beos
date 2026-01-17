export function PortfolioBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(146,72,122,0.2),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(228,155,166,0.2),_transparent_55%)]" />
      <div className="absolute inset-0 bg-cyber-grid opacity-60" />
      <div className="absolute inset-0 bg-scanlines opacity-30 mix-blend-soft-light" />
    </div>
  )
}
