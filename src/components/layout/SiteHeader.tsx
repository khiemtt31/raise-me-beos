const navigation = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="site-header" id="top">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#top" aria-label="Back to introduction">
          <span aria-hidden="true">KH</span>
          <span className="site-header__brand-name">Khiem Hanzo</span>
        </a>
        <nav aria-label="Primary navigation">
          <ul className="site-header__nav">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
