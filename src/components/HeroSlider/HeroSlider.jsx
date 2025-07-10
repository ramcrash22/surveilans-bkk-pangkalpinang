import React, { useState, useEffect } from 'react';
import styles from './HeroSlider.module.css';

// Import gambar
import slide1 from '../../assets/Img/slide/slide1.jpg';
import slide2 from '../../assets/Img/slide/slide2.jpg';
import slide3 from '../../assets/Img/slide/slide3.jpg';

const slides = [
  {
    image: slide1,
    caption: 'Selamat datang di Surveilans BKK Pangkalpinang',
  },
  {
    image: slide2,
    caption: 'Data Surveilans Mudah & Akurat',
  },
  {
    image: slide3,
    caption: 'Layanan Hotline 24 Jam untuk Anda',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide setiap 8 detik
    useEffect(() => {
    const timer = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 detik
    return () => clearTimeout(timer);
    }, [current]);

  // Navigasi manual
  const goTo = idx => setCurrent(idx);

  return (
    <div className={styles.slider}>
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`${styles.slide} ${idx === current ? styles.active : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className={styles.caption}>
            {slide.caption}
          </div>
        </div>
      ))}
    </div>
  );
}
