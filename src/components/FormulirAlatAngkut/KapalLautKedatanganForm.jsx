import React, { useState, useRef } from "react"; // Tambahkan useRef jika belum ada
import styles from "./KapalLautKeberangkatanForm.module.css"; // Pastikan path CSS sudah benar

// --- Komponen Kecil Per Grup Field ---
// ... (Kode DataPetugasSection, DataKapalSection, DataPenumpangSection tetap sama seperti yang Anda berikan)
function DataPetugasSection({ formData, onChange, inputRefs, errors }) {
  return (
    <>
      <label className={styles.formLabel}>
        Nama Petugas<span className={styles.required}>*</span>
        <input
          ref={inputRefs.namaPetugas}
          className={styles.formInput}
          type="text"
          name="namaPetugas"
          value={formData.namaPetugas || ""}
          onChange={onChange}
          placeholder="Masukkan nama petugas"
        />
        {errors.namaPetugas && <div className={styles.errorText}>{errors.namaPetugas}</div>}
      </label>
      <label className={styles.formLabel}>
        Jabatan<span className={styles.required}>*</span>
        <input
          ref={inputRefs.jabatan}
          className={styles.formInput}
          type="text"
          name="jabatan"
          value={formData.jabatan || ""}
          onChange={onChange}
          placeholder="Masukkan jabatan petugas"
        />
        {errors.jabatan && <div className={styles.errorText}>{errors.jabatan}</div>}
      </label>
    </>
  );
}

