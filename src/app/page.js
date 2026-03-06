import Navbar from './components/Navbar';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.badge}>Creative Suite</div>
          <h1 className={styles.title}>
            <span className="gradient-text">ShapeIt</span>
          </h1>
          <p className={styles.subtitle}>
            Two premium creative tools. Card path animations and grainy shape generation — built for designers who demand perfection.
          </p>
        </div>

        <div className={styles.toolGrid}>
          <Link href="/cards" className={styles.toolCard}>
            <div className={styles.toolPreview} data-tool="cards">
              <div className={styles.cardStack}>
                <div className={styles.miniCard} style={{ background: 'linear-gradient(135deg, #ff6b35, #ffb347)', transform: 'rotate(-15deg) translateX(-20px)' }} />
                <div className={styles.miniCard} style={{ background: '#f4f4f4', transform: 'rotate(-5deg) translateX(-8px)' }} />
                <div className={styles.miniCard} style={{ background: 'linear-gradient(135deg, #ff4d6a, #ff8a80)', transform: 'rotate(5deg) translateX(5px)' }} />
                <div className={styles.miniCard} style={{ background: '#1a1a1a', border: '2px solid #333', transform: 'rotate(12deg) translateX(18px)' }} />
                <div className={styles.miniCard} style={{ background: 'linear-gradient(135deg, #b71c1c, #7f0000)', transform: 'rotate(20deg) translateX(30px)' }} />
              </div>
            </div>
            <div className={styles.toolInfo}>
              <h2 className={styles.toolTitle}>Card Path Animation</h2>
              <p className={styles.toolDesc}>140 cards flowing along mathematical curves — Wave, Curly, Loop & Stripes with realtime controls</p>
              <div className={styles.toolTags}>
                <span className={styles.tag}>Animation</span>
                <span className={styles.tag}>Math Curves</span>
                <span className={styles.tag}>Realtime</span>
              </div>
            </div>
            <div className={styles.toolArrow}>→</div>
          </Link>

          <Link href="/editor" className={styles.toolCard}>
            <div className={styles.toolPreview} data-tool="editor">
              <div className={styles.shapePreview}>
                <svg viewBox="0 0 100 100" className={styles.shapeSvg}>
                  <defs>
                    <linearGradient id="shapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00f2fe" />
                      <stop offset="50%" stopColor="#4facfe" />
                      <stop offset="100%" stopColor="#ff4d6a" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
                    fill="url(#shapeGrad)"
                    opacity="0.9"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.toolInfo}>
              <h2 className={styles.toolTitle}>Shape Editor</h2>
              <p className={styles.toolDesc}>Generate grainy gradient shapes — Stars, Circles, Hexagons & more with 4-color gradients and noise overlay</p>
              <div className={styles.toolTags}>
                <span className={styles.tag}>Canvas</span>
                <span className={styles.tag}>Gradient</span>
                <span className={styles.tag}>PNG Export</span>
              </div>
            </div>
            <div className={styles.toolArrow}>→</div>
          </Link>
        </div>

        <div className={styles.footer}>
          <span>Built with Next.js — Soft UI Design</span>
        </div>
      </main>
    </>
  );
}
