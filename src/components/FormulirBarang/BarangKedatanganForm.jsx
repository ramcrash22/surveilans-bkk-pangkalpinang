import React from "react";
import styles from "./BarangKeberangkatanForm.module.css"; // Mengubah import CSS

// Opsi
const wilayahOptions = ["Wilayah 1", "Wilayah 2", "Wilayah 3"]; // Sesuaikan jika opsi wilayah berbeda untuk kedatangan
const pengawasanBarangOptions = [
  "Jenazah",
  "Omkaba",
  "Sampel Biologi",
  "Barang Bawaan",
  "Kargo Manifest",
];

// --- FIELD DEFINITIONS (SAMA PERSIS DENGAN KEBERANGKATAN SESUAI PERMINTAAN) ---
// Field Jenazah
const jenazahFields = [
  { label: "Nama Jenazah", name: "namaJenazah", type: "text", required: true },
  {
    label: "Jenis Kelamin Jenazah",
    name: "jenisKelaminJenazah",
    type: "dropdown",
    required: true,
    options: ["Laki-laki", "Perempuan"],
  },
  {
    label: "Tanggal Lahir Jenazah",
    name: "tglLahirJenazah",
    type: "date",
    required: true,
  },
  { label: "Kebangsaan", name: "kebangsaan", type: "text", required: true },
  {
    label: "Asal Jenazah",
    name: "asalJenazah",
    type: "text",
    required: true,
    placeholder: "Desa/Kelurahan, Kecamatan, Kabupaten/Kota",
  },
  {
    label: "Tujuan Jenazah",
    name: "tujuanJenazah",
    type: "text",
    required: true,
    placeholder: "Desa/Kelurahan, Kecamatan, Kabupaten/Kota",
  },
  {
    label: "Nama Alat Angkut (Jenazah)",
    name: "alatAngkutJenazah",
    type: "text",
    required: true,
  },
  {
    label: "Penyebab Kematian",
    name: "penyebabKematian",
    type: "dropdown",
    required: true,
    options: ["Menular", "Tidak Menular", "Lainnya"],
    hasOther: true,
  },
  {
    label: "Diagnosis Penyebab Kematian",
    name: "diagnosisKematian",
    type: "text",
    required: true,
    placeholder: "Diagnosis sesuai ICD-X",
  },
  {
    label: "Kelengkapan Dokumen (Jenazah)",
    name: "kelengkapanDokumenJenazah",
    type: "checkbox",
    required: true,
    options: [
      "Surat Ket. Kematian",
      "Surat Keterangan Pengawetan Jenazah",
      "Surat Keterangan Krematorium (Abu)",
      "ID Pendamping",
      "Surat Ket. Kepolisian",
    ],
  },
  {
    label: "Pengawasan Faktor Risiko", // Sesuai kode Keberangkatan
    name: "faktorRisiko", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Ada", "Tidak ada", "Lainnya"],
    hasOther: true,
  },
  {
    label: "Rekomendasi (Jenazah)", // Sesuai kode Keberangkatan
    name: "rekomendasiJenazah", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: [
      "Diterbitkan",
      "Diterbitkan setelah dilakukan tindakan pengendalian",
      "Lainnya",
    ],
    hasOther: true,
  },
];

