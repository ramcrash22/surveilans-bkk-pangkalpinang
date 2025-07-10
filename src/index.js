import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { BrowserRouter } from 'react-router-dom';

// GUNAKAN basename SESUAI NAMA REPO!
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter basename="/surveilans-bkk-pangkalpinang">
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);

// Nonaktifkan service worker agar tidak error di GitHub Pages
serviceWorkerRegistration.unregister();

// Jika ingin mengukur performa aplikasi, gunakan reportWebVitals
// Contoh: reportWebVitals(console.log)
reportWebVitals();
