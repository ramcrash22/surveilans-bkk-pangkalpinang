import React, { useState, useRef } from "react";
// PropTypes masih bisa digunakan untuk dokumentasi, meskipun props tidak lagi diterima dari parent
// import PropTypes from 'prop-types'; // Tidak diperlukan jika tidak ada props
import axios from "axios"; // Import axios untuk panggilan API

// Pastikan path CSS ini benar sesuai struktur folder Anda
import styles from "./OrangPengendalianForm.module.css";
// Import ModalConfirm
import ModalConfirm from '../Modal/ModalConfirm'; // Pastikan path ini benar

// --- Opsi untuk Dropdown/Radio/Checkbox ---
const wilayahOptions = [
  "Wilker Pangkal Balam",
  "Wilker Muntok",
  "Wilker Belinyu",
  "Wilker Sungai Selan",
  "Pos Sadai",
  "Wilker Tanjung Pandan",
  "Wilker Manggar",
  "Pos Bandara Depati Amir",
  "Pos Bandara HAS Hanandjoeddin",
  "Kantor Induk",
];

const jenisKelaminOptions = ["Laki-laki", "Perempuan"];

// Opsi untuk Status Perjalanan (sebelumnya Kunjungan Klinik)
const statusPerjalananOptions = ["Pelaku Perjalanan", "Non Pelaku Perjalanan"];

// Opsi untuk bagian Status Pelaku Perjalanan
const statusDatangBerangkatOptions = ["Datang", "Berangkat"];
const crewPenumpangOptions = ["Crew", "Penumpang", "Other"];

const faktorRisikoPelakuOptions = [
  "Suhu tinggi>= 37,5",
  "Covid 19",
  "Sakit",
  "Saturasi <95",
  "Hamil >=22 minggu",
  "Hb <8,5",
  "Belum Vaksin Internasional",
  "ICV Palsu/ Exp",
  "HIV",
  "TB",
  "Malaria Positif",
  "Bayi < 48 Jam",
  "Penggantian Crew Pesawat",
  "Other",
];

const tindakanPengendalianPelakuOptions = [
  "rujukan",
  "isolasi",
  "Vaksinasi",
  "Tolak Berangkat",
  "Pengobatan/Penanganan",
  "Izin Angkut Orang Sakit",
  "Surat Layar Terbang",
  "Rekomendasi Perjalanan",
  "Notifikasi",
  "Penindakan",
  "Rekomendasi Tolak Masuk (Surat)",
];

// Opsi untuk bagian Status Non Pelaku Perjalanan
const faktorRisikoNonPelakuOptions = [
  "Suhu tinggi>= 37,5",
  "Covid 19",
  "Sakit",
  "Saturasi <95",
  "Hamil >=22 minggu",
  "Hb <8,5",
  "Belum Vaksin Internasional",
  "ICV Palsu/ Exp",
  "HIV/TB/Malaria Positif",
  "Penyakit menular yang menimbulkan wabah",
  "Bayi < 48 Jam",
  "Other",
];

const tindakanPengendalianNonPelakuOptions = [
  "rujukan",
  "isolasi",
  "Vaksinasi",
  "Tunda Vaksin",
  "Penerbitan ICV",
  "Pengobatan/Penanganan",
  "Notifikasi",
  "Penindakan",
  "Surat Keterangan Sehat",
];

// URL API Laravel Anda - Ganti dengan URL backend Laravel Anda yang sebenarnya
const API_URL = "http://localhost:8000/api/orang-pengendalian";


