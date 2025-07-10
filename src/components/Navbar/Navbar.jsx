import styles from './Navbar.module.css';
import logo from '../../assets/Img/logo-img/logo.png';

export default function Navbar({ onMenuClick }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <img src={logo} alt="Logo Surveilans BKK Pangkalpinang" className={styles.logo} />
      </div>
      <ul className={styles.menu}>
        <li><a href="/">Beranda</a></li>
        <li><a href="/data">Data</a></li>
        <li><a href="/tentang">Tentang</a></li>
      </ul>
      <button
        className={styles.toggle}
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </button>
    </nav>
  );
}
