import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
// Import komponen form Pengendalian untuk Orang
import OrangPengendalianForm from './OrangPengendalianForm';
// Import ModalConfirm
import ModalConfirm from '../Modal/ModalConfirm';

// --- Definisi Field Wajib Universal ---
// Ini adalah field yang selalu wajib diisi, terlepas dari pilihan 'Kunjungan Klinik'
const universalRequiredFields = [
  "tanggal",
  "wilayahKerja",
  "namaPetugas",
  "namaLengkap",
  "nik",
  "jenisKelamin",
  "umur",
  "contactPerson",
  "kunjunganKlinik", // Pilihan ini sendiri wajib
];

// --- Definisi Field Wajib Dinamis (berdasarkan Kunjungan Klinik) ---
// Ini adalah field yang wajib HANYA jika bagian dinamisnya ditampilkan
const nonPelakuRequiredFields = [
  "alamatKtpNonPelaku",
  "alamatDomisiliNonPelaku",
  "pekerjaanNonPelaku",
  "hasilPemeriksaanNonPelaku",
  "faktorRisikoNonPelaku", // Nama grup checkbox
  "diagnosaMedisNonPelaku",
  "tindakanPengendalianNonPelaku", // Nama grup checkbox
  "keteranganNonPelaku",
];

const pelakuRequiredFields = [
  "statusDatangBerangkat",
  "crewPenumpang", // Nama grup radio
  "namaAlatAngkut",
  "alamatAsal",
  "alamatTujuan",
  "pekerjaanPelaku",
  "hasilPemeriksaanPelaku",
  "faktorRisikoPelaku", // Nama grup checkbox
  "diagnosaMedisPelaku",
  "tindakanPengendalianPelaku", // Nama grup checkbox
  "keteranganPelaku",
];

// --- Helper function untuk mendapatkan daftar field wajib saat ini ---
function getRequiredFieldsOrang(formData) {
  let required = [...universalRequiredFields]; // Mulai dengan field universal

  const kunjunganKlinik = formData.kunjunganKlinik;

  if (kunjunganKlinik === 'Non Pelaku Perjalanan') {
    required = required.concat(nonPelakuRequiredFields);
    // Tambahkan field 'lainnya_' jika opsi 'Other' dipilih di Faktor Risiko Non Pelaku
    if (Array.isArray(formData.faktorRisikoNonPelaku) && formData.faktorRisikoNonPelaku.includes('Other')) {
        required.push('lainnya_faktorRisikoNonPelaku');
    }

  } else if (kunjunganKlinik === 'Pelaku Perjalanan') {
    required = required.concat(pelakuRequiredFields);
     // Tambahkan field 'lainnya_' jika opsi 'Other' dipilih di Crew/Penumpang
    if (formData.crewPenumpang === 'Other') {
        required.push('lainnya_crewPenumpang');
    }
    // Tambahkan field 'lainnya_' jika opsi 'Other' dipilih di Faktor Risiko Pelaku
    if (Array.isArray(formData.faktorRisikoPelaku) && formData.faktorRisikoPelaku.includes('Other')) {
        required.push('lainnya_faktorRisikoPelaku');
    }
  }

  // Hapus duplikasi jika ada (meskipun dengan struktur ini seharusnya tidak ada)
  return Array.from(new Set(required));
}

