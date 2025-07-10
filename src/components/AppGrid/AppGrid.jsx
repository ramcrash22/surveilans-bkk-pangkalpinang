import React from 'react';
import styles from './AppGrid.module.css';

import app1 from '../../assets/Img/icon-app/app1.png';
import app2 from '../../assets/Img/icon-app/app2.png';
import app3 from '../../assets/Img/icon-app/app3.png';
import app4 from '../../assets/Img/icon-app/app4.png';
import app5 from '../../assets/Img/icon-app/app5.png';
import app6 from '../../assets/Img/icon-app/app6.png';

const apps = [
  { name: 'Formulir Alat Angkut', icon: app1, link: '/Formulir-Alat-Angkut' },
  { name: 'Formulir Barang', icon: app2, link: '/Formulir-Barang' }, // Perubahan di sini
  { name: 'Formulir Orang', icon: app3, link: '/Formulir-Orang' },
  { name: 'App Four', icon: app4, link: '/app4' },
  { name: 'App Five', icon: app5, link: '/app5' },
  { name: 'App Six', icon: app6, link: '/app6' },
];

export default function AppGrid() {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.grid}>
        {apps.map((app) => (
          <a href={app.link} className={styles.appItem} key={app.name}>
            <img src={app.icon} alt={app.name} className={styles.icon} />
            <span className={styles.text}>{app.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
