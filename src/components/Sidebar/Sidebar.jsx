import styles from './Sidebar.module.css';
import logo from '../../assets/Img/logo-img/logo.png';

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`${styles.overlay} ${open ? styles.overlayShow : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <img
            src={logo}
            alt="Logo Surveilans BKK Pangkalpinang"
            className={styles.logo}
          />
        </div>
        {/* Garis putus-putus */}
        <div className={styles.dashedDivider}></div>
        {/* Menu */}
        <ul className={styles.menu}>
          <li><a href="/" onClick={onClose}>Beranda</a></li>
          <li><a href="/data" onClick={onClose}>Data</a></li>
          <li><a href="/tentang" onClick={onClose}>Tentang</a></li>
        </ul>
        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.hotline}>
            Hotline BKK Pangkalpinang:<br />
            <a href="tel:08117808005">0811-7808-005</a>
          </div>
          <div className={styles.developed}>
            Developed by :
            <br /> 
            BKK Pangkalpinang - 2025
          </div>
        </div>
      </aside>
    </>
  );
}
