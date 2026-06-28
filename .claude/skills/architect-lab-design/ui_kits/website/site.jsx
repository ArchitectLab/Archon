/* Architect Lab — Website UI kit
   A forward design for the marketing site, composed from the system's
   own primitives (Button, Logo, Card, Tag, GradientRule, Eyebrow, Input).
   The repo had no production UI; this is built from the brand charter. */

const AL = window.ArchitectLabDesignSystem_61bf68;
const { Button, Logo, Card, Tag, GradientRule, Eyebrow, Input } = AL;

const ink = { paper: '#F5F7FA', slate: '#8B97A8', void: '#0B1220', panel: '#111A2C', line: '#1E2A40' };

/* Responsive layout — injected once. Columns/paddings live here so they can
   collapse at breakpoints; visual styling stays inline on the components.
   Content stays centred (max-width) on super-wide screens for a good measure. */
const RESPONSIVE_CSS = `
  .als-nav { padding: 18px 40px; }
  .als-hero { padding: 110px 40px 96px; }
  .als-section { padding: 96px 40px; }
  .als-tracks { padding: 0 40px 96px; }
  .als-mentors { padding: 34px 40px; }
  .als-join { padding: 100px 40px; }
  .als-footer { padding: 56px 40px 36px; }
  .als-grid3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin-top: 36px; }
  .als-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .als-foot  { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 40px; }
  .als-term  { max-width: 100%; }
  @media (min-width: 1700px) {
    .als-hero, .als-section, .als-tracks, .als-join { padding-left: 72px; padding-right: 72px; }
  }
  @media (max-width: 1024px) {
    .als-grid3 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 760px) {
    .als-nav { padding: 14px 20px; }
    .als-navlinks { display: none !important; }
    .als-hero { padding: 84px 22px 64px; }
    .als-section { padding: 72px 22px; }
    .als-tracks { padding: 0 22px 72px; }
    .als-mentors { padding: 26px 22px; }
    .als-join { padding: 72px 22px; }
    .als-footer { padding: 48px 22px 30px; }
    .als-grid3, .als-grid2, .als-foot { grid-template-columns: 1fr; }
    .als-foot { gap: 30px; }
    .als-term { flex-wrap: wrap; }
  }
`;

/* ---------------- Icon (Lucide) ---------------- */
function Icon({ name, size = 20, color = ink.paper, stroke = 1.75, style }) {
  return <i data-lucide={name} style={{ width: size, height: size, color, strokeWidth: stroke, display: 'inline-flex', ...style }} />;
}

/* ---------------- Nav ---------------- */
function Nav() {
  const links = ['Programs', 'Method', 'Mentors', 'Open source'];
  return (
    <nav className="als-nav" style={{
      position: 'sticky', top: 0, zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `1px solid ${ink.line}`,
      background: 'rgba(11,18,32,0.82)', backdropFilter: 'blur(8px)',
    }}>
      <Logo variant="horizontal" tone="spectrum" size={30} baseline="" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        <div className="als-navlinks" style={{ display: 'flex', gap: 26 }}>
          {links.map(l => (
            <a key={l} href="#" style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
              color: ink.slate, textDecoration: 'none', transition: 'color .15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = ink.paper}
              onMouseLeave={e => e.currentTarget.style.color = ink.slate}>{l}</a>
          ))}
        </div>
        <Button variant="spectrum" size="sm" iconRight={<Icon name="arrow-right" size={15} color="#fff" />} onClick={() => { location.hash = '#join'; }}>Join the Lab</Button>
      </div>
    </nav>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <header className="al-blueprint als-hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* faint spectrum glow, top-right */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: -160, right: -120, width: 520, height: 520, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(138,43,226,0.20), rgba(230,18,217,0.06) 45%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{ maxWidth: 1160, margin: '0 auto', position: 'relative' }}>
        <Eyebrow>AI × Cybersecurity · Open source</Eyebrow>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 76px)', lineHeight: 1.04, margin: '22px 0 0', maxWidth: 920, letterSpacing: '-0.03em' }}>
          Build the future.<br />Be an <span className="al-spectrum-text">architect</span><span style={{ color: '#E612D9' }}>_</span>
        </h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 'clamp(16px, 2.3vw, 20px)', lineHeight: 1.6, color: ink.slate, maxWidth: 640, margin: '26px 0 0' }}>
          Architect Lab is an open-source association where the next generation designs, builds and protects — mentored by the engineers of <span style={{ color: ink.paper, fontWeight: 600 }}>Morphaius</span> & <span style={{ color: ink.paper, fontWeight: 600 }}>Bunkerity</span>.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 38, flexWrap: 'wrap' }}>
          <Button variant="spectrum" size="lg" iconRight={<Icon name="arrow-right" size={17} color="#fff" />} onClick={() => location.hash = '#join'}>Join the Lab</Button>
          <Button variant="secondary" size="lg" iconLeft={<Icon name="terminal" size={16} color={ink.paper} />}>Explore projects</Button>
        </div>

        {/* terminal cartouche */}
        <div className="als-term" style={{
          marginTop: 56, display: 'inline-flex', alignItems: 'center', gap: 12,
          background: ink.void, border: `1px solid ${ink.line}`, borderRadius: 8, padding: '12px 18px',
          fontFamily: "'JetBrains Mono',monospace", fontSize: 14,
        }}>
          <span style={{ color: '#2ECC9A' }}>$</span>
          <span style={{ color: ink.paper, overflowWrap: 'anywhere', minWidth: 0 }}>git clone github.com/architect-lab/domaius</span>
          <span className="al-cursor">▌</span>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Pillars: Design / Build / Protect ---------------- */