// Field Omkaba
const omkabaFields = [
  {
    label: "Jenis Komoditi",
    name: "jenisKomoditi",
    type: "dropdown",
    required: true,
    options: [
      "Obat-Obatan",
      "Makanan",
      "Kosmetika",
      "Alat Kesehatan",
      "Bahan Adiktif",
      "Lainnya",
    ],
    hasOther: true,
  },
  {
    label: "Asal (Omkaba)",
    name: "asalOmkaba",
    type: "text",
    required: true,
  },
  {
    label: "Nama Alat Angkut (Omkaba)",
    name: "alatAngkutOmkaba",
    type: "text",
    required: true,
  },
  {
    label: "Nama Pemilik / Keagenan/ contact person (Omkaba)", // Sesuai kode Keberangkatan
    name: "pemilikOmkaba", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
  {
    label: "Alamat (Omkaba)",
    name: "alamatOmkaba",
    type: "text",
    required: true,
  },
  {
    label: "Jumlah Komoditi (Omkaba)",
    name: "jumlahKomoditiOmkaba",
    type: "text",
    required: true,
  },
  {
    label: "Kelengkapan Dokumen (Omkaba)",
    name: "kelengkapanDokumenOmkaba",
    type: "checkbox",
    required: true,
    options: [
      "Pemberitahuan Ekspor Barang (PEB)", // Opsi sesuai Keberangkatan
      "Invoice No.",
      "Certificate of Analysis dari laboratorium terakreditasi/Negara asal",
      "Packing list",
      "Ocean Bill of Lading",
      "Surat Kuasa dan Exportir/importir",
      "Surat Pernyataan Pemilik Barang",
    ],
  },
  {
    label: "Dokumen Pendukung (Omkaba)",
    name: "dokumenPendukungOmkaba",
    type: "checkbox",
    required: true,
    options: [
      "Certificate Pendukung (MUI)", // Opsi sesuai Keberangkatan
      "Certificate Pendukung (BATAN)",
      "Phytosanitary atau layak konsumsi",
      "Sertifikat Karantina Hewan",
      "Sertifikat Karantina Ikan",
    ],
  },
  {
    label: "Kemasan", // Sesuai kode Keberangkatan
    name: "kemasanOmkaba", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Memenuhi Syarat", "Tidak Memenuhi Syarat", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  {
    label: "Faktor Risiko Kesehatan (Omkaba)",
    name: "faktorRisikoOmkaba",
    type: "dropdown",
    required: true,
    options: [
      "Tidak ada faktor risiko",
      "Kadar Luarsa",
      "Tidak terdaftar di BPOM",
      "Palsu",
      "Barang Terlarang",
      "Barang Hasil Kejahatan",
      "Lainnya",
    ],
    hasOther: true,
  },
  {
    label: "Rekomendasi (Omkaba)",
    name: "rekomendasiOmkaba",
    type: "text",
    required: true,
  },
];

// Field Sampel Biologi
const sampelBiologiFields = [
  {
    label: "Nama Sampel",
    name: "namaSampel",
    type: "text",
    required: true,
  },
  {
    label: "Jenis Sampel",
    name: "jenisSampel",
    type: "dropdown",
    required: true,
    options: ["Menular", "Tidak Menular", "Lainnya"],
    hasOther: true,
  },
  {
    label: "Volume",
    name: "volume",
    type: "text",
    required: true,
  },
  {
    label: "Asal Instansi",
    name: "asalInstansi",
    type: "text",
    required: true,
  },
  {
    label: "Kontak", // Sesuai kode Keberangkatan
    name: "kontakSampel", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
  {
    label: "Nama Alat Angkut (Sampel Biologi)",
    name: "alatAngkutSampel",
    type: "text",
    required: true,
  },
  {
    label: "No Surat Pengantar",
    name: "noSuratPengantar",
    type: "text",
    required: true,
  },
  {
    label: "Kemasan Utama", // Sesuai kode Keberangkatan
    name: "kemasanUtama", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Memenuhi Syarat", "Tidak Memenuhi Syarat", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  {
    label: "Kemasan Pendukung", // Sesuai kode Keberangkatan
    name: "kemasanPendukung", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Memenuhi Syarat", "Tidak Memenuhi Syarat", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  {
    label: "Kemasan Keras", // Sesuai kode Keberangkatan
    name: "kemasanKeras", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Memenuhi Syarat", "Tidak Memenuhi Syarat", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  {
    label: "Kemasan Luar", // Sesuai kode Keberangkatan
    name: "kemasanLuar", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Memenuhi Syarat", "Tidak Memenuhi Syarat", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  {
    label: "Faktor Risiko (Sampel Biologi)",
    name: "faktorRisikoSampel",
    type: "dropdown",
    required: true,
    options: [
      "Kemasan Memenuhi Syarat", // Opsi sesuai Keberangkatan
      "Kemasan Tidak Memenuhi Syarat",
      "Lainnya",
    ],
    hasOther: true,
  },
  {
    label: "Rekomendasi (Sampel Biologi)",
    name: "rekomendasiSampel",
    type: "dropdown",
    required: true,
    options: [
      "Diterbitkan Surat Keterangan", // Opsi sesuai Keberangkatan
      "Diterbitkan Surat Keterangan Setelah Dilakukan Pengendalian",
      "Lainnya",
    ],
    hasOther: true,
  },
];

// Field Barang Bawaan
const barangBawaanFields = [
  {
    label: "Nama Barang",
    name: "namaBarang",
    type: "text",
    required: true,
  },
  {
    label: "Nama Pembawa Barang",
    name: "namaPembawaBarang",
    type: "text",
    required: true,
  },
  {
    label: "Kontak Pembawa Barang",
    name: "kontakPembawaBarang",
    type: "text",
    required: true,
  },
  {
    label: "Tujuan Keberangkatan (Barang Bawaan)", // Sesuai kode Keberangkatan
    name: "tujuanBarangBawaan", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
  {
    label: "Nama Alat Angkut (Barang Bawaan)",
    name: "alatAngkutBarangBawaan",
    type: "text",
    required: true,
  },
  {
    label: "Nama Barang per Item dan Jumlahnya", // Sesuai kode Keberangkatan
    name: "namaBarangPerItem", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
    placeholder:
      "Contoh : Amlodipin 5mg = 30 tablet; Amoxilyn 500mg = 10 tablet; dan seterusnya",
  },
  { // Lanjutan dari bagian 2 kode Barang Bawaan Keberangkatan
    label: "Penyimpanan", // Sesuai kode Keberangkatan
    name: "penyimpananBarangBawaan", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Memenuhi Syarat", "Tidak Memenuhi Syarat", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  { // Lanjutan dari bagian 2 kode Barang Bawaan Keberangkatan
    label: "Faktor Risiko (Barang Bawaan)",
    name: "faktorRisikoBarangBawaan",
    type: "dropdown",
    required: true,
    options: ["Kadaluwarsa", "Kemasan", "Narkotika", "Penyimpanan", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  { // Lanjutan dari bagian 2 kode Barang Bawaan Keberangkatan
    label: "Rekomendasi (Barang Bawaan)",
    name: "rekomendasiBarangBawaan",
    type: "dropdown",
    required: true,
    options: [
      "Surat Keterangan List Obat", // Opsi sesuai Keberangkatan
      "Berita Acara Penarikan Obat",
      "Lainnya",
    ],
    hasOther: true,
  },
];

// Field Kargo Manifest
const kargoManifestFields = [
  {
    label: "Jenis Kargo",
    name: "jenisKargo",
    type: "dropdown",
    required: true,
    options: [
      "CPO",
      "Cruide Oil", // Opsi sesuai Keberangkatan
      "HSD/Premium Dll", // Opsi sesuai Keberangkatan
      "Aspai Cair",
      "Gencar Kargo", // Opsi sesuai Keberangkatan
      "Curah",
      "Kontainer",
      "Perikanan",
      "Pertanian",
      "Lainnya",
    ],
    hasOther: true,
  },
  {
    label: "Nama Pemilik/Pengirim", // Sesuai kode Keberangkatan
    name: "namaPemilikKargo", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
  {
    label: "Kontak Pemilik/Pengirim", // Sesuai kode Keberangkatan
    name: "kontakPemilikKargo", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
  {
    label: "Tujuan Keberangkatan", // Sesuai kode Keberangkatan
    name: "tujuanKargo", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
  {
    label: "Nama Alat Angkut",
    name: "alatAngkutKargo",
    type: "text",
    required: true,
  },
  {
    label: "Cargo List", // Sesuai kode Keberangkatan
    name: "cargoList", // Sesuai kode Keberangkatan
    type: "dropdown",
    required: true,
    options: ["Ada", "Tidak Ada", "Lainnya"], // Opsi sesuai Keberangkatan
    hasOther: true,
  },
  {
    label: "Faktor Risiko",
    name: "faktorRisikoKargo",
    type: "checkbox",
    required: true,
    options: [
      "Tidak Ada",
      "Kimia", // Opsi sesuai Keberangkatan
      "Cair", // Opsi sesuai Keberangkatan
      "Kebocoran",
      "Biologi", // Opsi sesuai Keberangkatan
      "Vektor",
    ],
  },
  {
    label: "Rekomendasi", // Sesuai kode Keberangkatan
    name: "rekomendasiKargo", // Sesuai kode Keberangkatan
    type: "text",
    required: true,
  },
];


// --- MAIN FORM ---
export default function BarangKedatanganForm({ // Mengubah nama komponen
  formData,
  errors,
  onChange,
  onSubmit,
  loading,
  success,
  inputRefs,
  fileName,
  setFileName,
}) {
  // Helper untuk mengambil field dinamis
  const getDynamicFields = (pengawasan) => {
    switch (pengawasan) {
      case "Jenazah": return jenazahFields;
      case "Omkaba": return omkabaFields;
      case "Sampel Biologi": return sampelBiologiFields;
      case "Barang Bawaan": return barangBawaanFields;
      case "Kargo Manifest": return kargoManifestFields;
      default: return [];
    }
  };

  // Render error message
  const renderError = (field) =>
    errors[field] ? <div className={styles.errorText}>{errors[field]}</div> : null;

  // Render field dinamis sesuai pilihan
  const renderDynamicFields = () => {
    const fields = getDynamicFields(formData.pengawasanBarang);
    if (!fields.length) return null;

    // Judul section - Menyesuaikan untuk Kedatangan
    let sectionTitle = "";
    switch (formData.pengawasanBarang) {
      case "Jenazah": sectionTitle = "FORM JENAZAH KEDATANGAN"; break;
      case "Omkaba": sectionTitle = "FORM OMKABA KEDATANGAN"; break;
      case "Sampel Biologi": sectionTitle = "SAMPEL BIOLOGI KEDATANGAN"; break;
      case "Barang Bawaan": sectionTitle = "BARANG BAWAAN KEDATANGAN"; break;
      case "Kargo Manifest": sectionTitle = "KARGO MANIFEST KEDATANGAN"; break;
      default: break;
    }

    return (
      <div className={styles.sectionContainer}>
        <div className={styles.sectionTitle}>{sectionTitle}</div>
        {fields.map((f) => {
          // Logic rendering fields (text, date, dropdown, checkbox) sama persis
          if (f.type === "text" || f.type === "date") {
            return (
              <label className={styles.formLabel} key={f.name}>
                {f.label}
                {f.required && <span className={styles.required}>*</span>}
                <input
                  ref={(ref) => (inputRefs[f.name] = ref)}
                  className={styles.formInput}
                  type={f.type}
                  name={f.name}
                  value={formData[f.name] || ""}
                  onChange={onChange}
                  placeholder={f.placeholder || "Your answer"}
                />
                {renderError(f.name)}
              </label>
            );
          }

          if (f.type === "dropdown") {
            return (
              <div className={styles.formLabel} key={f.name}>
                <span>
                  {f.label}
                  {f.required && <span className={styles.required}>*</span>}
                </span>
                <select
                  name={f.name}
                  value={formData[f.name] || ""}
                  onChange={onChange}
                  ref={(ref) => (inputRefs[f.name] = ref)}
                  className={styles.formSelect}
                >
                  <option value="">Pilih</option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {f.hasOther && formData[f.name] === "Lainnya" && (
                  <input
                    type="text"
                    name={`lainnya_${f.name}`}
                    value={formData[`lainnya_${f.name}`] || ""}
                    onChange={onChange}
                    className={styles.formInput}
                    placeholder="Isi lainnya"
                    style={{ marginTop: 8 }}
                  />
                )}
                {renderError(f.name)}
              </div>
            );
          }

          if (f.type === "checkbox") {
            return (
              <div className={styles.formLabel} key={f.name}>
                <span>
                  {f.label}
                  {f.required && <span className={styles.required}>*</span>}
                </span>
                <div>
                  {f.options.map((opt) => {
                    const isChecked = Array.isArray(formData[f.name]) && formData[f.name].includes(opt);

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
                          name={f.name}
                          value={opt}
                          checked={isChecked}
                          onChange={onChange}
                          style={{ marginRight: 8 }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                  {renderError(f.name)}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formTitle}>Form Barang Kedatangan</div> {/* Mengubah judul form */}
      {success && (
        <div className={styles.successText} style={{ marginBottom: 16 }}>
          Data berhasil dikirim!
        </div>
      )}
      <form onSubmit={onSubmit} autoComplete="off">
        {/* Tanggal Kedatangan - Menggunakan nama field dan label yang sesuai */}
        <label className={styles.formLabel}>
          Tanggal Kedatangan<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.tanggalKedatangan = ref)} // Menggunakan nama field yang sesuai
            className={styles.formInput}
            type="date"
            name="tanggalKedatangan" // Menggunakan nama field yang sesuai
            value={formData.tanggalKedatangan || ""}
            onChange={onChange}
          />
          {renderError("tanggalKedatangan")} {/* Menggunakan nama field yang sesuai */}
        </label>

        {/* Wilayah Tujuan - Menggunakan nama field dan label yang sesuai */}
        <label className={styles.formLabel}>
          Wilayah Tujuan<span className={styles.required}>*</span>
          <select
            ref={(ref) => (inputRefs.wilayahTujuan = ref)} // Menggunakan nama field yang sesuai
            className={styles.formSelect}
            name="wilayahTujuan" // Menggunakan nama field yang sesuai
            value={formData.wilayahTujuan || ""}
            onChange={onChange}
          >
            <option value="">Pilih</option>
            {wilayahOptions.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {renderError("wilayahTujuan")} {/* Menggunakan nama field yang sesuai */}
        </label>

        {/* Nama Petugas - Sama seperti Keberangkatan */}
        <label className={styles.formLabel}>
          Nama Petugas<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.namaPetugas = ref)}
            className={styles.formInput}
            type="text"
            name="namaPetugas"
            value={formData.namaPetugas || ""}
            onChange={onChange}
            placeholder="Nama lengkap petugas"
          />
          {renderError("namaPetugas")}
        </label>

        {/* Jabatan - Sama seperti Keberangkatan */}
        <label className={styles.formLabel}>
          Jabatan<span className={styles.required}>*</span>
          <input
            ref={(ref) => (inputRefs.jabatan = ref)}
            className={styles.formInput}
            type="text"
            name="jabatan"
            value={formData.jabatan || ""}
            onChange={onChange}
            placeholder="Jabatan petugas"
          />
          {renderError("jabatan")}
        </label>

        {/* Pengawasan Barang (Dropdown) - Sama seperti Keberangkatan */}
        <label className={styles.formLabel}>
          Pengawasan Barang<span className={styles.required}>*</span>
          <select
            ref={(ref) => (inputRefs.pengawasanBarang = ref)}
            className={styles.formSelect}
            name="pengawasanBarang"
            value={formData.pengawasanBarang || ""}
            onChange={onChange}
          >
            <option value="">Pilih</option>
            {pengawasanBarangOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {renderError("pengawasanBarang")}
        </label>

        {/* Field Tambahan Dinamis (menggunakan definisi field dari kode Keberangkatan) */}
        {renderDynamicFields()}

        {/* Dokumen Pendukung - Sama seperti Keberangkatan */}
        <label className={styles.formLabel}>
          Dokumen Pendukung
          <div className={styles.formSubLabel}>
            Upload dokumen pendukung (PDF, JPG, PNG - max 1MB)
          </div>
          <input
            className={styles.formInput}
            type="file"
            name="dokumenPendukung"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onChange}
          />
          {fileName && (
            <div className={styles.fileNameContainer}>
              <span>{fileName}</span>
              <button
                type="button"
                className={styles.clearFileButton}
                onClick={() => setFileName('')}
              >
                ✕
              </button>
            </div>
          )}
          {renderError("dokumenPendukung")}
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
