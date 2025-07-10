// src/components/Card/Card.jsx
import styles from './Card.module.css';

export default function Card({ title, children }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  );
}