function Pillars() {
  const items = [
    { n: '01', t: 'Design', icon: 'pen-tool', body: 'Map the threat, sketch the system. Architecture before code — the plan on the grid.' },
    { n: '02', t: 'Build', icon: 'blocks', body: 'Ship open-source tools in real squads, reviewed by working engineers. Learn by shipping.' },
    { n: '03', t: 'Protect', icon: 'shield', body: 'Red-team your own work. Security is not a phase — it is the foundation we pour first.' },
  ];
  return (
    <section className="als-section" style={{ maxWidth: 1160, margin: '0 auto' }}>
      <Eyebrow color="#8A2BE2">The method</Eyebrow>
      <h2 style={{ fontSize: 'clamp(30px, 4.6vw, 40px)', margin: '16px 0 8px' }}>Design. Build. Protect.</h2>
      <p style={{ color: ink.slate, maxWidth: 560, margin: 0, fontFamily: "'Inter',sans-serif", fontSize: 16 }}>One loop, repeated until it's second nature.</p>
      <div className="als-grid3">
        {items.map(it => (
          <Card key={it.n} accent={true}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Icon name={it.icon} size={26} color={ink.paper} stroke={1.5} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: ink.slate, letterSpacing: '.16em' }}>{it.n}</span>
            </div>
            <h3 style={{ fontSize: 24, margin: '18px 0 8px' }}>{it.t}</h3>
            <p style={{ color: ink.slate, fontSize: 14.5, lineHeight: 1.6, margin: 0, fontFamily: "'Inter',sans-serif" }}>{it.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Tracks: AI / Cybersecurity ---------------- */
function Tracks() {
  const tracks = [
    { tag: 'Track 01', tone: 'blue', t: 'Artificial Intelligence', body: 'From first model to production agents — applied ML, evaluation, and the safety mindset that keeps it honest.', chips: ['LLM agents', 'Evals', 'MLOps', 'Open weights'] },
    { tag: 'Track 02', tone: 'magenta', t: 'Cybersecurity', body: 'Offensive and defensive in the same hands. Build the bunker, then try to break it.', chips: ['Red team', 'AppSec', 'Reverse eng.', 'Hardening'] },
  ];
  return (
    <section className="als-tracks" style={{ maxWidth: 1160, margin: '0 auto' }}>
      <Eyebrow>The programs</Eyebrow>
      <h2 style={{ fontSize: 'clamp(30px, 4.6vw, 40px)', margin: '16px 0 28px' }}>Two tracks, one architect</h2>
      <div className="als-grid2">
        {tracks.map(tr => (
          <Card key={tr.t} blueprint={true} padding={30} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Tag tone={tr.tone}>{tr.tag}</Tag>
            <h3 style={{ fontSize: 28, margin: 0 }}>{tr.t}</h3>
            <p style={{ color: ink.slate, fontSize: 15, lineHeight: 1.6, margin: 0, fontFamily: "'Inter',sans-serif", maxWidth: 420 }}>{tr.body}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {tr.chips.map(c => <Tag key={c}>{c}</Tag>)}
            </div>
            <a href="#" style={{ marginTop: 8, fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: 14, color: '#2A6BF2', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              View curriculum <Icon name="arrow-up-right" size={15} color="#2A6BF2" />
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Mentors strip ---------------- */
function Mentors() {
  return (
    <section className="als-mentors" style={{ borderTop: `1px solid ${ink.line}`, borderBottom: `1px solid ${ink.line}` }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: ink.slate }}>Mentored&nbsp;by</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Logo variant="mark" size={26} />
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, color: ink.paper }}>Morphaius</span>
        </div>
        <div style={{ width: 1, height: 26, background: ink.line }} />
        <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, color: ink.paper }}>Bunkerity</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: ink.slate }}>Working engineers. Real reviews. Open source.</span>
      </div>
    </section>
  );
}

/* ---------------- Join CTA (interactive) ---------------- */
function Join() {
  const [email, setEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  return (
    <section id="join" className="al-blueprint als-join" style={{ borderTop: `1px solid ${ink.line}` }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <Eyebrow color="#2ECC9A" style={{ justifyContent: 'center' }}>Cohort 2026 — open</Eyebrow>
        <h2 style={{ fontSize: 'clamp(34px, 5.4vw, 48px)', margin: '20px 0 12px', letterSpacing: '-0.02em' }}>Request access<span style={{ color: '#E612D9' }}>_</span></h2>
        <p style={{ color: ink.slate, fontSize: 17, margin: '0 auto 32px', maxWidth: 480, fontFamily: "'Inter',sans-serif" }}>
          No tuition, no gatekeeping. Tell us where to reach you and we'll send the entry brief.
        </p>
        <Card padding={28} style={{ textAlign: 'left', maxWidth: 520, margin: '0 auto' }}>
          {sent ? (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: '#2ECC9A', padding: '14px 4px' }}>
              <span style={{ color: ink.slate }}>$</span> access requested for <span style={{ color: ink.paper }}>{email}</span><br />
              <span style={{ color: '#2ECC9A' }}>→ entry brief sent.</span> <span className="al-cursor">▌</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <Input label="Email" prefix=">" placeholder="you@domain.org" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <Button variant="spectrum" size="lg" disabled={!valid} onClick={() => setSent(true)}>Request</Button>
            </div>
          )}
        </Card>
        <p style={{ marginTop: 18, fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: ink.slate, letterSpacing: '.04em' }}>OPEN SOURCE · OFL & MIT · NO FEES</p>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  const cols = [
    { h: 'Programs', items: ['AI', 'Cybersecurity', 'Method', 'Projects'] },
    { h: 'Lab', items: ['About', 'Mentors', 'Open source', 'Contact'] },
  ];
  return (
    <footer className="als-footer" style={{ background: ink.void, borderTop: `1px solid ${ink.line}` }}>
      <div className="als-foot" style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div>
          <Logo variant="stacked" size={30} style={{ alignItems: 'flex-start' }} />
        </div>
        {cols.map(c => (
          <div key={c.h}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: ink.slate, marginBottom: 16 }}>{c.h}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {c.items.map(i => <a key={i} href="#" style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: ink.paper, textDecoration: 'none', opacity: 0.82 }}>{i}</a>)}
            </div>
          </div>
        ))}
      </div>
      <GradientRule width="100%" height={2} style={{ margin: '40px 0 22px', maxWidth: 1160, marginLeft: 'auto', marginRight: 'auto' }} />
      <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: ink.slate }}>© 2026 Architect Lab — by Morphaius &amp; Bunkerity</span>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: ink.slate, letterSpacing: '.1em' }}>DESIGN · BUILD · PROTECT</span>
      </div>
    </footer>
  );
}

/* ---------------- App ---------------- */
function App() {
  React.useEffect(() => { if (window.lucide) window.lucide.createIcons(); });
  return (
    <div style={{ background: ink.void, minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_CSS }} />
      <Nav />
      <Hero />
      <Pillars />
      <Tracks />
      <Mentors />
      <Join />
      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
