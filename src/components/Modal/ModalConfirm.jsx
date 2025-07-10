import React from "react";
import { createPortal } from "react-dom";
import styles from './ModalConfirm.module.css';

export default function ModalConfirm({ open, title, text, onCancel, onConfirm }) {
  if (!open) return null;
  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalIconWarning}>
          {/* Icon Warning Segitiga Kuning */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="22" fill="#fffbe6"/>
            <path d="M22 11.5c.56 0 1.07.3 1.34.8l10 18.1c.54.99-.16 2.1-1.34 2.1H12c-1.18 0-1.88-1.11-1.34-2.1l10-18.1c.27-.5.78-.8 1.34-.8zm0 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-1-8v5a1 1 0 1 0 2 0v-5a1 1 0 1 0-2 0z" fill="#ffc107"/>
          </svg>
        </div>
        <div className={styles.modalTitle}>{title}</div>
        <div className={styles.modalText}>{text}</div>
        <div className={styles.modalActions}>
          <button className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={onCancel}>Batal</button>
          <button className={`${styles.modalBtn} ${styles.modalBtnPrimary}`} onClick={onConfirm}>Yakin</button>
        </div>
      </div>
    </div>,
    document.body // <<=== penting! render ke body
  );
}
