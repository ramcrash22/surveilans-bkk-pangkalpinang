import React, { useState } from 'react';
import styles from './FormulirBarang.module.css';
import BarangForm from './BarangForm';
import { FaBox } from "react-icons/fa";

export default function FormulirBarang({ openModal }) {
  const [activeTab] = useState('barang');
  const [barangFormData, setBarangFormData] = useState({
    namaBarang: '',
    noRegistrasi: '',
    keteranganBarang: ''
  });
  const [modalMessage, setModalMessage] = useState('');

  // Cek apakah form sudah diisi
  const isFormFilled = () => Object.values(barangFormData).some(val => val && val.trim() !== '');

  // Reset data form
  const resetFormData = () => setBarangFormData({ namaBarang: '', noRegistrasi: '', keteranganBarang: '' });

  // Handler perubahan data form
  const handleFormChange = (data) => setBarangFormData(data);

  // Handler submit
  const handleSubmit = () => {
    openModal({
      title: "Konfirmasi Pengiriman",
      text: "Apakah Anda yakin data sudah benar?",
      onCancel: () => {},
      onConfirm: () => {
        setModalMessage('Data berhasil dikirim!');
        resetFormData();
        setTimeout(() => setModalMessage(''), 2000);
      }
    });
  };

  // Handler reset
  const handleReset = () => {
    if (isFormFilled()) {
      openModal({
        title: "Reset Formulir",
        text: "Data yang belum disimpan akan hilang. Lanjutkan reset?",
        onCancel: () => {},
        onConfirm: () => resetFormData()
      });
    } else {
      resetFormData();
    }
  };

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.title}>Formulir Barang</div>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'barang' ? styles.tabActive : ''}`}
            type="button"
            onClick={() => {}}
          >
            <FaBox style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Barang
          </button>
        </div>
        <div className={styles.formArea}>
          {activeTab === 'barang' && (
            <BarangForm
              formData={barangFormData}
              setFormData={setBarangFormData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
              openModal={openModal} // ← WAJIB DITERUSKAN KE SINI!
            />
          )}
        </div>
      </div>

      <div style={{ height: '90px' }} />

      {/* Modal Sukses */}
      {modalMessage && (
        <div className={styles.successModal}>
          <p>{modalMessage}</p>
        </div>
      )}
    </>
  );
}
