// FormulirAlatAngkut.js
import React, { useState } from 'react';
import styles from './FormulirAlatAngkut.module.css';
import KapalLautForm from './KapalLautForm';
import PesawatForm from './PesawatForm';
import { FaShip, FaPlane } from "react-icons/fa";

// openModal didapat dari props (dari App.js)
export default function FormulirAlatAngkut({ openModal }) {
  const [activeTab, setActiveTab] = useState('kapal');
  const [kapalFormData, setKapalFormData] = useState({ namaKapal: '', noRegistrasi: '', keteranganKapal: '' });
  const [pesawatFormData, setPesawatFormData] = useState({ namaPesawat: '', kodePesawat: '', keteranganPesawat: '' });
  const [pendingAction, setPendingAction] = useState(null);

  // Cek apakah form pada tab aktif sudah diisi
  const isFormFilled = () => {
    const data = activeTab === 'kapal' ? kapalFormData : pesawatFormData;
    return Object.values(data).some(val => val && val.trim() !== '');
  };

  // Reset data form sesuai tab
  const resetFormData = (tab) => {
    if (tab === 'kapal') {
      setKapalFormData({ namaKapal: '', noRegistrasi: '', keteranganKapal: '' });
    } else {
      setPesawatFormData({ namaPesawat: '', kodePesawat: '', keteranganPesawat: '' });
    }
  };

  // Handler ganti tab dengan konfirmasi jika form sudah diisi
  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    if (isFormFilled()) {
      setPendingAction({ type: 'tab', value: tab });
      openModal({
        title: "Konfirmasi",
        text: "Formulir ini sudah diisi. Apakah Anda yakin ingin meninggalkan formulir ini? Data yang belum dikirim akan hilang jika melakukan perpindahan Tab ataupun Formulir.",
        onCancel: () => setPendingAction(null),
        onConfirm: () => {
          resetFormData(activeTab);
          setActiveTab(tab);
          setPendingAction(null);
        }
      });
    } else {
      resetFormData(activeTab);
      setActiveTab(tab);
    }
  };

  // Handler perubahan jenis form dari child (misal: ganti jenis form di KapalLautForm)
  const handleJenisFormChange = (jenisFormSetter, value) => {
    if (isFormFilled()) {
      setPendingAction({ type: 'jenis', setter: jenisFormSetter, value });
      openModal({
        title: "Konfirmasi",
        text: "Formulir ini sudah diisi. Apakah Anda yakin ingin meninggalkan formulir ini? Data yang belum dikirim akan hilang jika melakukan perpindahan Tab ataupun Formulir.",
        onCancel: () => setPendingAction(null),
        onConfirm: () => {
          resetFormData(activeTab);
          if (typeof jenisFormSetter === "function") jenisFormSetter(value);
          setPendingAction(null);
        }
      });
    } else {
      resetFormData(activeTab);
      if (typeof jenisFormSetter === "function") jenisFormSetter(value);
    }
  };

  // Handler perubahan data form (dipanggil dari child)
  const handleFormChange = (data) => {
    if (activeTab === 'kapal') setKapalFormData(data);
    else setPesawatFormData(data);
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.title}>Formulir Alat Angkut</div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'kapal' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('kapal')}
            type="button"
          >
            <FaShip style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Kapal Laut
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pesawat' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('pesawat')}
            type="button"
          >
            <FaPlane style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Pesawat
          </button>
        </div>
        <div className={styles.formArea}>
          {activeTab === 'kapal' && (
            <KapalLautForm
              formData={kapalFormData}
              setFormData={setKapalFormData}
              onJenisFormChange={handleJenisFormChange}
              onFormChange={handleFormChange}
            />
          )}
          {activeTab === 'pesawat' && (
            <PesawatForm
              formData={pesawatFormData}
              setFormData={setPesawatFormData}
              onJenisFormChange={handleJenisFormChange}
              onFormChange={handleFormChange}
            />
          )}
        </div>
      </div>
      {/* Spacer agar tidak ketutup BottomNavigation */}
      <div style={{ height: '90px' }} />
    </>
  );
}
