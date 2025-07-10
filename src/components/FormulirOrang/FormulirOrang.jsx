import React, { useState } from 'react';
import styles from './FormulirOrang.module.css';
import OrangForm from './OrangForm';
import { FaUser } from "react-icons/fa";
import PropTypes from 'prop-types';
// Import ModalConfirm karena kita akan menggunakannya di sini untuk modal sukses
import ModalConfirm from '../Modal/ModalConfirm';

export default function FormulirOrang({ openModal }) {
  const [activeTab] = useState('orang'); // State ini tampaknya selalu 'orang', mungkin bisa dihapus jika tidak ada tab lain
  const [orangFormData, setOrangFormData] = useState({
    // Sesuaikan initial state dengan field yang sebenarnya ada di form OrangPengendalianForm
    // Ini hanya contoh, pastikan sesuai dengan struktur data yang Anda harapkan
    tanggal: '',
    wilayahKerja: '',
    namaPetugas: '',
    namaLengkap: '',
    nik: '',
    jenisKelamin: '',
    umur: '',
    contactPerson: '',
    kunjunganKlinik: '',
    // Field untuk Non Pelaku (contoh)
    alamatKtpNonPelaku: '',
    alamatDomisiliNonPelaku: '',
    pekerjaanNonPelaku: '',
    hasilPemeriksaanNonPelaku: '',
    faktorRisikoNonPelaku: [], // Checkbox
    lainnya_faktorRisikoNonPelaku: '', // Field 'Other' untuk faktorRisikoNonPelaku
    diagnosaMedisNonPelaku: '',
    tindakanPengendalianNonPelaku: [], // Checkbox
    keteranganNonPelaku: '',
    // Field untuk Pelaku (contoh)
    statusDatangBerangkat: '',
    crewPenumpang: '', // Radio
    lainnya_crewPenumpang: '', // Field 'Other' untuk crewPenumpang
    namaAlatAngkut: '',
    alamatAsal: '',
    alamatTujuan: '',
    pekerjaanPelaku: '',
    hasilPemeriksaanPelaku: '',
    faktorRisikoPelaku: [], // Checkbox
    lainnya_faktorRisikoPelaku: '', // Field 'Other' untuk faktorRisikoPelaku
    diagnosaMedisPelaku: '',
    tindakanPengendalianPelaku: [], // Checkbox
    keteranganPelaku: '',
    // ... tambahkan field lain sesuai OrangPengendalianForm
  });

  // State baru untuk mengontrol modal sukses
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Hapus state modalMessage karena kita pakai ModalConfirm
  // const [modalMessage, setModalMessage] = useState('');

  // Fungsi untuk mengecek apakah form memiliki data yang terisi
  const isFormFilled = () => {
     // Periksa apakah ada nilai di orangFormData selain nilai default kosong
     const defaultValues = {
         tanggal: '', wilayahKerja: '', namaPetugas: '', namaLengkap: '',
         nik: '', jenisKelamin: '', umur: '', contactPerson: '', kunjunganKlinik: '',
         alamatKtpNonPelaku: '', alamatDomisiliNonPelaku: '', pekerjaanNonPelaku: '',
         hasilPemeriksaanNonPelaku: '', faktorRisikoNonPelaku: [], lainnya_faktorRisikoNonPelaku: '',
         diagnosaMedisNonPelaku: '', tindakanPengendalianNonPelaku: [], keteranganNonPelaku: '',
         statusDatangBerangkat: '', crewPenumpang: '', lainnya_crewPenumpang: '', namaAlatAngkut: '',
         alamatAsal: '', alamatTujuan: '', pekerjaanPelaku: '', hasilPemeriksaanPelaku: '',
         faktorRisikoPelaku: [], lainnya_faktorRisikoPelaku: '', diagnosaMedisPelaku: [],
         tindakanPengendalianPelaku: [], keteranganPelaku: '',
         // ... tambahkan semua field default di sini
     };
     return Object.keys(orangFormData).some(key => {
        const currentValue = orangFormData[key];
        const defaultValue = defaultValues[key];

        if (Array.isArray(currentValue)) {
            // Untuk array (checkbox), cek apakah ada item di dalamnya
            return currentValue.length > 0;
        } else {
            // Untuk tipe lain, cek apakah nilainya berbeda dari default (kosong)
            return currentValue !== defaultValue && currentValue !== null && currentValue !== undefined && (typeof currentValue !== 'string' || currentValue.trim() !== '');
        }
     });
  };


  const resetFormData = () => setOrangFormData({
     // Reset semua field ke nilai default kosong
     tanggal: '', wilayahKerja: '', namaPetugas: '', namaLengkap: '',
     nik: '', jenisKelamin: '', umur: '', contactPerson: '', kunjunganKlinik: '',
     alamatKtpNonPelaku: '', alamatDomisiliNonPelaku: '', pekerjaanNonPelaku: '',
     hasilPemeriksaanNonPelaku: '', faktorRisikoNonPelaku: [], lainnya_faktorRisikoNonPelaku: '',
     diagnosaMedisNonPelaku: [], tindakanPengendalianNonPelaku: [], keteranganNonPelaku: '',
     statusDatangBerangkat: '', crewPenumpang: '', lainnya_crewPenumpang: '', namaAlatAngkut: '',
     alamatAsal: '', alamatTujuan: '', pekerjaanPelaku: '', hasilPemeriksaanPelaku: '',
     faktorRisikoPelaku: [], lainnya_faktorRisikoPelaku: '', diagnosaMedisPelaku: [],
     tindakanPengendalianPelaku: [], keteranganPelaku: '',
     // ... reset semua field lain
  });

  const handleFormChange = (data) => setOrangFormData(data);

  // Fungsi ini dipanggil oleh OrangForm.js setelah pengguna mengonfirmasi submit
  const handleSubmit = () => {
    console.log("Submitting data from FormulirOrang:", orangFormData);
    // Di sini Anda akan melakukan panggilan API untuk mengirim data
    // Contoh simulasi panggilan API asynchronous:
    // await api.post('/submit-orang-data', orangFormData);

    // Setelah simulasi API berhasil:
    console.log("Data orang berhasil dikirim (simulasi API sukses)!");
    setShowSuccessModal(true); // Tampilkan modal sukses
    resetFormData(); // Reset form setelah sukses
    // Anda mungkin ingin menambahkan state loading atau error handling di sini
  };

  const handleReset = () => {
    if (isFormFilled()) {
      // Gunakan prop openModal dari parent untuk konfirmasi reset
      openModal({
        title: "Reset Formulir Orang",
        text: "Data orang yang belum disimpan akan hilang. Lanjutkan reset?",
        onCancel: () => {}, // openModal dari parent mungkin punya default cancel handler
        onConfirm: () => resetFormData()
      });
    } else {
      resetFormData(); // Langsung reset jika form kosong
    }
  };

  // Fungsi untuk menutup modal sukses
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Logika tambahan setelah modal sukses ditutup, jika ada (misalnya, navigasi)
  };


  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.title}>Formulir Orang</div>
        {/* Tabs section, tetap ada meskipun hanya satu tab */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'orang' ? styles.tabActive : ''}`}
            type="button"
            onClick={() => {}} // Handler kosong karena hanya ada satu tab
          >
            <FaUser style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Orang
          </button>
        </div>
        <div className={styles.formArea}>
          {activeTab === 'orang' && (
            <OrangForm
              formData={orangFormData}
              setFormData={setOrangFormData}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit} // Meneruskan fungsi submit yang baru
              // onReset={handleReset} // onReset tidak lagi diteruskan ke OrangForm
              // openModal={openModal} // openModal tidak lagi diteruskan ke OrangForm
              // Prop baru untuk modal sukses
              showSuccessModal={showSuccessModal}
              onCloseSuccessModal={handleCloseSuccessModal}
            />
          )}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ height: '90px' }} />

      {/* Hapus div modalMessage karena diganti ModalConfirm */}
      {/*
      {modalMessage && (
        <div className={styles.successModal}>
          <p>{modalMessage}</p>
        </div>
      )}
      */}

      {/* Modal Sukses (dikontrol oleh state showSuccessModal) */}
      <ModalConfirm
        open={showSuccessModal}
        title="Data Berhasil Dikirim"
        text="Data orang berhasil dikirimkan."
        onCancel={handleCloseSuccessModal} // Tombol Batal menutup modal
        onConfirm={handleCloseSuccessModal} // Tombol Konfirmasi menutup modal
      />

      {/* Catatan: Modal Konfirmasi Reset masih menggunakan prop openModal dari parent FormulirOrang */}
      {/* Logika handleReset tetap menggunakan openModal */}
    </>
  );
}

FormulirOrang.propTypes = {
  // openModal adalah prop yang diterima FormulirOrang dari parentnya
  openModal: PropTypes.func.isRequired,
};
