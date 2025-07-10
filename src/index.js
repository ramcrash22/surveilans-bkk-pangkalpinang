import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { HashRouter } from 'react-router-dom'; // Ganti BrowserRouter ke HashRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  // </React.StrictMode>
);

// Nonaktifkan service worker agar tidak error di GitHub Pages
serviceWorkerRegistration.unregister();

// Jika ingin mengukur performa aplikasi, gunakan reportWebVitals
// Contoh: reportWebVitals(console.log)
reportWebVitals();
