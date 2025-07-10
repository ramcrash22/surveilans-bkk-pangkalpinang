import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { BrowserRouter } from 'react-router-dom'; // Tambahkan ini

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);

// Aktifkan PWA dengan register service worker
serviceWorkerRegistration.register();

// Jika ingin mengukur performa aplikasi, gunakan reportWebVitals
// Contoh: reportWebVitals(console.log)
reportWebVitals();
