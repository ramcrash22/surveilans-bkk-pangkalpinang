import styles from './BottomNavigation.module.css';
import { useNavigate } from 'react-router-dom';

export default function BottomNavigation() {
  const navigate = useNavigate();

  return (
    <nav className={styles.bottomNav}>
      <button
        className={styles.fab}
        aria-label="Home"
        onClick={() => navigate('/')}
      >
        {/* Icon Home SVG */}
        <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="#0d6efd"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.icon}
            >
            <path d="M12 3L2 12h3v7a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-7h3L12 3z"/>
        </svg>
      </button>
    </nav>
  );
}
