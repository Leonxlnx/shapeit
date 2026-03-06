import Navbar from './components/Navbar';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.hero}>
          <span className={styles.badge}>shape tool</span>
          <h1 className={styles.title}>shapeit</h1>
          <p className={styles.subtitle}>
            Grainy gradient shapes. Minimal controls,<br />
            maximum output. Export as PNG.
          </p>
          <Link href="/editor" className={styles.cta}>
            Open Editor
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewInner}>
            <div className={styles.shape1} />
            <div className={styles.shape2} />
            <div className={styles.shape3} />
          </div>
          <span className={styles.previewLabel}>Stars, circles, polygons — with grain</span>
        </div>

        <footer className={styles.footer}>
          <span>built by <a href="https://x.com/lexnlin" target="_blank" rel="noopener noreferrer" className={styles.xLink}>x.com/lexnlin</a></span>
        </footer>
      </main>
    </>
  );
}