// Komponen sekarang mengelola statenya sendiri
export default function OrangPengendalianForm() { // Tidak lagi menerima props terkait data/handler
  // State untuk menyimpan data form
  const [formData, setFormData] = useState({
    tanggal: "",
    wilayahKerja: "",
    namaPetugas: "",
    namaLengkap: "",
    nik: "",
    jenisKelamin: "",
    umur: "",
    contactPerson: "",
    kunjunganKlinik: "", // Status Perjalanan

    // Fields khusus Non Pelaku Perjalanan (akan diisi jika kunjunganKlinik = 'Non Pelaku Perjalanan')
    alamatKtpNonPelaku: "",
    alamatDomisiliNonPelaku: "",
    pekerjaanNonPelaku: "",
    hasilPemeriksaanNonPelaku: "",
    faktorRisikoNonPelaku: [], // Array untuk checkbox
    lainnya_faktorRisikoNonPelaku: "",
    diagnosaMedisNonPelaku: "",
    tindakanPengendalianNonPelaku: [], // Array untuk checkbox
    keteranganNonPelaku: "",

    // Fields khusus Pelaku Perjalanan (akan diisi jika kunjunganKlinik = 'Pelaku Perjalanan')
    statusDatangBerangkat: "",
    crewPenumpang: "",
    lainnya_crewPenumpang: "",
    namaAlatAngkut: "",
    alamatAsal: "",
    alamatTujuan: "",
    pekerjaanPelaku: "",
    hasilPemeriksaanPelaku: "",
    faktorRisikoPelaku: [], // Array untuk checkbox
    lainnya_faktorRisikoPelaku: "",
    diagnosaMedisPelaku: "",
    tindakanPengendalianPelaku: [], // Array untuk checkbox
    keteranganPelaku: "",
  });

  // State untuk menyimpan error validasi dari backend
  const [errors, setErrors] = useState({});
  // State untuk status loading saat submit
  const [loading, setLoading] = useState(false);
  // State BARU untuk mengontrol modal sukses
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  // Ref untuk mengelola fokus input
  const inputRefs = useRef({});

  // Helper untuk merender pesan error
  const renderError = (field) =>
    errors[field] ? (
      <div className={styles.errorText}>{errors[field]}</div>
    ) : null;

  // Handler untuk perubahan input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Reset status sukses saat ada perubahan input
    setShowSuccessModal(false); // Tutup modal sukses jika user mulai mengedit lagi

    // Handle checkbox input
    if (type === "checkbox") {
      setFormData((prevFormData) => {
        const currentValues = Array.isArray(prevFormData[name])
          ? prevFormData[name]
          : [];
        if (checked) {
          // Add value if checked and not already in array
          if (!currentValues.includes(value)) {
            return {
              ...prevFormData,
              [name]: [...currentValues, value],
            };
          }
        } else {
          // Remove value if unchecked
          return {
            ...prevFormData,
            [name]: currentValues.filter((item) => item !== value),
          };
        }
        return prevFormData; // No change if value already exists/doesn't exist as expected
      });
    }
    // Handle other input types (text, date, select, textarea, tel)
    else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // Clear error for the specific field when it changes
    if (errors[name]) {
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[name];
             // Also clear error for 'Other' field if the main field is changed
            if (name.startsWith('faktorRisiko') || name === 'crewPenumpang') {
                 const otherFieldName = `lainnya_${name}`;
                 if (newErrors[otherFieldName]) {
                     delete newErrors[otherFieldName];
                 }
            }
            return newErrors;
        });
    }
  };

  // Handler untuk submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman default

    setLoading(true); // Aktifkan status loading
    setErrors({}); // Reset error sebelumnya
    setShowSuccessModal(false); // Pastikan modal sukses tertutup sebelum submit baru

    // Persiapkan data untuk dikirim
    const dataToSend = { ...formData };

    // Hapus field yang tidak relevan berdasarkan kunjunganKlinik sebelum mengirim
    if (dataToSend.kunjunganKlinik === 'Non Pelaku Perjalanan') {
        delete dataToSend.statusDatangBerangkat;
        delete dataToSend.crewPenumpang;
        delete dataToSend.lainnya_crewPenumpang;
        delete dataToSend.namaAlatAngkut;
        delete dataToSend.alamatAsal;
        delete dataToSend.alamatTujuan;
        delete dataToSend.pekerjaanPelaku;
        delete dataToSend.hasilPemeriksaanPelaku;
        delete dataToSend.faktorRisikoPelaku;
        delete dataToSend.lainnya_faktorRisikoPelaku;
        delete dataToSend.diagnosaMedisPelaku;
        delete dataToSend.tindakanPengendalianPelaku;
        delete dataToSend.keteranganPelaku;

        if (!Array.isArray(dataToSend.faktorRisikoNonPelaku) || !dataToSend.faktorRisikoNonPelaku.includes('Other')) {
             delete dataToSend.lainnya_faktorRisikoNonPelaku;
        }

    } else if (dataToSend.kunjunganKlinik === 'Pelaku Perjalanan') {
        delete dataToSend.alamatKtpNonPelaku;
        delete dataToSend.alamatDomisiliNonPelaku;
        delete dataToSend.pekerjaanNonPelaku;
        delete dataToSend.hasilPemeriksaanNonPelaku;
        delete dataToSend.faktorRisikoNonPelaku;
        delete dataToSend.lainnya_faktorRisikoNonPelaku;
        delete dataToSend.diagnosaMedisNonPelaku;
        delete dataToSend.tindakanPengendalianNonPelaku;
        delete dataToSend.keteranganNonPelaku;

         if (!Array.isArray(dataToSend.faktorRisikoPelaku) || !dataToSend.faktorRisikoPelaku.includes('Other')) {
             delete dataToSend.lainnya_faktorRisikoPelaku;
         }
         if (dataToSend.crewPenumpang !== 'Other') {
             delete dataToSend.lainnya_crewPenumpang;
         }

    } else {
        // Jika status kunjunganKlinik belum dipilih, hapus semua field dinamis
         delete dataToSend.alamatKtpNonPelaku;
        delete dataToSend.alamatDomisiliNonPelaku;
        delete dataToSend.pekerjaanNonPelaku;
        delete dataToSend.hasilPemeriksaanNonPelaku;
        delete dataToSend.faktorRisikoNonPelaku;
        delete dataToSend.lainnya_faktorRisikoNonPelaku;
        delete dataToSend.diagnosaMedisNonPelaku;
        delete dataToSend.tindakanPengendalianNonPelaku;
        delete dataToSend.keteranganNonPelaku;
         delete dataToSend.statusDatangBerangkat;
        delete dataToSend.crewPenumpang;
        delete dataToSend.lainnya_crewPenumpang;
        delete dataToSend.namaAlatAngkut;
        delete dataToSend.alamatAsal;
        delete dataToSend.alamatTujuan;
        delete dataToSend.pekerjaanPelaku;
        delete dataToSend.hasilPemeriksaanPelaku;
        delete dataToSend.faktorRisikoPelaku;
        delete dataToSend.lainnya_faktorRisikoPelaku;
        delete dataToSend.diagnosaMedisPelaku;
        delete dataToSend.tindakanPengendalianPelaku;
        delete dataToSend.keteranganPelaku;
    }


    try {
      const response = await axios.post(API_URL, dataToSend);

      console.log("Data berhasil dikirim:", response.data);
      // setSuccess(true); // Hapus ini
      setShowSuccessModal(true); // Tampilkan modal sukses

      // Opsional: Reset form setelah sukses
      setFormData({
        tanggal: "",
        wilayahKerja: "",
        namaPetugas: "",
        namaLengkap: "",
        nik: "",
        jenisKelamin: "",
        umur: "",
        contactPerson: "",
        kunjunganKlinik: "",

        alamatKtpNonPelaku: "",
        alamatDomisiliNonPelaku: "",
        pekerjaanNonPelaku: "",
        hasilPemeriksaanNonPelaku: "",
        faktorRisikoNonPelaku: [],
        lainnya_faktorRisikoNonPelaku: "",
        diagnosaMedisNonPelaku: "",
        tindakanPengendalianNonPelaku: [],
        keteranganNonPelaku: "",

        statusDatangBerangkat: "",
        crewPenumpang: "",
        lainnya_crewPenumpang: "",
        namaAlatAngkut: "",
        alamatAsal: "",
        alamatTujuan: "",
        pekerjaanPelaku: "",
        hasilPemeriksaanPelaku: "",
        faktorRisikoPelaku: [],
        lainnya_faktorRisikoPelaku: "",
        diagnosaMedisPelaku: "",
        tindakanPengendalianPelaku: [],
        keteranganPelaku: "",
      });

    } catch (error) {
      console.error("Error saat mengirim data:", error);

      // Tangani error validasi dari Laravel (status 422)
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
         // Optional: Focus on the first field with an error
         const firstErrorField = Object.keys(error.response.data.errors)[0];
         if (inputRefs.current[firstErrorField]) {
             inputRefs.current[firstErrorField].focus();
         }
      } else {
        // Tangani error lainnya (network, server error 500, dll)
        // Anda bisa menampilkan modal error lain di sini jika perlu
        alert("Terjadi kesalahan saat menyimpan data. Mohon coba lagi.");
      }
    } finally {
      setLoading(false); // Matikan status loading
    }
  };

  // Handler untuk menutup modal sukses
  const handleCloseSuccessModal = () => {
      setShowSuccessModal(false);
      // Logika tambahan setelah modal sukses ditutup, jika ada (misalnya, navigasi)
  };


  // --- Helper untuk merender Dropdown (Select) ---
  // Menggunakan state internal formData, errors, dan ref internal inputRefs
  const renderSelect = (name, label, options, required, otherInputName = null) => (
    <label className={styles.formLabel}> {/* Menggunakan label untuk dropdown */}
      {label}{required && <span className={styles.required}>*</span>}
      <select
        ref={(ref) => (inputRefs.current[name] = ref)} // Set ref ke elemen select internal
        className={styles.formSelect}
        name={name}
        value={formData[name] || ""} // Menggunakan state internal
        onChange={handleChange} // Menggunakan handler internal
      >
        <option value="">Choose</option> {/* Opsi default */}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {renderError(name)} {/* Menggunakan helper renderError internal */}
      {/* Render input 'Other' jika opsi 'Other'/'Lainnya' dipilih dan otherInputName disediakan */}
      {otherInputName && (formData[name] === "Other" || formData[name] === "Lainnya") && (
         <input
           type="text"
           name={otherInputName}
           value={formData[otherInputName] || ""} // Menggunakan state internal
           onChange={handleChange} // Menggunakan handler internal
           className={styles.formInput}
           placeholder="Isi lainnya"
           style={{ marginTop: 8 }}
           ref={(ref) => (inputRefs.current[otherInputName] = ref)} // Set ref internal
         />
      )}
      {/* Render error untuk field 'Other' jika ada */}
      {otherInputName && renderError(otherInputName)} {/* Menggunakan helper renderError internal */}
    </label>
  );

  // Helper untuk merender grup Checkbox
  // Menggunakan state internal formData, errors, dan ref internal inputRefs
  const renderCheckboxGroup = (name, label, options, required, otherInputName = null) => (
      <div className={styles.formLabel}>
          {label}{required && <span className={styles.required}>*</span>}
          <div>
              {options.map((opt, index) => {
                  // Menggunakan state internal
                  const isChecked = Array.isArray(formData[name]) && formData[name].includes(opt);
                  return (
                      <label
                          key={opt}
                          style={{
                              display: "flex",
                              alignItems: "center",
                              margin: "6px 0",
                          }}
                      >
                          <input
                              type="checkbox"
                              name={name}
                              value={opt}
                              checked={isChecked}
                              onChange={handleChange} // Menggunakan handler internal
                               // Set ref ke input checkbox pertama di grup internal
                              ref={index === 0 ? (ref) => (inputRefs.current[name] = ref) : null}
                              style={{ marginRight: 8 }}
                          />
                          {opt}
                          {/* Render input 'Other' jika opsi 'Other' dicentang dan otherInputName disediakan */}
                          {otherInputName && opt === "Other" && isChecked && (
                              <input
                                  type="text"
                                  name={otherInputName}
                                  value={formData[otherInputName] || ""} // Menggunakan state internal
                                  onChange={handleChange} // Menggunakan handler internal
                                  className={styles.formInput}
                                  placeholder="Isi lainnya"
                                  style={{ marginLeft: 8 }}
                                  ref={(ref) => (inputRefs.current[otherInputName] = ref)} // Set ref internal
                              />
                          )}
                      </label>
                  );
              })}
          </div>
          {renderError(name)} {/* Menggunakan helper renderError internal */}
           {/* Render error untuk field 'Other' jika ada */}
          {otherInputName && renderError(otherInputName)} {/* Menggunakan helper renderError internal */}
      </div>
  );


  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>Form Pengendalian Orang</div>
      {/* Hapus elemen teks sukses yang lama */}
      {/*
      {success && (
        <div className={styles.successText} style={{ marginBottom: 16 }}>
          Data berhasil dikirim!
        </div>
      )}
      */}
      {/* Menggunakan handler internal */}
      <form onSubmit={handleSubmit} autoComplete="off">

        {/* --- Inputan Utama (Universal) --- */}

        {/* Tanggal */}
        <label className={styles.formLabel}>
          Tanggal<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.current.tanggal = ref)} // Menggunakan ref internal
            className={styles.formInput}
            type="date"
            name="tanggal"
            value={formData.tanggal || ""} // Menggunakan state internal
            onChange={handleChange} // Menggunakan handler internal
            placeholder="dd/mm/yyyy"
          />
          {renderError("tanggal")} {/* Menggunakan helper renderError internal */}
        </label>

        {/* Wilayah Kerja (Dropdown) */}
        {renderSelect("wilayahKerja", "Wilayah Kerja", wilayahOptions, true)}

        {/* Nama Petugas */}
        <label className={styles.formLabel}>
          Nama Petugas<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.current.namaPetugas = ref)} // Menggunakan ref internal
            className={styles.formInput}
            type="text"
            name="namaPetugas"
            value={formData.namaPetugas || ""} // Menggunakan state internal
            onChange={handleChange} // Menggunakan handler internal
            placeholder="Your answer"
          />
          {renderError("namaPetugas")} {/* Menggunakan helper renderError internal */}
        </label>

        {/* Nama Lengkap */}
        <label className={styles.formLabel}>
          Nama Lengkap<span className={styles.required}>*</span>
          <div className={styles.formSubLabel}>Orang yang terdeteksi faktor risiko</div>
          <input
            ref={(ref) => (inputRefs.current.namaLengkap = ref)} // Menggunakan ref internal
            className={styles.formInput}
            type="text"
            name="namaLengkap"
            value={formData.namaLengkap || ""} // Menggunakan state internal
            onChange={handleChange} // Menggunakan handler internal
            placeholder="Your answer"
          />
          {renderError("namaLengkap")} {/* Menggunakan helper renderError internal */}
        </label>

        {/* NIK */}
         <label className={styles.formLabel}>
          NIK<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.current.nik = ref)} // Menggunakan ref internal
            className={styles.formInput}
            type="text"
            name="nik"
            value={formData.nik || ""} // Menggunakan state internal
            onChange={handleChange} // Menggunakan handler internal
            placeholder="Your answer"
          />
          {renderError("nik")} {/* Menggunakan helper renderError internal */}
        </label>

        {/* Jenis Kelamin (Dropdown) */}
        {renderSelect("jenisKelamin", "Jenis Kelamin", jenisKelaminOptions, true)}

        {/* Umur */}
        <label className={styles.formLabel}>
          Umur<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.current.umur = ref)} // Menggunakan ref internal
            className={styles.formInput}
            type="text"
            name="umur"
            value={formData.umur || ""} // Menggunakan state internal
            onChange={handleChange} // Menggunakan handler internal
            placeholder="Your answer"
          />
          {renderError("umur")} {/* Menggunakan helper renderError internal */}
        </label>

        {/* Contact Person */}
         <label className={styles.formLabel}>
          Contact Person<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.current.contactPerson = ref)} // Menggunakan ref internal
            className={styles.formInput}
            type="tel"
            name="contactPerson"
            value={formData.contactPerson || ""} // Menggunakan state internal
            onChange={handleChange} // Menggunakan handler internal
            placeholder="Your answer"
          />
          {renderError("contactPerson")} {/* Menggunakan helper renderError internal */}
        </label>

        {/* Status Perjalanan (Dropdown - Penentu bagian dinamis) */}
        {/* Menggunakan nama field "kunjunganKlinik" agar konsisten dengan parent */}
        {renderSelect("kunjunganKlinik", "Status Perjalanan", statusPerjalananOptions, true)}


        {/* --- Bagian Dinamis Berdasarkan Status Perjalanan --- */}

        {/* Bagian: Status Non Pelaku Perjalanan */}
        {/* Menggunakan state internal */}
        {formData.kunjunganKlinik === 'Non Pelaku Perjalanan' && (
            <div className={styles.dynamicSection}>
                <div className={styles.formTitle} style={{ marginTop: 20 }}>Status Non Pelaku Perjalanan</div>

                {/* Alamat KTP */}
                <label className={styles.formLabel}>
                    Alamat KTP<span className={styles.required}>*</span>
                    <div className={styles.formSubLabel}>Alamat : Desa/Kelurahan, Kecamatan, Kabupaten/Kota</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.alamatKtpNonPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="alamatKtpNonPelaku"
                        value={formData.alamatKtpNonPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("alamatKtpNonPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                 {/* Alamat Domisili */}
                <label className={styles.formLabel}>
                    Alamat Domisili<span className={styles.required}>*</span>
                     <div className={styles.formSubLabel}>Alamat : Desa/Kelurahan, Kecamatan, Kabupaten/Kota</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.alamatDomisiliNonPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="alamatDomisiliNonPelaku"
                        value={formData.alamatDomisiliNonPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("alamatDomisiliNonPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Pekerjaan Non Pelaku Perjalanan */}
                 <label className={styles.formLabel}>
                    Pekerjaan<span className={styles.required}>*</span>
                    <input
                        ref={(ref) => (inputRefs.current.pekerjaanNonPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        type="text"
                        name="pekerjaanNonPelaku"
                        value={formData.pekerjaanNonPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                    />
                    {renderError("pekerjaanNonPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Hasil Pemeriksaan Non Pelaku Perjalanan */}
                 <label className={styles.formLabel}>
                    Hasil Pemeriksaan<span className={styles.required}>*</span>
                    <div className={styles.formSubLabel}>Anamnesis, KU, Riwayat Penyakit, Tanda-tanda Vital</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.hasilPemeriksaanNonPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="hasilPemeriksaanNonPelaku"
                        value={formData.hasilPemeriksaanNonPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("hasilPemeriksaanNonPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Faktor Risiko yang Ditemukan Non Pelaku Perjalanan (Checkbox) */}
                {renderCheckboxGroup("faktorRisikoNonPelaku", "Faktor Risiko yang Ditemukan", faktorRisikoNonPelakuOptions, true, "lainnya_faktorRisikoNonPelaku")}

                {/* Diagnosa Medis Non Pelaku Perjalanan */}
                 <label className={styles.formLabel}>
                    Diagnosa Medis<span className={styles.required}>*</span>
                    <input
                        ref={(ref) => (inputRefs.current.diagnosaMedisNonPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        type="text"
                        name="diagnosaMedisNonPelaku"
                        value={formData.diagnosaMedisNonPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                    />
                    {renderError("diagnosaMedisNonPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Tindakan Pengendalian Non Pelaku Perjalanan (Checkbox) */}
                {renderCheckboxGroup("tindakanPengendalianNonPelaku", "Tindakan Pengendalian", tindakanPengendalianNonPelakuOptions, true)}

                 {/* Keterangan Non Pelaku Perjalanan */}
                <label className={styles.formLabel}>
                    Keterangan<span className={styles.required}>*</span>
                    <div className={styles.formSubLabel}>Misalnya, dirujuk ke Rumah Sakit Arsani, Notifikasi ke Dinkes Kota Pangkalpinang, Berita Acara, dll.</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.keteranganNonPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="keteranganNonPelaku"
                        value={formData.keteranganNonPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("keteranganNonPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

            </div>
        )}

         {/* Bagian: Status Pelaku Perjalanan */}
         {/* Menggunakan state internal */}
        {formData.kunjunganKlinik === 'Pelaku Perjalanan' && (
            <div className={styles.dynamicSection}>
                 <div className={styles.formTitle} style={{ marginTop: 20 }}>Status Pelaku Perjalanan</div>

                {/* Datang/Berangkat (Dropdown) */}
                {renderSelect("statusDatangBerangkat", "Datang/Berangkat", statusDatangBerangkatOptions, true)}

                {/* Crew/Penumpang (Dropdown) */}
                {renderSelect("crewPenumpang", "Crew/Penumpang", crewPenumpangOptions, true, "lainnya_crewPenumpang")}

                {/* Nama Alat Angkut */}
                 <label className={styles.formLabel}>
                    Nama Alat Angkut<span className={styles.required}>*</span>
                    <input
                        ref={(ref) => (inputRefs.current.namaAlatAngkut = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        type="text"
                        name="namaAlatAngkut"
                        value={formData.namaAlatAngkut || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                    />
                    {renderError("namaAlatAngkut")} {/* Menggunakan helper renderError internal */}
                </label>

                 {/* Alamat Asal */}
                <label className={styles.formLabel}>
                    Alamat Asal<span className={styles.required}>*</span>
                    <div className={styles.formSubLabel}>Alamat : Desa/Kelurahan, Kecamatan, Kabupaten/Kota</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.alamatAsal = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="alamatAsal"
                        value={formData.alamatAsal || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("alamatAsal")} {/* Menggunakan helper renderError internal */}
                </label>

                 {/* Alamat Tujuan */}
                <label className={styles.formLabel}>
                    Alamat Tujuan<span className={styles.required}>*</span>
                     <div className={styles.formSubLabel}>Alamat : Desa/Kelurahan, Kecamatan, Kabupaten/Kota</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.alamatTujuan = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="alamatTujuan"
                        value={formData.alamatTujuan || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                         rows="3"
                    />
                    {renderError("alamatTujuan")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Pekerjaan Pelaku Perjalanan */}
                 <label className={styles.formLabel}>
                    Pekerjaan Pelaku Perjalanan<span className={styles.required}>*</span>
                    <input
                        ref={(ref) => (inputRefs.current.pekerjaanPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        type="text"
                        name="pekerjaanPelaku"
                        value={formData.pekerjaanPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                    />
                    {renderError("pekerjaanPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Hasil Pemeriksaan Pelaku Perjalanan */}
                 <label className={styles.formLabel}>
                    Hasil Pemeriksaan Pelaku Perjalanan<span className={styles.required}>*</span>
                     <div className={styles.formSubLabel}>Anamnesis, KU, Riwayat Penyakit, Tanda-tanda Vital</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.hasilPemeriksaanPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="hasilPemeriksaanPelaku"
                        value={formData.hasilPemeriksaanPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("hasilPemeriksaanPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Faktor Risiko yang Ditemukan Pelaku Perjalanan (Checkbox) */}
                {renderCheckboxGroup("faktorRisikoPelaku", "Faktor Risiko yang Ditemukan Pelaku Perjalanan", faktorRisikoPelakuOptions, true, "lainnya_faktorRisikoPelaku")}

                {/* Diagnosa Medis Pelaku Perjalanan */}
                 <label className={styles.formLabel}>
                    Diagnosa Medis Pelaku Perjalanan<span className={styles.required}>*</span>
                    <input
                        ref={(ref) => (inputRefs.current.diagnosaMedisPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        type="text"
                        name="diagnosaMedisPelaku"
                        value={formData.diagnosaMedisPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                    />
                    {renderError("diagnosaMedisPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

                {/* Tindakan Pengendalian Pelaku Perjalanan (Checkbox) */}
                {renderCheckboxGroup("tindakanPengendalianPelaku", "Tindakan Pengendalian Pelaku Perjalanan", tindakanPengendalianPelakuOptions, true)}

                 {/* Keterangan Pelaku Perjalanan */}
                <label className={styles.formLabel}>
                    Keterangan Pelaku Perjalanan<span className={styles.required}>*</span>
                    <div className={styles.formSubLabel}>Misalnya, dirujuk ke Rumah Sakit Arsani, Notifikasi ke Dinkes Kota Pangkalpinang, Berita Acara, dll.</div>
                    <textarea
                        ref={(ref) => (inputRefs.current.keteranganPelaku = ref)} // Menggunakan ref internal
                        className={styles.formInput}
                        name="keteranganPelaku"
                        value={formData.keteranganPelaku || ""} // Menggunakan state internal
                        onChange={handleChange} // Menggunakan handler internal
                        placeholder="Your answer"
                        rows="3"
                    />
                    {renderError("keteranganPelaku")} {/* Menggunakan helper renderError internal */}
                </label>

            </div>
        )}


        {/* Tombol Submit */}
        <button
          type="submit"
          className={styles.formButton}
          disabled={loading} // Menggunakan state internal
        >
          {loading ? "Mengirim..." : "Submit"} {/* Menggunakan state internal */}
        </button>
      </form>

      {/* Modal Sukses */}
      <ModalConfirm
        open={showSuccessModal} // Dikontrol oleh state showSuccessModal
        title="Data Berhasil Dikirim" // Judul modal sukses
        text="Data orang berhasil dikirimkan." // Teks pesan sukses
        onCancel={handleCloseSuccessModal} // Tombol Batal akan menutup modal
        onConfirm={handleCloseSuccessModal} // Tombol Konfirmasi akan menutup modal
      />

    </div>
  );
}

// PropTypes sekarang hanya bersifat dokumentasi karena komponen mengelola state sendiri
// Anda bisa menghapusnya jika tidak diperlukan
OrangPengendalianForm.propTypes = {
    // Prop types ini tidak lagi relevan karena state dikelola di sini
    // formData: PropTypes.object, // Dihapus
    // errors: PropTypes.object, // Dihapus
    // onChange: PropTypes.func, // Dihapus
    // onSubmit: PropTypes.func, // Dihapus
    // loading: PropTypes.bool, // Dihapus
    // success: PropTypes.bool, // Dihapus
    // inputRefs: PropTypes.object, // Dihapus
    // showSuccessModal: PropTypes.bool, // Dihapus
    // onCloseSuccessModal: PropTypes.func, // Dihapus
};
