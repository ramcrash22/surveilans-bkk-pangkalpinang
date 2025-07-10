import React, { useState, useRef } from "react"; // Tambahkan useRef jika belum ada
import styles from "./KapalLautKeberangkatanForm.module.css"; // Pastikan path CSS sudah benar, meskipun namanya "KeberangkatanForm.module.css"

// Pilihan
const wilayahOptions = ["Wilayah 1", "Wilayah 2", "Wilayah 3"];
const jenisAlatAngkutOptions = ["Ferry", "Non Ferry", "Other"];
const penyebabPengendalianOptions = [
  "Hasil Pemeriksaan BKK - Dokumen",
  "Hasil Pemeriksaan BKK - Sanitasi",
  "Hasil Pemeriksaan BKK - Vektor",
  "Hasil Pemeriksaan BKK - Restricted Pratique",
  "Selesai Docking",
  "Permintaan Owner Kapal",
  "Other"
];
const jenisPengendalianOptions = [
  "KIE",
  "Rekomendasi",
  "Karantina",
  "Desinfeksi",
  "Desinseksi",
  "Dekontaminasi",
  "Deratisasi / Fumigasi",
  "OME",
  "Other"
];
const dokumenDiterbitkanOptions = [
  "Surat Bebas Karantina",
  "SSCC",
  "Other"
];

const requiredFields = [
  "tanggal", "wilayah", "namaPetugas", "jabatan", "namaAlatAngkut",
  "jenisAlatAngkut", "benderaAlatAngkut", "volume", "penyebabPengendalian",
  "jenisPengendalian", "namaBUS", "dokumenDiterbitkan"
];

const numberFields = ["volume"];

// Field "Other" yang memerlukan input teks tambahan
const otherTextFields = {
  jenisAlatAngkut: "jenisAlatAngkutOther",
  penyebabPengendalian: "penyebabPengendalianOther",
  jenisPengendalian: "jenisPengendalianOther",
  dokumenDiterbitkan: "dokumenDiterbitkanOther",
};


