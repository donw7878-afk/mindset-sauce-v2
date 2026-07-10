import styles from "./Footer.module.css";

/** The Foundation — minimal, engraved. Text-only brand: all Cormorant Garamond. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.brand}>The Mindset Sauce Institute™</p>
        <p className={styles.tag}>Built for the ones who finish.</p>
        <nav className={styles.links}>
          <a href="#top">Top</a>
          <a href="#chambers">The System</a>
          <a href="#exchange">The Exchange</a>
          <span className={styles.dim}>Terms</span>
          <span className={styles.dim}>Privacy</span>
        </nav>
        <p className={styles.legal}>
          © {new Date().getFullYear()} The Mindset Sauce Institute™. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
