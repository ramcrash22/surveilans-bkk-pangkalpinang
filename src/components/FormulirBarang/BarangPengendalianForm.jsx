import React from "react";
import styles from "./BarangKeberangkatanForm.module.css"; // Pastikan path CSS ini benar

const wilayahOptions = ["Wilayah 1", "Wilayah 2", "Wilayah 3"];
const namaBarangOptions = [
  "Jenazah",
  "Omkaba",
  "Sampel Biologi",
  "Barang Bawaan",
  "Kargo Manifest",
  "Lainnya",
];
const jenisPengendalianOptions = [
  "Melengkapi dokumen",
  "disinfeksi/dekontaminasi",
  "Rujukan",
  "Pengepakan kembali",
];

export default function BarangPengendalianForm({
  formData,
  errors,
  onChange,
  onSubmit,
  loading,
  success,
  inputRefs, // Ini adalah objek ref dari parent (useRef)
  fileName, // Nama file dokumen pelaksanaan
  setFileName, // Setter untuk nama file dokumen pelaksanaan
}) {
  const renderError = (field) =>
    errors[field] ? (
      <div className={styles.errorText}>{errors[field]}</div>
    ) : null;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>Form Pengendalian Barang</div>
      {success && (
        <div className={styles.successText} style={{ marginBottom: 16 }}>
          Data berhasil dikirim!
        </div>
      )}
      <form onSubmit={onSubmit} autoComplete="off">
        {/* Tanggal Pelaksanaan */}
        <label className={styles.formLabel}>
          Tanggal Pelaksanaan<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.tanggal = ref)}
            className={styles.formInput}
            type="date"
            name="tanggal"
            value={formData.tanggal || ""}
            onChange={onChange}
            placeholder="dd/mm/yyyy"
          />
          {renderError("tanggal")}
        </label>

        {/* Wilayah Kerja/Pos */}
        <label className={styles.formLabel}>
          Wilayah Kerja/Pos<span className={styles.required}>*</span>
          <select
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.wilayah = ref)}
            className={styles.formSelect}
            name="wilayah"
            value={formData.wilayah || ""}
            onChange={onChange}
          >
            <option value="">Choose</option>
            {wilayahOptions.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {renderError("wilayah")}
        </label>

        {/* Nama Petugas */}
        <label className={styles.formLabel}>
          Nama Petugas<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.namaPetugas = ref)}
            className={styles.formInput}
            type="text"
            name="namaPetugas"
            value={formData.namaPetugas || ""}
            onChange={onChange}
            placeholder="Your answer"
          />
          {renderError("namaPetugas")}
        </label>

        {/* Jabatan */}
        <label className={styles.formLabel}>
          Jabatan<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.jabatan = ref)}
            className={styles.formInput}
            type="text"
            name="jabatan"
            value={formData.jabatan || ""}
            onChange={onChange}
            placeholder="Your answer"
          />
          {renderError("jabatan")}
        </label>

        {/* Nama Barang (Radio) */}
        <div className={styles.formLabel}>
          Nama Barang<span className={styles.required}>*</span>
          <div>
            {namaBarangOptions.map((opt, index) => (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "6px 0",
                }}
              >
                <input
                  type="radio"
                  name="namaBarang"
                  value={opt}
                  checked={formData.namaBarang === opt}
                  onChange={onChange}
                  // *** Perubahan di sini: Gunakan inputRefs.current ***
                  // Tetapkan ref hanya ke input radio pertama atau jika ini opsi yang dipilih?
                  // Cara paling sederhana adalah menetapkan ref ke input radio pertama.
                  // Atau tetapkan ref ke div container jika ingin fokus ke grup radio.
                  // Untuk konsistensi dengan pola Anda, mari tetapkan ke input radio pertama.
                  ref={index === 0 ? (ref) => (inputRefs.current.namaBarang = ref) : null}
                  style={{ marginRight: 8 }}
                />
                {opt}
                {opt === "Lainnya" && formData.namaBarang === "Lainnya" && (
                  <input
                    type="text"
                    name="lainnya_namaBarang"
                    value={formData.lainnya_namaBarang || ""}
                    onChange={onChange}
                    className={styles.formInput}
                    placeholder="Isi lainnya"
                    style={{ marginLeft: 8 }}
                    // *** Tambahkan ref untuk field 'Lainnya' ***
                    ref={(ref) => (inputRefs.current.lainnya_namaBarang = ref)}
                  />
                )}
              </label>
            ))}
          </div>
          {renderError("namaBarang")}
          {/* Render error untuk field 'Lainnya' jika ada */}
          {renderError("lainnya_namaBarang")}
        </div>

        {/* Nama Penanggung Jawab Barang */}
        <label className={styles.formLabel}>
          Nama Penanggung Jawab Barang<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.namaPenanggungJawab = ref)}
            className={styles.formInput}
            type="text"
            name="namaPenanggungJawab"
            value={formData.namaPenanggungJawab || ""}
            onChange={onChange}
            placeholder="Your answer"
          />
          {renderError("namaPenanggungJawab")}
        </label>

        {/* Kontak Penanggung Jawab Barang */}
        <label className={styles.formLabel}>
            Kontak Penanggung Jawab Barang<span className={styles.required}>*</span>
            <input
                // *** Perubahan di sini: Gunakan inputRefs.current ***
                ref={(ref) => (inputRefs.current.kontakPenanggungJawab = ref)}
                className={styles.formInput}
                type="tel" // Gunakan type="tel" untuk input nomor telepon
                name="kontakPenanggungJawab"
                value={formData.kontakPenanggungJawab || ""}
                onChange={onChange}
                placeholder="08123456789"
            />
            {renderError("kontakPenanggungJawab")}
        </label>

        {/* Faktor Risiko yang Ditemukan */}
        <label className={styles.formLabel}>
          Faktor Risiko yang Ditemukan<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.faktorRisiko = ref)}
            className={styles.formInput}
            type="text"
            name="faktorRisiko"
            value={formData.faktorRisiko || ""}
            onChange={onChange}
            placeholder="Your answer"
          />
          {renderError("faktorRisiko")}
        </label>

        {/* Jenis Pengendalian (Radio) */}
        <div className={styles.formLabel}>
          Jenis Pengendalian<span className={styles.required}>*</span>
          <div>
            {jenisPengendalianOptions.map((opt, index) => (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "6px 0",
                }}
              >
                <input
                  type="radio"
                  name="jenisPengendalian"
                  value={opt}
                  checked={formData.jenisPengendalian === opt}
                  onChange={onChange}
                   // *** Perubahan di sini: Gunakan inputRefs.current ***
                   // Tetapkan ref hanya ke input radio pertama
                  ref={index === 0 ? (ref) => (inputRefs.current.jenisPengendalian = ref) : null}
                  style={{ marginRight: 8 }}
                />
                {opt}
              </label>
            ))}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                margin: "6px 0",
              }}
            >
              <input
                type="radio"
                name="jenisPengendalian"
                value="Other"
                checked={formData.jenisPengendalian === "Other"}
                onChange={onChange}
                 // *** Jika 'Other' adalah opsi pertama, tetapkan ref di sini ***
                 // Jika tidak, ref jenisPengendalian sudah ditetapkan di loop atas.
                ref={jenisPengendalianOptions.length === 0 ? (ref) => (inputRefs.current.jenisPengendalian = ref) : null}
                style={{ marginRight: 8 }}
              />
              Other:
              {formData.jenisPengendalian === "Other" && (
                <input
                  type="text"
                  name="lainnya_jenisPengendalian"
                  value={formData.lainnya_jenisPengendalian || ""}
                  onChange={onChange}
                  className={styles.formInput}
                  placeholder="Isi lainnya"
                  style={{ marginLeft: 8 }}
                  // *** Tambahkan ref untuk field 'Lainnya' ***
                  ref={(ref) => (inputRefs.current.lainnya_jenisPengendalian = ref)}
                />
              )}
            </label>
          </div>
          {renderError("jenisPengendalian")}
           {/* Render error untuk field 'Lainnya' jika ada */}
          {renderError("lainnya_jenisPengendalian")}
        </div>

        {/* Nama BUS / Pelaksana Kegiatan */}
        <label className={styles.formLabel}>
          Nama BUS / Pelaksana Kegiatan<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.namaBUS = ref)}
            className={styles.formInput}
            type="text"
            name="namaBUS"
            value={formData.namaBUS || ""}
            onChange={onChange}
            placeholder="Your answer"
          />
          {renderError("namaBUS")}
        </label>

        {/* Dokumen yang diterbitkan */}
        <label className={styles.formLabel}>
          Dokumen yang diterbitkan<span className={styles.required}>*</span>
          <input
            // *** Perubahan di sini: Gunakan inputRefs.current ***
            ref={(ref) => (inputRefs.current.dokumenDiterbitkan = ref)}
            className={styles.formInput}
            type="text"
            name="dokumenDiterbitkan"
            value={formData.dokumenDiterbitkan || ""}
            onChange={onChange}
            placeholder="Your answer"
          />
          {renderError("dokumenDiterbitkan")}
        </label>

        {/* Dokumen Pelaksanaan (file upload) */}
        <label className={styles.formLabel}>
          Dokumen Pelaksanaan<span className={styles.required}>*</span> {/* Menjadikan wajib sesuai requiredFieldsMap */}
          <div className={styles.formSubLabel}>
            Dokumentasi kegiatan / Berita acara / Lainnya <br />
            Upload 1 supported file. Max 1 MB.
          </div>
          <input
             // *** Tambahkan ref untuk field file ***
            ref={(ref) => (inputRefs.current.dokumenPelaksanaan = ref)}
            className={styles.formInput}
            type="file"
            name="dokumenPelaksanaan"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={onChange} // Parent handleChildFormChange akan menangani ini
          />
          {fileName && ( // fileName prop dari parent
            <div style={{ marginTop: 8, fontSize: 14 }}>{fileName}</div>
          )}
           {renderError("dokumenPelaksanaan")} {/* Render error untuk field file */}
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