export default function KapalLautPengendalianForm({
  formData,
  onChange,
  onSubmit, // Prop onSubmit ini bisa digunakan jika Anda ingin logika submit di komponen induk
  inputRefs, // Pastikan inputRefs ini dibuat menggunakan useRef di komponen induk
}) {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null); // State untuk error submit API

  // Handler perubahan
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let val = value;
     // Reset submit error saat ada perubahan input
    setSubmitError(null);

    if (type === "file") {
      // Untuk file, simpan objek File-nya
       // Validasi ukuran file saat dipilih
      if (files[0] && files[0].size > 1024 * 1024) {
         setErrors((prev) => ({
            ...prev,
            [name]: "Ukuran file maksimal 1MB"
         }));
         // Jangan update formData jika file terlalu besar
         return;
      } else {
         setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error jika ukuran valid
      }
      onChange({
        ...formData,
        [name]: files[0] // Simpan objek File
      });
      return;
    }

    if (numberFields.includes(name)) {
      // Validasi dasar untuk angka non-negatif
      if (val === "" || isNaN(Number(val)) || Number(val) < 0) {
         // Jangan langsung set error di sini, biarkan validasi akhir yang melakukannya
         // Hanya pastikan nilai yang disimpan adalah string kosong jika input tidak valid
         val = val === "" ? "" : val; // Simpan apa adanya jika bukan string kosong untuk feedback visual
      } else {
         val = Number(val); // Konversi ke number jika valid
      }
       setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error saat input berubah
    } else {
       setErrors((prev) => ({ ...prev, [name]: undefined })); // Clear error saat input berubah
    }

    onChange({
      ...formData,
      [name]: val,
    });
  };

  // Handler untuk input "Other" pada dropdown
  const handleOtherChange = (mainField, otherField, value) => {
     setSubmitError(null); // Reset submit error saat ada perubahan input
     setErrors((prev) => ({ ...prev, [otherField]: undefined })); // Clear error spesifik Other
    onChange({
      ...formData,
      [mainField]: "Other", // Pastikan main field tetap "Other"
      [otherField]: value,
    });
  };

  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null); // Reset error submit
    setSuccess(false); // Reset success message

    const newErrors = {};

    // Validasi umum
    for (const field of requiredFields) {
      const val = formData[field];
      if (
        val === undefined ||
        val === "" ||
        (numberFields.includes(field) && (val === "" || isNaN(Number(val)) || Number(val) < 0)) // Cek angka lagi secara ketat
      ) {
        newErrors[field] = numberFields.includes(field)
          ? "Nilai harus angka positif atau nol"
          : "Bagian ini wajib diisi";
      }
    }
    // Validasi "Other" dropdown
    Object.keys(otherTextFields).forEach(mainField => {
        const otherField = otherTextFields[mainField];
        if (formData[mainField] === "Other" && (!formData[otherField] || formData[otherField].trim() === "")) {
            newErrors[otherField] = "Bagian ini wajib diisi jika memilih 'Lainnya'";
        }
    });

    // Validasi file max 1MB (cek lagi saat submit)
    if (formData.dokumenPelaksanaan && formData.dokumenPelaksanaan.size > 1024 * 1024) {
         newErrors.dokumenPelaksanaan = "Ukuran file maksimal 1MB";
    }


    setErrors(newErrors);

    // Jika ada error validasi, berhenti dan fokus ke field pertama yang error
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      // Gabungkan semua field yang mungkin memiliki error untuk menentukan fokus pertama
      const allPossibleErrorFields = [
        ...requiredFields,
        ...Object.values(otherTextFields),
        "dokumenPelaksanaan"
      ];
      const firstErrorField = allPossibleErrorFields.find((f) => newErrors[f]);

      if (firstErrorField && inputRefs[firstErrorField] && inputRefs[firstErrorField].current) {
        inputRefs[firstErrorField].current.focus();
        inputRefs[firstErrorField].current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return; // Hentikan proses submit jika ada error
    }

    // --- LOGIKA PENGIRIMAN DATA KE API DIMULAI DI SINI ---
    try {
      // Untuk mengirim data form yang mencakup file, kita perlu menggunakan FormData.
      // FormData akan secara otomatis mengatur header Content-Type menjadi multipart/form-data.

      const formDataToSend = new FormData();

      // Tambahkan semua field data form ke FormData
      Object.keys(formData).forEach(key => {
          // Lewati field 'Other' yang tidak perlu dikirim jika main field-nya bukan 'Other'
          const isOtherField = Object.values(otherTextFields).includes(key);
          const mainFieldForOther = Object.keys(otherTextFields).find(main => otherTextFields[main] === key);

          if (isOtherField && formData[mainFieldForOther] !== "Other") {
              // Jika ini field 'Other' tapi pilihan utamanya bukan 'Other', jangan kirim
              return;
          }

          // Jika ini field file, tambahkan objek File-nya
          if (key === "dokumenPelaksanaan" && formData[key] instanceof File) {
               formDataToSend.append(key, formData[key], formData[key].name);
          } else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== "") {
              // Tambahkan field lain yang memiliki nilai
              formDataToSend.append(key, formData[key]);
          }
      });


      const API_URL = "http://localhost:8000/api/kapal-laut/pengendalian"; // <--- GANTI DENGAN URL API ASLI ANDA
      // Contoh: "http://localhost:8000/api/kapal-laut/pengendalian" atau "https://namaaplikasianda.com/api/kapal-laut/pengendalian"

      const response = await fetch(API_URL, {
        method: "POST",
        // Penting: Jangan set header 'Content-Type' secara manual saat menggunakan FormData.
        // Browser akan menanganinya secara otomatis dengan boundary multipart.
        // headers: {
        //   // Tambahkan header lain jika diperlukan, misalnya untuk otentikasi (Bearer Token, API Key, dll.)
        //   // "Authorization": `Bearer ${yourAuthToken}`,
        // },
        body: formDataToSend, // Kirim data menggunakan FormData
      });

      // Periksa apakah respons HTTP sukses (status code 2xx)
      if (!response.ok) {
        // Tangani error dari server (misalnya status 400, 401, 500)
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
             const errorData = await response.json(); // Coba baca pesan error dari body respons
             errorMsg = errorData.message || JSON.stringify(errorData);
        } catch (jsonError) {
            // Abaikan jika gagal membaca JSON, gunakan pesan default
        }
        throw new Error(errorMsg);
      }

      // Jika respons sukses
      const result = await response.json(); // Baca respons sukses dari server
      console.log("Data berhasil dikirim:", result);

      setSuccess(true); // Tampilkan pesan sukses
      // Opsional: Reset form setelah sukses
      // onChange({}); // Panggil onChange dengan objek kosong jika Anda ingin mereset form di komponen induk

      // Panggil prop onSubmit jika ada (untuk logika tambahan di komponen induk)
      onSubmit && onSubmit(e);

    } catch (error) {
      console.error("Gagal mengirim data:", error);
      setSubmitError(`Gagal mengirim data: ${error.message}`); // Tampilkan pesan error submit ke user
      setSuccess(false); // Pastikan pesan sukses tidak tampil jika ada error
    } finally {
      setLoading(false); // Sembunyikan indikator loading
      // Sembunyikan pesan sukses setelah beberapa detik
      if (success) { // Hanya sembunyikan jika sukses, error biarkan terlihat
         setTimeout(() => setSuccess(false), 5000); // Tampilkan sukses selama 5 detik
      }
    }
    // --- LOGIKA PENGIRIMAN DATA KE API BERAKHIR DI SINI ---
  };

  const renderError = (field) =>
    errors[field] ? (
      <div className={styles.errorText}>{errors[field]}</div>
    ) : null;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>Form Pengendalian Kapal Laut</div> {/* Judul diubah */}
      {/* Tampilkan pesan sukses */}
      {success && (
        <div className={styles.successText} style={{ marginBottom: 16 }}>
          Data berhasil dikirim!
        </div>
      )}
      {/* Tampilkan pesan error submit */}
      {submitError && (
        <div className={styles.errorText} style={{ marginBottom: 16 }}>
          {submitError}
        </div>
      )}
      <form onSubmit={handleInternalSubmit} autoComplete="off">
        {/* Tanggal */}
        <label className={styles.formLabel}>
          Tanggal Pelaksanaan<span className={styles.required}>*</span>
          <input
            ref={inputRefs.tanggal}
            className={styles.formInput}
            type="date"
            name="tanggal"
            value={formData.tanggal || ""}
            onChange={handleChange}
            placeholder="Pilih tanggal"
          />
          {renderError("tanggal")}
        </label>
        {/* Wilayah */}
        <label className={styles.formLabel}>
          Wilayah Kerja/Pos<span className={styles.required}>*</span>
          <select
            ref={inputRefs.wilayah}
            className={styles.formSelect}
            name="wilayah"
            value={formData.wilayah || ""}
            onChange={handleChange}
          >
            <option value="">Choose</option>
            {wilayahOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {renderError("wilayah")}
        </label>
        {/* Nama Petugas */}
        <label className={styles.formLabel}>
          Nama Petugas<span className={styles.required}>*</span>
          <input
            ref={inputRefs.namaPetugas}
            className={styles.formInput}
            type="text"
            name="namaPetugas"
            value={formData.namaPetugas || ""}
            onChange={handleChange}
            placeholder="Your answer"
          />
          {renderError("namaPetugas")}
        </label>
        {/* Jabatan */}
        <label className={styles.formLabel}>
          Jabatan<span className={styles.required}>*</span>
          <input
            ref={inputRefs.jabatan}
            className={styles.formInput}
            type="text"
            name="jabatan"
            value={formData.jabatan || ""}
            onChange={handleChange}
            placeholder="Your answer"
          />
          {renderError("jabatan")}
        </label>
        {/* Nama Alat Angkut */}
        <label className={styles.formLabel}>
          Nama Alat Angkut<span className={styles.required}>*</span>
          <input
            ref={inputRefs.namaAlatAngkut}
            className={styles.formInput}
            type="text"
            name="namaAlatAngkut"
            value={formData.namaAlatAngkut || ""}
            onChange={handleChange}
            placeholder="Your answer"
          />
          {renderError("namaAlatAngkut")}
        </label>
        {/* Jenis Alat Angkut */}
        <label className={styles.formLabel}>
          Jenis Alat Angkut<span className={styles.required}>*</span>
          <select
            ref={inputRefs.jenisAlatAngkut}
            className={styles.formSelect}
            name="jenisAlatAngkut"
            value={formData.jenisAlatAngkut || ""}
            onChange={handleChange}
          >
            <option value="">Pilih Jenis</option>
            {jenisAlatAngkutOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === "Other" ? "Lainnya" : opt}</option>
            ))}
          </select>
          {/* Input teks untuk "Other" */}
          {formData.jenisAlatAngkut === "Other" && (
            <div style={{ marginTop: 8 }}>
              <input
                ref={inputRefs.jenisAlatAngkutOther}
                className={styles.formInput}
                type="text"
                name="jenisAlatAngkutOther" // Nama field untuk data teks "Other"
                value={formData.jenisAlatAngkutOther || ""}
                onChange={(e) => handleOtherChange("jenisAlatAngkut", "jenisAlatAngkutOther", e.target.value)}
                placeholder="Isi jenis alat angkut lain"
              />
              {renderError("jenisAlatAngkutOther")}
            </div>
          )}
          {renderError("jenisAlatAngkut")} {/* Error untuk dropdown utama */}
        </label>
        {/* Bendera Alat Angkut */}
        <label className={styles.formLabel}>
          Bendera Alat Angkut<span className={styles.required}>*</span>
          <input
            ref={inputRefs.benderaAlatAngkut}
            className={styles.formInput}
            type="text"
            name="benderaAlatAngkut"
            value={formData.benderaAlatAngkut || ""}
            onChange={handleChange}
            placeholder="Your answer"
          />
          {renderError("benderaAlatAngkut")}
        </label>
        {/* Volume */}
        <label className={styles.formLabel}>
          Volume<span className={styles.required}>*</span>
          <input
            ref={inputRefs.volume}
            className={styles.formInput}
            type="number"
            name="volume"
            value={formData.volume || ""}
            onChange={handleChange}
            placeholder="Your answer"
            min="0"
          />
          {renderError("volume")}
        </label>
        {/* Penyebab Pengendalian */}
        <label className={styles.formLabel}>
          Penyebab Pengendalian<span className={styles.required}>*</span>
          <select
            ref={inputRefs.penyebabPengendalian}
            className={styles.formSelect}
            name="penyebabPengendalian"
            value={formData.penyebabPengendalian || ""}
            onChange={handleChange}
          >
            <option value="">Pilih Penyebab</option>
            {penyebabPengendalianOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === "Other" ? "Lainnya" : opt}</option>
            ))}
          </select>
           {/* Input teks untuk "Other" */}
          {formData.penyebabPengendalian === "Other" && (
            <div style={{ marginTop: 8 }}>
              <input
                ref={inputRefs.penyebabPengendalianOther}
                className={styles.formInput}
                type="text"
                name="penyebabPengendalianOther" // Nama field untuk data teks "Other"
                value={formData.penyebabPengendalianOther || ""}
                onChange={(e) => handleOtherChange("penyebabPengendalian", "penyebabPengendalianOther", e.target.value)}
                placeholder="Isi penyebab pengendalian lain"
              />
              {renderError("penyebabPengendalianOther")}
            </div>
          )}
          {renderError("penyebabPengendalian")} {/* Error untuk dropdown utama */}
        </label>
        {/* Jenis Pengendalian */}
        <label className={styles.formLabel}>
          Jenis Pengendalian<span className={styles.required}>*</span>
          <select
            ref={inputRefs.jenisPengendalian}
            className={styles.formSelect}
            name="jenisPengendalian"
            value={formData.jenisPengendalian || ""}
            onChange={handleChange}
          >
            <option value="">Pilih Jenis</option>
            {jenisPengendalianOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === "Other" ? "Lainnya" : opt}</option>
            ))}
          </select>
           {/* Input teks untuk "Other" */}
          {formData.jenisPengendalian === "Other" && (
            <div style={{ marginTop: 8 }}>
              <input
                ref={inputRefs.jenisPengendalianOther}
                className={styles.formInput}
                type="text"
                name="jenisPengendalianOther" // Nama field untuk data teks "Other"
                value={formData.jenisPengendalianOther || ""}
                onChange={(e) => handleOtherChange("jenisPengendalian", "jenisPengendalianOther", e.target.value)}
                placeholder="Isi jenis pengendalian lain"
              />
              {renderError("jenisPengendalianOther")}
            </div>
          )}
          {renderError("jenisPengendalian")} {/* Error untuk dropdown utama */}
        </label>
        {/* Nama BUS */}
        <label className={styles.formLabel}>
          Nama BUS / Pelaksana Kegiatan<span className={styles.required}>*</span>
          <input
            ref={inputRefs.namaBUS}
            className={styles.formInput}
            type="text"
            name="namaBUS"
            value={formData.namaBUS || ""}
            onChange={handleChange}
            placeholder="Your answer"
          />
          {renderError("namaBUS")}
        </label>
        {/* Dokumen yang Diterbitkan */}
        <label className={styles.formLabel}>
          Dokumen yang Diterbitkan<span className={styles.required}>*</span>
          <select
            ref={inputRefs.dokumenDiterbitkan}
            className={styles.formSelect}
            name="dokumenDiterbitkan"
            value={formData.dokumenDiterbitkan || ""}
            onChange={handleChange}
          >
            <option value="">Pilih Dokumen</option>
            {dokumenDiterbitkanOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === "Other" ? "Lainnya" : opt}</option>
            ))}
          </select>
           {/* Input teks untuk "Other" */}
          {formData.dokumenDiterbitkan === "Other" && (
            <div style={{ marginTop: 8 }}>
              <input
                ref={inputRefs.dokumenDiterbitkanOther}
                className={styles.formInput}
                type="text"
                name="dokumenDiterbitkanOther" // Nama field untuk data teks "Other"
                value={formData.dokumenDiterbitkanOther || ""}
                onChange={(e) => handleOtherChange("dokumenDiterbitkan", "dokumenDiterbitkanOther", e.target.value)}
                placeholder="Isi dokumen lain"
              />
              {renderError("dokumenDiterbitkanOther")}
            </div>
          )}
          {renderError("dokumenDiterbitkan")} {/* Error untuk dropdown utama */}
        </label>
        {/* Dokumen Pelaksanaan (File Upload) */}
        <label className={styles.formLabel}>
          Dokumen Pelaksanaan
          <textarea
            value="Dokumentasi Kegiatan / Laporan Pengawasan / Berita Acara Pelaksanaan. Upload 1 supported file. Max 1 MB."
            disabled
            className={styles.formInput}
            style={{ marginBottom: 8, resize: "none", height: 60 }}
            tabIndex={-1}
            aria-disabled="true"
          />
          <input
            ref={inputRefs.dokumenPelaksanaan}
            className={styles.formInput}
            type="file"
            name="dokumenPelaksanaan"
            accept="image/*,application/pdf"
            onChange={handleChange}
          />
          {renderError("dokumenPelaksanaan")} {/* Error validasi ukuran/tipe file */}
        </label>
        <button
          type="submit"
          className={styles.formButton}
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