export default function OrangForm({
  formData, // formData dikelola di parent FormulirOrang.jsx
  setFormData, // setFormData dikelola di parent FormulirOrang.jsx
  onFormChange, // onFormChange dikelola di parent FormulirOrang.jsx
  onSubmit, // onSubmit dikelola di parent FormulirOrang.jsx (dipicu setelah konfirmasi modal)
  openModal, // openModal prop dari parent FormulirOrang.jsx (tidak digunakan dalam kode ini)
  // Props baru untuk modal sukses:
  showSuccessModal, // State dari parent untuk menampilkan modal sukses
  onCloseSuccessModal // Fungsi dari parent untuk menutup modal sukses
}) {
  // State lokal untuk error dan modal konfirmasi
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});
  // State untuk nama file dokumen pelaksanaan Orang dihapus karena tidak ada file upload di gambar
  // const [fileNameOrangPengendalian, setFileNameOrangPengendalian] = useState('');

  // Ref untuk mengakses elemen DOM input (diteruskan ke komponen anak)
  const formRefs = useRef({});

  // Daftar field wajib saat ini (berubah dinamis berdasarkan formData)
  const requiredFields = getRequiredFieldsOrang(formData);

  // Cek apakah form memiliki data yang terisi
  const isFormDirty = () => {
     const formKeys = Object.keys(formData); // Periksa semua key di formData
     return formKeys.some(field => {
       const val = formData[field];
       // Cek apakah nilai ada dan bukan string kosong, null, undefined, atau array kosong
       // Ini mencakup teks, tanggal, radio, dan checkbox yang terisi.
       // Juga mencakup field 'lainnya_' jika terisi.
       return val !== undefined && val !== null && val !== "" && !(Array.isArray(val) && val.length === 0);
     });
  };

  // Fungsi validasi form
  const validateForm = () => {
    const newErrors = {};
    let firstErrorField = null;

    requiredFields.forEach(field => {
      const value = formData[field];
      const isCheckbox = Array.isArray(value);

      const isLainnyaField = field.startsWith('lainnya_');
      const originalFieldName = isLainnyaField ? field.substring('lainnya_'.length) : null;
       // Cek apakah field 'lainnya_' ini wajib karena opsi 'Other'/'Lainnya' dipilih pada field aslinya
      // Perhatikan bahwa untuk checkbox 'Other', kita cek apakah array value mengandung 'Other'
      const isOriginalOptionLainnyaOrOther = isLainnyaField && (
           (formData[originalFieldName] === 'Other' || formData[originalFieldName] === 'Lainnya') // Untuk radio/teks
           || (Array.isArray(formData[originalFieldName]) && formData[originalFieldName].includes('Other')) // Untuk checkbox
      );


      // Validasi field wajib yang kosong
      if (
           ( !value && !(isCheckbox && value.length > 0) ) // Nilai falsy DAN bukan checkbox kosong
           && ( !isLainnyaField || isOriginalOptionLainnyaOrOther ) // Bukan field 'lainnya_' ATAU field 'lainnya_' dan opsi aslinya 'Other'/'Lainnya'
         ) {
          if (isCheckbox && value.length === 0) {
               // Pesan error spesifik untuk checkbox group
               newErrors[field] = `Pilih minimal satu opsi untuk ${field.replace(/([A-Z])/g, ' $1').trim()}`; // Format nama field
          } else { // Untuk tipe lain (text, date, dropdown, radio, 'lainnya_')
              newErrors[field] = "Field ini wajib diisi";
          }

          if (!firstErrorField) {
              firstErrorField = field;
          }
      }

       // Validasi tambahan untuk field 'lainnya_' (jika field aslinya dipilih 'Other'/'Lainnya')
       // Ini menangani kasus jika field 'lainnya_' ada tapi kosong
       if (isLainnyaField && isOriginalOptionLainnyaOrOther && (!value || (typeof value === 'string' && value.trim() === ""))) {
            // Coba dapatkan label asli dari field 'lainnya_'
            let originalLabel = originalFieldName;
            // Anda mungkin perlu mapping nama field ke label yang lebih user-friendly di sini
            // Contoh sederhana (tidak mencakup semua kasus):
             if (originalFieldName === 'faktorRisikoNonPelaku') originalLabel = 'Faktor Risiko Non Pelaku';
             if (originalFieldName === 'crewPenumpang') originalLabel = 'Crew/Penumpang';
             if (originalFieldName === 'faktorRisikoPelaku') originalLabel = 'Faktor Risiko Pelaku';
             if (originalFieldName === 'jenisOrangYangDikendalikan') originalLabel = 'Jenis Orang yang Dikendalikan'; // Jika ini masih relevan

            newErrors[field] = `Harap isi keterangan untuk opsi 'Other'/'Lainnya' pada field ${originalLabel}`;
            if (!firstErrorField) {
                firstErrorField = field;
            }
       }

       // Tidak ada validasi ukuran file karena tidak ada input file di gambar

    });

    return { errors: newErrors, firstErrorField: firstErrorField };
  };

  // Handler perubahan input dari komponen anak
  const handleChildFormChange = (e) => {
    if (e && e.target) {
      const { name, value, type, files, checked } = e.target;

      // Tidak ada penanganan file upload lagi

      if (type === "checkbox") {
          // Logika untuk checkbox: tambahkan atau hapus nilai dari array
           setFormData(prev => {
              const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
              if (checked) {
                  const newValues = [...currentValues, value];
                  // Update formData di parent
                  onFormChange({ ...prev, [name]: newValues });
                  return { ...prev, [name]: newValues };
              } else {
                  const newValues = currentValues.filter(item => item !== value);
                   // Update formData di parent
                  onFormChange({ ...prev, [name]: newValues });
                  return { ...prev, [name]: newValues };
              }
          });
      }
      else {
        // Logika untuk input teks, tanggal, dropdown, radio, textarea
         // Update formData di parent
        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };
            onFormChange(updatedData); // Beri tahu parent tentang perubahan
            return updatedData;
        });
      }

      // Clear error for this field when user starts typing/changing
      setErrors(prev => ({ ...prev, [name]: undefined }));
       // Jika field 'lainnya_' terkait diubah, clear error juga untuk dropdown/radio/checkbox aslinya
       if (name.startsWith('lainnya_')) {
            const originalFieldName = name.substring('lainnya_'.length);
            setErrors(prev => ({ ...prev, [originalFieldName]: undefined }));
       }
        // Jika dropdown/radio/checkbox diubah ke/dari 'Other'/'Lainnya', clear error untuk field 'lainnya_' terkait
        const lainnyaFieldName = `lainnya_${name}`;
        if (formData[lainnyaFieldName] !== undefined) {
             // Cek apakah nilai baru BUKAN 'Other'/'Lainnya' (untuk radio/teks)
             // Atau jika nilai baru TIDAK mengandung 'Other' (untuk checkbox)
             const isNewValueNotOtherOrLainnya = !(value === 'Other' || value === 'Lainnya'); // Untuk radio/teks
             const isNewCheckboxValueNotOther = !(Array.isArray(formData[name]) && formData[name].includes('Other')); // Untuk checkbox

             if (type === 'checkbox' ? isNewCheckboxValueNotOther : isNewValueNotOtherOrLainnya) {
                 setErrors(prev => ({ ...prev, [lainnyaFieldName]: undefined }));
             }
        }

    } else if (typeof e === "object") {
      // Menangani kasus jika onChange mengirimkan objek langsung
       setFormData(prev => {
           const updatedData = { ...prev, ...e };
           onFormChange(updatedData); // Beri tahu parent tentang perubahan
           return updatedData;
       });
       // Mungkin perlu logika tambahan untuk membersihkan error jika ada field yang diubah
       // Ini bisa kompleks, mungkin perlu iterasi keys di 'e'
    }
  };

  // Handler submit dari komponen anak (dipanggil saat tombol submit di anak diklik)
  const handleChildSubmit = (e) => {
    e.preventDefault();
    const { errors: validationErrors, firstErrorField } = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Jika tidak ada error, tampilkan modal konfirmasi submit
      setShowConfirmModal(true);
    } else {
      // Jika ada error, fokuskan ke field pertama yang error
      console.log("Validation errors:", validationErrors);
      if (firstErrorField && formRefs.current[firstErrorField]) {
         try {
             // Fokuskan elemen menggunakan ref
             // Perlu penanganan khusus jika elemennya tidak bisa difokus langsung (misalnya checkbox group container)
             const elementToFocus = formRefs.current[firstErrorField];
             if (elementToFocus && typeof elementToFocus.focus === 'function') {
                  elementToFocus.focus();
             } else if (elementToFocus) {
                 // Jika elemennya tidak bisa difokus, coba cari elemen fokusable pertama di dalamnya
                 const firstFocusable = elementToFocus.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
                 if (firstFocusable && typeof firstFocusable.focus === 'function') {
                     firstFocusable.focus();
                 } else {
                      console.error("Element found but not focusable, and no focusable children found:", firstErrorField);
                 }
             } else {
                 console.error("First error field ref not found:", firstErrorField);
             }
         } catch (error) {
             console.error("Failed to focus on element:", firstErrorField, error);
             // Fallback jika fokus gagal
             const formElement = e.target; // e.target adalah elemen <form>
             if (formElement) {
                 const firstFocusable = formElement.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
                 if (firstFocusable && typeof firstFocusable.focus === 'function') {
                     firstFocusable.focus();
                 }
             }
         }
      } else {
          console.log("First error field ref not found:", firstErrorField);
          // Fallback: Fokus ke elemen pertama yang bisa difokus di form
          const formElement = e.target; // e.target adalah elemen <form>
          if (formElement) {
              const firstFocusable = formElement.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
              if (firstFocusable && typeof firstFocusable.focus === 'function') {
                  firstFocusable.focus();
              }
          }
      }
    }
  };

  // Handler konfirmasi modal submit
  const handleModalConfirm = () => {
    setShowConfirmModal(false); // Tutup modal konfirmasi
    // Panggil fungsi onSubmit dari parent FormulirOrang.jsx
    // Parent akan menangani pengiriman data ke API dan menampilkan modal sukses jika berhasil
    if (onSubmit) {
      onSubmit();
    }
    // Reset error lokal setelah submit (apapun hasilnya, parent yang akan reset formData)
    setErrors({});
    // setFileNameOrangPengendalian(''); // Dihapus
    // Refs tidak perlu direset di sini, biarkan tetap ada untuk potensi validasi berikutnya
    // formRefs.current = {}; // Jangan bersihkan refs di sini
  };

  // Karena hanya ada satu jenis form (Pengendalian Orang) dan tidak ada dropdown pemilihan,
  // kita langsung render komponen OrangPengendalianForm.

  return (
    <div>
      {/* Langsung render form Pengendalian Orang */}
      <OrangPengendalianForm
        formData={formData}
        onChange={handleChildFormChange}
        onSubmit={handleChildSubmit} // Submit dipicu di sini, lalu validasi, lalu modal konfirmasi
        inputRefs={formRefs}
        errors={errors}
        // fileName dan setFileName dihapus dari props
        // Anda mungkin perlu meneruskan prop lain seperti loading/success jika ada
        // loading={loading}
        // success={success}
      />

      {/* Modal Konfirmasi Submit */}
      <ModalConfirm
        open={showConfirmModal}
        title="Konfirmasi Pengiriman Data Orang" // Sesuaikan judul
        text="Apakah Anda yakin data orang yang diisi sudah benar dan siap dikirim? Jika masih ragu, silakan cek kembali data Anda." // Sesuaikan teks
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleModalConfirm} // Ini akan memanggil onSubmit dari parent setelah konfirmasi
      />

      {/* Modal Sukses (Ditampilkan setelah onSubmit di parent berhasil) */}
      <ModalConfirm
        open={showSuccessModal} // Dikontrol oleh prop dari parent
        title="Data Berhasil Dikirim" // Judul untuk sukses
        text="Data orang berhasil dikirimkan." // Teks untuk sukses
        onCancel={onCloseSuccessModal} // Tombol Batal akan menutup modal sukses
        onConfirm={onCloseSuccessModal} // Tombol Konfirmasi akan menutup modal sukses
      />

      {/* Modal Pindah Formulir tidak diperlukan karena hanya ada satu jenis */}
    </div>
  );
}

OrangForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onFormChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired, // Prop ini tampaknya tidak digunakan di komponen ini
  // Prop baru untuk modal sukses:
  showSuccessModal: PropTypes.bool.isRequired,
  onCloseSuccessModal: PropTypes.func.isRequired,
};