function DataKapalSection({ formData, onChange, inputRefs, errors }) {
  const jenisKapalOptions = ["Ferry", "Non Ferry"];
  return (
    <>
      <label className={styles.formLabel}>
        Nama Kapal<span className={styles.required}>*</span>
        <input
          ref={inputRefs.namaKapal}
          className={styles.formInput}
          type="text"
          name="namaKapal"
          value={formData.namaKapal || ""}
          onChange={onChange}
          placeholder="Masukkan nama kapal"
        />
        {errors.namaKapal && <div className={styles.errorText}>{errors.namaKapal}</div>}
      </label>
      <label className={styles.formLabel}>
        Lokasi Sandar<span className={styles.required}>*</span>
        <input
          ref={inputRefs.lokasiSandar}
          className={styles.formInput}
          type="text"
          name="lokasiSandar"
          value={formData.lokasiSandar || ""}
          onChange={onChange}
          placeholder="Masukkan lokasi sandar"
        />
        {errors.lokasiSandar && <div className={styles.errorText}>{errors.lokasiSandar}</div>}
      </label>
      <label className={styles.formLabel}>
        Jenis Kapal<span className={styles.required}>*</span>
        <select
          ref={inputRefs.jenisKapal}
          className={styles.formSelect}
          name="jenisKapal"
          value={formData.jenisKapal || ""}
          onChange={onChange}
        >
          <option value="">Pilih jenis kapal</option>
          {jenisKapalOptions.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        {errors.jenisKapal && <div className={styles.errorText}>{errors.jenisKapal}</div>}
      </label>
      <label className={styles.formLabel}>
        Bendera Kapal<span className={styles.required}>*</span>
        <input
          ref={inputRefs.benderaKapal}
          className={styles.formInput}
          type="text"
          name="benderaKapal"
          value={formData.benderaKapal || ""}
          onChange={onChange}
          placeholder="Masukkan bendera kapal"
        />
        {errors.benderaKapal && <div className={styles.errorText}>{errors.benderaKapal}</div>}
      </label>
      <label className={styles.formLabel}>
        Volume<span className={styles.required}>*</span>
        <input
          ref={inputRefs.volume}
          className={styles.formInput}
          type="number"
          name="volume"
          value={formData.volume || ""}
          onChange={onChange}
          placeholder="Volume (angka, tidak boleh minus)"
          min="0"
        />
        {errors.volume && <div className={styles.errorText}>{errors.volume}</div>}
      </label>
    </>
  );
}

function DataPenumpangSection({ formData, onChange, inputRefs, errors }) {
  return (
    <>
      <label className={styles.formLabel}>
        Jumlah ABK WNI<span className={styles.required}>*</span>
        <input
          ref={inputRefs.jumlahABK_WNI}
          className={styles.formInput}
          type="number"
          name="jumlahABK_WNI"
          value={formData.jumlahABK_WNI || ""}
          onChange={onChange}
          placeholder="0"
          min="0"
        />
        {errors.jumlahABK_WNI && <div className={styles.errorText}>{errors.jumlahABK_WNI}</div>}
      </label>
      <label className={styles.formLabel}>
        Jumlah ABK WNA<span className={styles.required}>*</span>
        <input
          ref={inputRefs.jumlahABK_WNA}
          className={styles.formInput}
          type="number"
          name="jumlahABK_WNA"
          value={formData.jumlahABK_WNA || ""}
          onChange={onChange}
          placeholder="0"
          min="0"
        />
        {errors.jumlahABK_WNA && <div className={styles.errorText}>{errors.jumlahABK_WNA}</div>}
      </label>
      <label className={styles.formLabel}>
        Jumlah Penumpang WNI<span className={styles.required}>*</span>
        <input
          ref={inputRefs.jumlahPenumpang_WNI}
          className={styles.formInput}
          type="number"
          name="jumlahPenumpang_WNI"
          value={formData.jumlahPenumpang_WNI || ""}
          onChange={onChange}
          placeholder="0"
          min="0"
        />
        {errors.jumlahPenumpang_WNI && <div className={styles.errorText}>{errors.jumlahPenumpang_WNI}</div>}
      </label>
      <label className={styles.formLabel}>
        Jumlah Penumpang WNA<span className={styles.required}>*</span>
        <input
          ref={inputRefs.jumlahPenumpang_WNA}
          className={styles.formInput}
          type="number"
          name="jumlahPenumpang_WNA"
          value={formData.jumlahPenumpang_WNA || ""}
          onChange={onChange}
          placeholder="0"
          min="0"
        />
        {errors.jumlahPenumpang_WNA && <div className={styles.errorText}>{errors.jumlahPenumpang_WNA}</div>}
      </label>
    </>
  );
}


// --- Field Tambahan ---
const kelengkapanDokumenFields = [
  { name: "mdh", label: "MDH (Maritime Declaration Health)", options: ["ada", "tidak ada"] },
  { name: "p3k", label: "P3K", options: ["tidak ada", "berlaku", "tidak berlaku"] },
  { name: "sscc", label: "SSCC/SSCEC", options: ["tidak ada", "berlaku", "tidak berlaku"] },
  { name: "bukuKesehatan", label: "Buku Kesehatan", options: ["ada", "tidak ada"] },
  { name: "crewList", label: "Crew List", options: ["ada", "tidak ada"] },
  { name: "passengerList", label: "Passenger List", options: ["ada", "tidak ada"] },
  { name: "voyageMemo", label: "Voyage Memo", options: ["ada", "tidak ada"] },
  { name: "shipParticular", label: "Ship Particular", options: ["ada", "tidak ada"] },
  { name: "lastPortPHQC", label: "Last Port PHQC", options: ["ada", "tidak ada"] },
  { name: "lastPortClearance", label: "Last Port Clearance", options: ["ada", "tidak ada"] },
  { name: "cargoManifest", label: "Cargo Manifest", options: ["ada", "tidak ada"] },
  { name: "generalList", label: "General List", options: ["ada", "tidak ada"] },
  { name: "medicineList", label: "Medicine List", options: ["ada", "tidak ada"] },
  { name: "vaccinationList", label: "Vaccination List/ICV", options: ["ada", "tidak ada"] },
];

const risikoDanPelanggaranFields = [
  { name: "faktorRisikoAlatAngkut", label: "Faktor Risiko Pada Alat Angkut" },
  { name: "faktorRisikoOrang", label: "Faktor Risiko Pada Orang" },
  { name: "faktorRisikoBarang", label: "Faktor Risiko Pada Barang" },
  { name: "pelanggaranKekarantinaan", label: "Pelanggaran Kekarantinaan" },
];

// --- Pilihan ---
const wilayahOptions = ["Wilayah 1", "Wilayah 2", "Wilayah 3"];
const asalKedatanganOptions = ["Dalam Negeri", "Luar Negeri"];
const statusKesPelabuhanOptions = ["Terpenuhi", "Tidak Terpenuhi"];
const statusKapalOptions = ["Merah", "Kuning", "Hijau"];
const statusPemeriksaanOptions = ["Periksa", "Tidak Periksa"];

const requiredFields = [
  "tanggal", "wilayah", "namaPetugas", "jabatan", "namaKapal", "lokasiSandar",
  "jenisKapal", "benderaKapal", "volume", "jumlahABK_WNI", "jumlahABK_WNA", "jumlahPenumpang_WNI",
  "jumlahPenumpang_WNA", "pelabuhanKedatangan", "negaraKabupatenKotaKedatangan",
  "asalKedatangan", "statusKesPelabuhan", "jumlahMuatanR2", "jumlahMuatanLain",
  "statusKapal", "statusPemeriksaan"
];

const numberFields = [
  "volume", "jumlahABK_WNI", "jumlahABK_WNA", "jumlahPenumpang_WNI",
  "jumlahPenumpang_WNA", "jumlahMuatanR2"
];

// --- Field wajib jika Periksa ---
const requiredIfPeriksa = [
  ...kelengkapanDokumenFields.map(f => f.name),
  ...risikoDanPelanggaranFields.map(f => f.name),
  "rekomendasi"
];

export default function KapalLautKedatanganForm({
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
      onChange({
        ...formData,
        [name]: files[0]
      });
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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


  const handleInternalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError(null); // Reset error submit
    setSuccess(false); // Reset success message

    const newErrors = {};
    // --- Validasi Wajib ---
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
    // --- Validasi Wajib Jika Status Pemeriksaan 'Periksa' ---
    if (formData.statusPemeriksaan === "Periksa") {
      for (const field of requiredIfPeriksa) {
        const val = formData[field];
        if (val === undefined || val === "") {
          newErrors[field] = "Bagian ini wajib diisi";
        }
      }
      // Cek juga keterangan faktor risiko/pelanggaran jika "ada"
      risikoDanPelanggaranFields.forEach(field => {
        if (formData[field.name] === "ada" && (!formData[field.name + "Keterangan"] || formData[field.name + "Keterangan"].trim() === "")) {
          newErrors[field.name + "Keterangan"] = "Keterangan wajib diisi jika ada";
        }
      });
    }

    setErrors(newErrors);

    // Jika ada error validasi, berhenti dan fokus ke field pertama yang error
    if (Object.keys(newErrors).length > 0) {
      setLoading(false);
      const allRequired = [
        ...requiredFields,
        ...(formData.statusPemeriksaan === "Periksa"
          ? [...requiredIfPeriksa, ...risikoDanPelanggaranFields.map(f => f.name + "Keterangan")]
          : [])
      ];
      const firstErrorField = allRequired.find((f) => newErrors[f]);
      if (firstErrorField && inputRefs[firstErrorField] && inputRefs[firstErrorField].current) {
        inputRefs[firstErrorField].current.focus();
        inputRefs[firstErrorField].current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return; // Hentikan proses submit jika ada error
    }

    // --- LOGIKA PENGIRIMAN DATA KE API DIMULAI DI SINI ---
    try {
      // Anda mungkin perlu menyesuaikan format data sesuai dengan kebutuhan API backend Anda.
      // Misalnya, jika backend mengharapkan nama field yang berbeda atau struktur nested.
      // File upload (dokumenPendukung) memerlukan penanganan khusus, biasanya menggunakan FormData.

      const dataToSend = { ...formData }; // Copy data form

      // Contoh sederhana pengiriman data JSON (tidak termasuk file upload)
      // Jika Anda perlu mengirim file, gunakan FormData
      const API_URL = "http://127.0.0.1:8000/api/kapal-laut/kedatangan"; // <--- GANTI DENGAN URL API ASLI ANDA
      // Contoh: "http://localhost:8000/api/kapal-laut/kedatangan" atau "https://namaaplikasianda.com/api/kapal-laut/kedatangan"

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header lain jika diperlukan, misalnya untuk otentikasi (Bearer Token, API Key, dll.)
          // "Authorization": `Bearer ${yourAuthToken}`,
        },
        body: JSON.stringify(dataToSend), // Kirim data sebagai JSON string
      });

      // Periksa apakah respons HTTP sukses (status code 2xx)
      if (!response.ok) {
        // Tangani error dari server (misalnya status 400, 401, 500)
        const errorData = await response.json(); // Coba baca pesan error dari body respons
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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

  // Helper untuk render error text
  const renderError = (field) =>
    errors[field] ? (
      <div className={styles.errorText}>{errors[field]}</div>
    ) : null;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>Form Kedatangan Kapal Laut</div> {/* Judul diubah */}
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
        <label className={styles.formLabel}>
          Wilayah Kerja/Pos<span className={styles.required}>*</span>
          <select
            ref={inputRefs.wilayah}
            className={styles.formSelect}
            name="wilayah"
            value={formData.wilayah || ""}
            onChange={handleChange}
          >
            <option value="">Pilih wilayah</option>
            {wilayahOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {renderError("wilayah")}
        </label>

        <DataPetugasSection
          formData={formData}
          onChange={handleChange}
          inputRefs={inputRefs}
          errors={errors}
        />

        <DataKapalSection
          formData={formData}
          onChange={handleChange}
          inputRefs={inputRefs}
          errors={errors}
        />

        <DataPenumpangSection
          formData={formData}
          onChange={handleChange}
          inputRefs={inputRefs}
          errors={errors}
        />

        <label className={styles.formLabel}>
          Pelabuhan Kedatangan<span className={styles.required}>*</span> {/* Label diubah */}
          <input
            ref={inputRefs.pelabuhanKedatangan}
            className={styles.formInput}
            type="text"
            name="pelabuhanKedatangan"
            value={formData.pelabuhanKedatangan || ""}
            onChange={handleChange}
            placeholder="Masukkan pelabuhan kedatangan"
          />
          {renderError("pelabuhanKedatangan")}
        </label>
        <label className={styles.formLabel}>
          Negara/Kabupaten/Kota Kedatangan<span className={styles.required}>*</span> {/* Label diubah */}
          <input
            ref={inputRefs.negaraKabupatenKotaKedatangan}
            className={styles.formInput}
            type="text"
            name="negaraKabupatenKotaKedatangan"
            value={formData.negaraKabupatenKotaKedatangan || ""}
            onChange={handleChange}
            placeholder="Masukkan negara/kabupaten/kota kedatangan"
          />
          {renderError("negaraKabupatenKotaKedatangan")}
        </label>
        <label className={styles.formLabel}>
          Asal Kedatangan<span className={styles.required}>*</span> {/* Label diubah */}
          <select
            ref={inputRefs.asalKedatangan}
            className={styles.formSelect}
            name="asalKedatangan"
            value={formData.asalKedatangan || ""}
            onChange={handleChange}
          >
            <option value="">Pilih asal</option>
            {asalKedatanganOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {renderError("asalKedatangan")}
        </label>
        <label className={styles.formLabel}>
          Status Kes. Pelabuhan/Negara Asal<span className={styles.required}>*</span> {/* Label diubah */}
          <select
            ref={inputRefs.statusKesPelabuhan}
            className={styles.formSelect}
            name="statusKesPelabuhan"
            value={formData.statusKesPelabuhan || ""}
            onChange={handleChange}
          >
            <option value="">Pilih status</option>
            {statusKesPelabuhanOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {renderError("statusKesPelabuhan")}
        </label>
        <label className={styles.formLabel}>
          Jumlah Muatan R2<span className={styles.required}>*</span>
          <input
            ref={inputRefs.jumlahMuatanR2}
            className={styles.formInput}
            type="number"
            name="jumlahMuatanR2"
            value={formData.jumlahMuatanR2 || ""}
            onChange={handleChange}
            placeholder="0"
            min="0"
          />
          {renderError("jumlahMuatanR2")}
        </label>
        <label className={styles.formLabel}>
          Jumlah Muatan Lainnya<span className={styles.required}>*</span>
          <textarea
            ref={inputRefs.jumlahMuatanLain}
            className={styles.formTextarea}
            name="jumlahMuatanLain"
            value={formData.jumlahMuatanLain || ""}
            onChange={handleChange}
            placeholder="Deskripsi muatan lainnya"
          />
          {renderError("jumlahMuatanLain")}
        </label>
        <label className={styles.formLabel}>
          Status Kapal<span className={styles.required}>*</span>
          <select
            ref={inputRefs.statusKapal}
            className={styles.formSelect}
            name="statusKapal"
            value={formData.statusKapal || ""}
            onChange={handleChange}
          >
            <option value="">Pilih status</option>
            {statusKapalOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {renderError("statusKapal")}
        </label>
        <label className={styles.formLabel}>
          Status Pemeriksaan<span className={styles.required}>*</span>
          <select
            ref={inputRefs.statusPemeriksaan}
            className={styles.formSelect}
            name="statusPemeriksaan"
            value={formData.statusPemeriksaan || ""}
            onChange={handleChange}
          >
            <option value="">Pilih status</option>
            {statusPemeriksaanOptions.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {renderError("statusPemeriksaan")}
        </label>

        {/* --- FIELD TAMBAHAN --- */}
        {formData.statusPemeriksaan === "Periksa" && (
          <div className={styles.formSectionBox}>
            <div className={styles.formSectionTitle}>Kelengkapan Dokumen</div>
            {kelengkapanDokumenFields.map(field => (
              <label key={field.name} className={styles.formLabel}>
                {field.label}<span className={styles.required}>*</span>
                <select
                  ref={inputRefs[field.name]}
                  className={styles.formSelect}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                >
                  <option value="">Pilih</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {renderError(field.name)}
              </label>
            ))}

            <div className={styles.formSectionTitle}>Faktor Risiko & Pelanggaran</div>
            {risikoDanPelanggaranFields.map(field => (
              <div key={field.name}>
                <label className={styles.formLabel}>
                  {field.label}<span className={styles.required}>*</span>
                  <select
                    ref={inputRefs[field.name]}
                    className={styles.formSelect}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Pilih</option>
                    <option value="ada">Ada</option>
                    <option value="tidak ada">Tidak Ada</option>
                  </select>
                  {renderError(field.name)}
                </label>
                {formData[field.name] === "ada" && (
                  <label className={styles.formLabel} style={{ marginLeft: 12 }}>
                    Keterangan {field.label}<span className={styles.required}>*</span>
                    <textarea
                      ref={inputRefs[field.name + "Keterangan"]}
                      className={styles.formTextarea}
                      name={field.name + "Keterangan"}
                      value={formData[field.name + "Keterangan"] || ""}
                      onChange={handleChange}
                      placeholder={`Jelaskan ${field.label.toLowerCase()}`}
                    />
                    {renderError(field.name + "Keterangan")}
                  </label>
                )}
              </div>
            ))}

            <label className={styles.formLabel}>
              Rekomendasi<span className={styles.required}>*</span>
              <textarea
                ref={inputRefs.rekomendasi}
                className={styles.formTextarea}
                name="rekomendasi"
                value={formData.rekomendasi || ""}
                onChange={handleChange}
                placeholder="Tulis rekomendasi pemeriksaan"
              />
              {renderError("rekomendasi")}
            </label>
            <label className={styles.formLabel}>
              Upload Dokumen Pendukung (opsional)
              <input
                ref={inputRefs.dokumenPendukung}
                className={styles.formInput}
                type="file"
                name="dokumenPendukung"
                accept="image/*,application/pdf"
                onChange={handleChange}
              />
              <span className={styles.formNote}>Maks. 5MB. Foto pemeriksaan/dokumen lainnya.</span>
              {renderError("dokumenPendukung")} {/* Error validasi ukuran/tipe file bisa ditambahkan di sini */}
            </label>
          </div>
        )}

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
