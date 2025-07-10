import React, { useState, useRef } from 'react';
import KapalLautKeberangkatanForm from './KapalLautKeberangkatanForm';
import KapalLautKedatanganForm from './KapalLautKedatanganForm';
import KapalLautPengendalianForm from './KapalLautPengendalianForm';
import ModalConfirm from '../Modal/ModalConfirm';

// Daftar field wajib untuk tiap form
const requiredFieldsMap = {
  keberangkatan: [
    "tanggal", "wilayah", "namaPetugas", "jabatan", "namaKapal", "lokasiSandar",
    "jenisKapal", "benderaKapal", "volume", "jumlahABK_WNI", "jumlahABK_WNA", "jumlahPenumpang_WNI",
    "jumlahPenumpang_WNA", "pelabuhanKeberangkatan", "negaraKabupatenKotaKeberangkatan",
    "tujuanKeberangkatan", "statusKesPelabuhan", "jumlahMuatanR2", "jumlahMuatanLain",
    "statusKapal", "statusPemeriksaan"
  ],
  kedatangan: [
    "tanggal", "wilayah", "namaPetugas", "jabatan", "namaKapal", "lokasiSandar",
    "jenisKapal", "benderaKapal", "volume", "jumlahABK_WNI", "jumlahABK_WNA", "jumlahPenumpang_WNI",
    "jumlahPenumpang_WNA", "pelabuhanKedatangan", "negaraKabupatenKotaKedatangan",
    "asalKedatangan", "statusKesPelabuhan", "jumlahMuatanR2", "jumlahMuatanLain",
    "statusKapal", "statusPemeriksaan"
  ],
  pengendalian: [
    "tanggal", "wilayah", "namaPetugas", "jabatan", "namaAlatAngkut",
    "jenisAlatAngkut", "benderaAlatAngkut", "volume", "penyebabPengendalian",
    "jenisPengendalian", "namaBUS", "dokumenDiterbitkan"
  ]
};

function getRequiredFields(formData, selectedForm) {
  let required = [...(requiredFieldsMap[selectedForm] || [])];
  if (selectedForm === "keberangkatan" && formData.statusPemeriksaan === "Periksa") {
    required = required.concat([
      "p3k", "sscc", "bukuKesehatan", "crewList", "passengerList", "voyageMemo",
      "shipParticular", "lastPortPHQC", "lastPortClearance", "cargoManifest",
      "generalList", "medicineList", "vaccinationList",
      "faktorRisikoAlatAngkut", "faktorRisikoOrang", "faktorRisikoBarang", "pelanggaranKekarantinaan",
      "rekomendasi", "dokumenPendukung"
    ]);
    [
      "faktorRisikoAlatAngkut",
      "faktorRisikoOrang",
      "faktorRisikoBarang",
      "pelanggaranKekarantinaan"
    ].forEach(field => {
      if (formData[field] === "ada") {
        required.push(field + "Keterangan");
      }
    });
  }
  // Tambahan: jika form kedatangan dan statusPemeriksaan Periksa, dokumenPendukung wajib
  if (selectedForm === "kedatangan" && formData.statusPemeriksaan === "Periksa") {
    required = required.concat(["dokumenPendukung"]);
  }
  // Pengendalian: validasi field "Other"
  if (selectedForm === "pengendalian") {
    if (formData.jenisAlatAngkut === "Other") required.push("jenisAlatAngkutOther");
    if (formData.penyebabPengendalian === "Other") required.push("penyebabPengendalianOther");
    if (formData.jenisPengendalian === "Other") required.push("jenisPengendalianOther");
    if (formData.dokumenDiterbitkan === "Other") required.push("dokumenDiterbitkanOther");
  }
  return required;
}

export default function KapalLautForm({
  formData,
  setFormData,
  onJenisFormChange,
  onFormChange
}) {
  const [selectedForm, setSelectedForm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Menggunakan useRef agar ref tetap konsisten antar render
  const formRefs = useRef({});
  const requiredFields = getRequiredFields(formData, selectedForm);

  // Inisialisasi ref untuk setiap field yang dibutuhkan
  if (selectedForm) {
    requiredFields.forEach(field => {
      if (!formRefs.current[field]) {
        formRefs.current[field] = React.createRef();
      }
    });
  }

  const handleChange = (e) => {
    const nextForm = e.target.value;
    if (onJenisFormChange) {
      onJenisFormChange(setSelectedForm, nextForm);
    } else {
      setSelectedForm(nextForm);
    }
  };

  const handleChildFormChange = (data) => {
    if (setFormData) setFormData(data);
    if (onFormChange) onFormChange(data);
  };

  const handleChildSubmit = (e) => {
    e.preventDefault();
    // Validasi field wajib
    for (const field of requiredFields) {
      if (
        formData[field] === undefined ||
        formData[field] === "" ||
        (field === "dokumenPendukung" && !formData.dokumenPendukung) ||
        (field === "dokumenPelaksanaan" && !formData.dokumenPelaksanaan)
      ) {
        const ref = formRefs.current[field];
        if (ref && ref.current) {
          ref.current.focus();
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
      // Validasi file size
      if (field === "dokumenPendukung" && formData.dokumenPendukung) {
        if (formData.dokumenPendukung.size > 5 * 1024 * 1024) {
          alert("Ukuran file maksimal 5MB");
          const ref = formRefs.current[field];
          if (ref && ref.current) {
            ref.current.focus();
            ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
      }
      if (field === "dokumenPelaksanaan" && formData.dokumenPelaksanaan) {
        if (formData.dokumenPelaksanaan.size > 1024 * 1024) {
          alert("Ukuran file maksimal 1MB");
          const ref = formRefs.current[field];
          if (ref && ref.current) {
            ref.current.focus();
            ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
      }
    }
    setShowConfirmModal(true);
  };

  const handleModalConfirm = () => {
    setShowConfirmModal(false);
    alert("Data berhasil dikirim! (simulasi)");
    if (setFormData) setFormData({});
    if (onFormChange) onFormChange({});
  };
  const handleModalCancel = () => setShowConfirmModal(false);

  return (
    <div>
      <label htmlFor="kapalFormSelect" style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
        Pilih Formulir
      </label>
      <select
        id="kapalFormSelect"
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
      {selectedForm === 'keberangkatan' && (
        <KapalLautKeberangkatanForm
          formData={formData}
          onChange={handleChildFormChange}
          onSubmit={handleChildSubmit}
          inputRefs={formRefs.current}
        />
      )}
      {selectedForm === 'kedatangan' && (
        <KapalLautKedatanganForm
          formData={formData}
          onChange={handleChildFormChange}
          onSubmit={handleChildSubmit}
          inputRefs={formRefs.current}
        />
      )}
      {selectedForm === 'pengendalian' && (
        <KapalLautPengendalianForm
          formData={formData}
          onChange={handleChildFormChange}
          onSubmit={handleChildSubmit}
          inputRefs={formRefs.current}
        />
      )}
      <ModalConfirm
        open={showConfirmModal}
        title="Konfirmasi Pengiriman"
        text="Apakah Anda yakin data yang diisi sudah benar dan siap dikirim? Jika masih ragu, silakan cek kembali data Anda."
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}
