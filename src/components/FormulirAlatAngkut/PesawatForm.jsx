import React, { useRef, useState } from 'react';
import PesawatKeberangkatanForm from './PesawatKeberangkatanForm';
import PesawatKedatanganForm from './PesawatKedatanganForm';
import PesawatPengendalianForm from './PesawatPengendalianForm';

// -- Field yang wajib diisi (contoh, silakan sesuaikan) --
const requiredFields = [
  "tanggal", "wilayah", "namaPetugas", "jabatan", "namaPesawat", "lokasiParkir",
  "jenisPesawat", "benderaPesawat", "volume", "jumlahABK_WNI", "jumlahABK_WNA",
  "jumlahPenumpang_WNI", "jumlahPenumpang_WNA", "bandaraKeberangkatan",
  "negaraKabupatenKotaKeberangkatan", "tujuanKeberangkatan", "statusKesBandara",
  "jumlahMuatanR2", "jumlahMuatanLain", "statusPesawat", "statusPemeriksaan"
];
const numberFields = [
  "volume", "jumlahABK_WNI", "jumlahABK_WNA", "jumlahPenumpang_WNI",
  "jumlahPenumpang_WNA", "jumlahMuatanR2"
];

export default function PesawatForm({
  formData,
  setFormData,
  onSubmit,
  onJenisFormChange,
  onFormChange,
}) {
  const [selectedForm, setSelectedForm] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // refs untuk semua field (otomatis generate dari daftar field)
  const inputRefs = useRef({});
  requiredFields.forEach(field => {
    if (!inputRefs.current[field]) inputRefs.current[field] = React.createRef();
  });

  // Handler perubahan jenis formulir
  const handleChange = (e) => {
    const nextForm = e.target.value;
    if (onJenisFormChange) {
      onJenisFormChange(setSelectedForm, nextForm);
    } else {
      setSelectedForm(nextForm);
    }
    // Reset error & success saat ganti form
    setErrors({});
    setSuccess(false);
  };

  // Handler perubahan data dari form anak
  const handleChildFormChange = (data) => {
    if (setFormData) setFormData(data);
    if (onFormChange) onFormChange(data);
    setErrors({});
  };

  // Handler submit dari child form
  const handleChildSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    for (const field of requiredFields) {
      const val = formData[field];
      if (
        val === undefined ||
        val === "" ||
        (numberFields.includes(field) && (isNaN(Number(val)) || Number(val) < 0))
      ) {
        newErrors[field] = numberFields.includes(field)
          ? "Nilai harus angka positif atau nol"
          : "Bagian ini wajib diisi";
      }
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Fokus & scroll ke field pertama yang error
      const firstErrorField = requiredFields.find((f) => newErrors[f]);
      if (firstErrorField && inputRefs.current[firstErrorField] && inputRefs.current[firstErrorField].current) {
        inputRefs.current[firstErrorField].current.focus();
        inputRefs.current[firstErrorField].current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    onSubmit && onSubmit(e);
  };

  // Pilih komponen form anak sesuai selectedForm
  const renderChildForm = () => {
    const props = {
      formData,
      onChange: handleChildFormChange,
      onSubmit: handleChildSubmit,
      inputRefs: inputRefs.current,
      errors,
    };
    if (selectedForm === 'keberangkatan') return <PesawatKeberangkatanForm {...props} />;
    if (selectedForm === 'kedatangan') return <PesawatKedatanganForm {...props} />;
    if (selectedForm === 'pengendalian') return <PesawatPengendalianForm {...props} />;
    return null;
  };

  return (
    <div>
      <label htmlFor="pesawatFormSelect" style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
        Pilih Formulir
      </label>
      <select
        id="pesawatFormSelect"
        value={selectedForm}
        onChange={handleChange}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b7bfd8', marginBottom: 24 }}
      >
        <option value="">-- Pilih Formulir --</option>
        <option value="keberangkatan">Formulir Keberangkatan</option>
        <option value="kedatangan">Formulir Kedatangan</option>
        <option value="pengendalian">Formulir Pengendalian</option>
      </select>

      {!selectedForm && (
        <div style={{ color: '#888', fontStyle: 'italic', marginTop: 12 }}>
          Silakan pilih jenis formulir yang ingin diisi.
        </div>
      )}

      {success && (
        <div style={{ color: 'green', marginBottom: 16 }}>
          Data berhasil dikirim!
        </div>
      )}

      {renderChildForm()}
    </div>
  );
}
