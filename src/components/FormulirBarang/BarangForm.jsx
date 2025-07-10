import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// Pastikan path import ini benar sesuai struktur folder Anda
import BarangKeberangkatanForm from './BarangKeberangkatanForm';
import BarangKedatanganForm from './BarangKedatanganForm';
import BarangPengendalianForm from './BarangPengendalianForm';
import ModalConfirm from '../Modal/ModalConfirm'; // Pastikan path import ini benar

// Definisi field wajib untuk setiap jenis form
const requiredFieldsMap = {
  keberangkatan: [
    "tanggal", "wilayah", "namaPetugas", "jabatan", "namaBarang", "lokasiSandar",
    "jenisBarang", "benderaBarang", "volume", "jumlahABK_WNI", "jumlahABK_WNA", "jumlahPenumpang_WNI",
    "jumlahPenumpang_WNA", "pelabuhanKeberangkatan", "negaraKabupatenKotaKeberangkatan",
    "tujuanKeberangkatan", "statusKesPelabuhan", "jumlahMuatanR2", "jumlahMuatanLain",
    "statusBarang", "statusPemeriksaan"
  ],
  kedatangan: [
    "tanggalKedatangan",
    "wilayahTujuan",
    "namaPetugas",
    "jabatan",
    "pengawasanBarang",
    "dokumenPendukung" // Field dokumen pendukung di form kedatangan
  ],
  pengendalian: [
    "tanggal",
    "wilayah",
    "namaPetugas",
    "jabatan",
    "namaBarang", // namaBarang di form pengendalian adalah radio
    "namaPenanggungJawab",
    "kontakPenanggungJawab",
    "faktorRisiko",
    "jenisPengendalian", // jenisPengendalian di form pengendalian adalah radio
    "namaBUS",
    "dokumenDiterbitkan",
    "dokumenPelaksanaan" // Field dokumen pelaksanaan di form pengendalian
  ]
};

// Helper function untuk mendapatkan daftar field wajib berdasarkan form dan data
function getRequiredFields(formData, selectedForm) {
  let required = [...(requiredFieldsMap[selectedForm] || [])];

  // Logika penambahan field wajib berdasarkan kondisi spesifik form Keberangkatan
  if (selectedForm === "keberangkatan" && formData.statusPemeriksaan === "Periksa") {
    required = required.concat([
      "p3k", "sscc", "bukuKesehatan", "crewList", "passengerList", "voyageMemo",
      "shipParticular", "lastPortPHQC", "lastPortClearance", "cargoManifest",
      "generalList", "medicineList", "vaccinationList",
      "faktorRisikoAlatAngkut", "faktorRisikoOrang", "faktorRisikoBarang", "pelanggaranKekarantinaan",
      "rekomendasi",
    ]);
    [
      "faktorRisikoAlatAngkut",
      "faktorRisikoOrang",
      "faktorRisikoBarang",
      "pelanggaranKekarantinaan"
    ].forEach(field => {
      if (formData[field] === "ada") {
        required.push(`${field}Keterangan`);
      }
    });
     if (!required.includes("dokumenPendukung")) {
         required.push("dokumenPendukung");
     }
  }

  // Logika penambahan field wajib untuk form Kedatangan berdasarkan pengawasanBarang
  if (selectedForm === "kedatangan") {
      const pengawasanBarang = formData.pengawasanBarang;
      // IMPORT ATAU DEFINISIKAN ULANG FIELD ARRAYS DARI CHILD COMPONENT DI SINI
      // Hanya field yang required dan punya opsi 'Lainnya' yang perlu didefinisikan ulang di sini
      const jenazahFieldsPartial = [
        { name: "namaJenazah", required: true }, { name: "jenisKelaminJenazah", required: true },
        { name: "tglLahirJenazah", required: true }, { name: "kebangsaan", required: true },
        { name: "asalJenazah", required: true }, { name: "tujuanJenazah", required: true },
        { name: "alatAngkutJenazah", required: true }, { name: "penyebabKematian", required: true, hasOther: true },
        { name: "diagnosisKematian", required: true }, { name: "kelengkapanDokumenJenazah", required: true },
        { name: "faktorRisiko", required: true, hasOther: true }, { name: "tindakan", required: true, hasOther: true },
      ];
      const omkabaFieldsPartial = [
        { name: "jenisKomoditi", required: true, hasOther: true }, { name: "asalOmkaba", required: true },
        { name: "namaPenerima", required: true }, { name: "alamatPenerima", required: true },
        { name: "jumlahKomoditiOmkaba", required: true }, { name: "kelengkapanDokumenOmkaba", required: true },
        { name: "dokumenPendukungOmkaba", required: true }, { name: "kondisiKemasan", required: true, hasOther: true },
        { name: "faktorRisikoOmkaba", required: true, hasOther: true }, { name: "tindakanOmkaba", required: true },
      ];
      const sampelBiologiFieldsPartial = [
         { name: "namaSampel", required: true }, { name: "jenisSampel", required: true, hasOther: true },
         { name: "volume", required: true }, { name: "asalInstansi", required: true },
         { name: "penerimaSampel", required: true }, { name: "kontakPenerima", required: true },
         { name: "alatAngkutSampel", required: true }, { name: "noSuratPengantar", required: true },
         { name: "kondisiKemasanUtama", required: true, hasOther: true }, { name: "kondisiKemasanPendukung", required: true, hasOther: true },
         { name: "suhuPenyimpanan", required: true }, { name: "faktorRisikoSampel", required: true, hasOther: true },
         { name: "tindakanSampel", required: true, hasOther: true },
      ];
      const barangBawaanFieldsPartial = [
         { name: "namaBarang", required: true }, { name: "namaPemilikBarang", required: true },
         { name: "kontakPemilikBarang", required: true }, { name: "asalBarang", required: true },
         { name: "alatAngkutBarangBawaan", required: true }, { name: "daftarBarang", required: true },
         { name: "kondisiPenyimpanan", required: true, hasOther: true }, { name: "faktorRisikoBarangBawaan", required: true, hasOther: true },
         { name: "tindakanBarangBawaan", required: true, hasOther: true },
      ];
      const kargoManifestFieldsPartial = [
         { name: "jenisKargo", required: true, hasOther: true }, { name: "namaPenerima", required: true },
         { name: "kontakPenerima", required: true }, { name: "asalKargo", required: true },
         { name: "alatAngkutKargo", required: true }, { name: "dokumenCargo", required: true, hasOther: true },
         { name: "faktorRisikoKargo", required: true }, { name: "tindakanKargo", required: true },
      ];

      let dynamicFieldsPartial = [];
      switch (pengawasanBarang) {
         case "Jenazah": dynamicFieldsPartial = jenazahFieldsPartial; break;
         case "Omkaba": dynamicFieldsPartial = omkabaFieldsPartial; break;
         case "Sampel Biologi": dynamicFieldsPartial = sampelBiologiFieldsPartial; break;
         case "Barang Bawaan": dynamicFieldsPartial = barangBawaanFieldsPartial; break;
         case "Kargo Manifest": dynamicFieldsPartial = kargoManifestFieldsPartial; break;
         default: dynamicFieldsPartial = [];
      }

      dynamicFieldsPartial.forEach(field => {
          if (field.required) {
              // Tambahkan nama field dinamis ke daftar wajib
              if (!required.includes(field.name)) { // Hindari duplikasi
                  required.push(field.name);
              }
              // Tambahkan field 'lainnya_' jika opsi 'Lainnya' dipilih
              if (field.hasOther && formData[field.name] === 'Lainnya') {
                 const lainnyaFieldName = `lainnya_${field.name}`;
                 if (!required.includes(lainnyaFieldName)) { // Hindari duplikasi
                     required.push(lainnyaFieldName);
                 }
              }
          }
      });
  }

  // Logika penambahan field wajib untuk form Pengendalian
  if (selectedForm === "pengendalian") {
    // Tambahkan field 'lainnya_' jika opsi 'Lainnya' atau 'Other' dipilih
    if (formData.namaBarang === "Lainnya") {
        if (!required.includes("lainnya_namaBarang")) {
            required.push("lainnya_namaBarang");
        }
    }
     if (formData.jenisPengendalian === "Other") {
        if (!required.includes("lainnya_jenisPengendalian")) {
             required.push("lainnya_jenisPengendalian");
        }
    }
    // Dokumen Pelaksanaan sudah masuk di requiredFieldsMap.pengendalian
  }


  return required;
}


export default function BarangForm({
  formData,
  setFormData,
  onJenisFormChange,
  onFormChange
}) {
  const [selectedForm, setSelectedForm] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingForm, setPendingForm] = useState('');
  const [showSwitchFormModal, setShowSwitchFormModal] = useState(false);
  const [errors, setErrors] = useState({});
  // State untuk nama file dokumen pendukung di form Kedatangan
  const [fileNameKedatangan, setFileNameKedatangan] = useState('');
   // State untuk nama file dokumen pelaksanaan di form Pengendalian
  const [fileNamePengendalian, setFileNamePengendalian] = useState('');


  // *** Gunakan useRef untuk membuat objek ref. Objek ini akan bertahan antar render. ***
  // *** formRefs.current akan menjadi objek plain {} tempat referensi DOM disimpan. ***
  const formRefs = useRef({});

  // Hapus useEffect yang mencoba membuat refs di sini.
  // Refs akan dibuat secara otomatis oleh React saat komponen anak di-render
  // dan callback ref={(ref) => formRefs.current[fieldName] = ref} dijalankan.

  const requiredFields = getRequiredFields(formData, selectedForm);

  const isFormDirty = () => {
     // Periksa apakah ada data di formData yang bukan field internal seperti file name state
     const formKeys = Object.keys(formData).filter(key =>
         // Kecualikan objek File itu sendiri dari pengecekan "dirty"
         key !== 'dokumenPendukung' && key !== 'dokumenPelaksanaan'
     );
     return formKeys.some(field => {
       const val = formData[field];
       // Cek apakah nilai ada dan bukan string kosong atau array kosong
       // Juga cek field 'lainnya_' yang mungkin terisi
       if (field.startsWith('lainnya_')) {
           return val !== undefined && val !== "" && val !== null;
       }
       return val !== undefined && val !== "" && val !== null && !(Array.isArray(val) && val.length === 0);
     });
  };


  const validateForm = () => {
    const newErrors = {};
    let firstErrorField = null; // Untuk melacak field pertama yang error

    requiredFields.forEach(field => {
      const value = formData[field];
      const isCheckbox = Array.isArray(value); // Asumsi checkbox menyimpan array

      // Validasi field wajib yang kosong
      // Field dianggap kosong jika:
      // - nilainya falsy (undefined, null, '', 0, false)
      // - ATAU jika itu checkbox dan arraynya kosong
      // - KECUALI jika fieldnya adalah field 'lainnya_' dan dropdown/radio aslinya BUKAN 'Lainnya'/'Other' (kondisi ini ditangani di bawah)
      const isLainnyaField = field.startsWith('lainnya_');
      const originalFieldName = isLainnyaField ? field.substring('lainnya_'.length) : null;
      const isOriginalOptionLainnyaOrOther = isLainnyaField && (formData[originalFieldName] === 'Lainnya' || formData[originalFieldName] === 'Other');


      // *** Pastikan format ini konsisten: if (...) { ***
      if (
           ( !value && !(isCheckbox && value.length > 0) ) // Nilai falsy DAN bukan checkbox kosong
           && ( !isLainnyaField || isOriginalOptionLainnyaOrOther ) // Bukan field 'lainnya_' ATAU field 'lainnya_' dan opsi aslinya 'Lainnya'/'Other'
         ) {
          // Tentukan pesan error spesifik untuk checkbox kosong
          if (isCheckbox && value.length === 0) {
               newErrors[field] = `Pilih minimal satu opsi untuk ${field}`;
          } else { // Untuk tipe lain (text, date, dropdown, radio, 'lainnya_')
              newErrors[field] = "Field ini wajib diisi";
          }

          if (!firstErrorField) {
              firstErrorField = field;
          }
      }

      // Validasi ukuran file (jika fieldnya adalah dokumen)
      if (field === "dokumenPendukung" && formData.dokumenPendukung instanceof File) {
        if (formData.dokumenPendukung.size > 5 * 1024 * 1024) { // 5MB
          newErrors.dokumenPendukung = "Ukuran file maksimal 5MB";
           if (!firstErrorField) {
              firstErrorField = field;
            }
        }
      }
       if (field === "dokumenPelaksanaan" && formData.dokumenPelaksanaan instanceof File) {
        if (formData.dokumenPelaksanaan.size > 1 * 1024 * 1024) { // 1MB
          newErrors.dokumenPelaksanaan = "Ukuran file maksimal 1MB";
           if (!firstErrorField) {
              firstErrorField = field;
            }
        }
      }

       // Validasi tambahan untuk field 'Lainnya' di form Kedatangan (sudah ada, pastikan benar)
       if (selectedForm === "kedatangan") {
           const pengawasanBarang = formData.pengawasanBarang;
           // Anda perlu mendefinisikan atau mengimpor array field dengan hasOther di sini lagi
           // Pastikan definisi ini sesuai dengan yang di getRequiredFields
           const fieldsWithOtherKedatangan = [
               ...(pengawasanBarang === 'Jenazah' ? [{name: 'penyebabKematian', hasOther: true}, {name: 'faktorRisiko', hasOther: true}, {name: 'tindakan', hasOther: true}] : []),
               ...(pengawasanBarang === 'Omkaba' ? [{name: 'jenisKomoditi', hasOther: true}, {name: 'kondisiKemasan', hasOther: true}, {name: 'faktorRisikoOmkaba', hasOther: true}] : []),
               ...(pengawasanBarang === 'Sampel Biologi' ? [{name: 'jenisSampel', hasOther: true}, {name: 'kondisiKemasanUtama', hasOther: true}, {name: 'kondisiKemasanPendukung', hasOther: true}, {name: 'suhuPenyimpanan', hasOther: true}, {name: 'faktorRisikoSampel', hasOther: true}, {name: 'tindakanSampel', hasOther: true}] : []),
               ...(pengawasanBarang === 'Barang Bawaan' ? [{name: 'kondisiPenyimpanan', hasOther: true}, {name: 'faktorRisikoBarangBawaan', hasOther: true}, {name: 'tindakanBarangBawaan', hasOther: true}] : []),
               ...(pengawasanBarang === 'Kargo Manifest' ? [{name: 'jenisKargo', hasOther: true}, {name: 'dokumenCargo', hasOther: true}] : []),
           ];

           fieldsWithOtherKedatangan.forEach(field => {
               const otherFieldName = `lainnya_${field.name}`;
                // Cek apakah field dropdown aslinya ada dan nilainya 'Lainnya'
               if (formData[field.name] === "Lainnya" && (!formData[otherFieldName] || formData[otherFieldName].trim() === "")) {
                   newErrors[otherFieldName] = "Harap isi keterangan untuk opsi 'Lainnya'";
                    if (!firstErrorField) {
                       firstErrorField = otherFieldName;
                   }
               }
           });
       }

        // Validasi tambahan untuk field 'Lainnya'/'Other' di form Pengendalian
       if (selectedForm === "pengendalian") {
           // namaBarang 'Lainnya'
           if (formData.namaBarang === "Lainnya" && (!formData.lainnya_namaBarang || formData.lainnya_namaBarang.trim() === "")) {
               newErrors.lainnya_namaBarang = "Harap isi keterangan untuk opsi 'Lainnya'";
               if (!firstErrorField) {
                   firstErrorField = 'lainnya_namaBarang';
               }
           }
           // jenisPengendalian 'Other'
            if (formData.jenisPengendalian === "Other" && (!formData.lainnya_jenisPengendalian || formData.lainnya_jenisPengendalian.trim() === "")) {
               newErrors.lainnya_jenisPengendalian = "Harap isi keterangan untuk opsi 'Other'";
               if (!firstErrorField) {
                   firstErrorField = 'lainnya_jenisPengendalian';
               }
           }
       }


    }); // <-- End of requiredFields.forEach loop

    return { errors: newErrors, firstErrorField: firstErrorField };
  }; // <-- End of validateForm function

  const handleChildFormChange = (e) => {
    if (e && e.target) {
      const { name, value, type, files, checked } = e.target;

      if (type === "file") {
        const file = files?.[0] || null;
        setFormData(prev => ({
          ...prev,
          [name]: file // Simpan objek File itu sendiri
        }));
        // Update state nama file terpisah untuk tampilan
        if (name === 'dokumenPendukung') {
             setFileNameKedatangan(file ? file.name : '');
        } else if (name === 'dokumenPelaksanaan') {
             setFileNamePengendalian(file ? file.name : '');
        }

      } else if (type === "checkbox") {
          // Logika untuk checkbox: tambahkan atau hapus nilai dari array
          setFormData(prev => {
              const currentValues = Array.isArray(prev[name]) ? prev[name] : [];
              if (checked) {
                  return { ...prev, [name]: [...currentValues, value] };
              } else {
                  return { ...prev, [name]: currentValues.filter(item => item !== value) };
              }
          });
      }
      else {
        // Logika untuk input teks, tanggal, dropdown, radio
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }

      // Clear error for this field when user starts typing/changing
      setErrors(prev => ({ ...prev, [name]: undefined }));
       // Jika field 'Lainnya' terkait diubah, clear error juga untuk dropdown/radio aslinya
       if (name.startsWith('lainnya_')) {
            const originalFieldName = name.substring('lainnya_'.length);
            setErrors(prev => ({ ...prev, [originalFieldName]: undefined }));
       }
        // Jika dropdown/radio diubah ke/dari 'Lainnya'/'Other', clear error untuk field 'Lainnya' terkait
        // Ini penting jika user mengisi field 'Lainnya' lalu mengganti pilihan dropdown/radio
        const lainnyaFieldName = `lainnya_${name}`;
        if (formData[lainnyaFieldName] !== undefined) {
             // Clear error jika nilai dropdown/radio BUKAN 'Lainnya'/'Other'
             if (value !== 'Lainnya' && value !== 'Other') {
                 setErrors(prev => ({ ...prev, [lainnyaFieldName]: undefined }));
             }
             // Jika nilai dropdown/radio MENJADI 'Lainnya'/'Other', error akan divalidasi saat submit
        }


      // Panggil onFormChange prop jika ada
      if (onFormChange) {
           // Perbarui formData yang dikirim ke onFormChange secara akurat
            let updatedFormData = {};
            if (type === "file") {
                 updatedFormData = { ...formData, [name]: files?.[0] || null };
            } else if (type === "checkbox") {
                 const currentValues = Array.isArray(formData[name]) ? formData[name] : [];
                 const newValues = checked ? [...currentValues, value] : currentValues.filter(item => item !== value);
                 updatedFormData = { ...formData, [name]: newValues };
            } else {
                 updatedFormData = { ...formData, [name]: value };
            }
           onFormChange(updatedFormData);
      }

    } else if (typeof e === "object") {
      // Ini menangani kasus jika onChange mengirimkan objek langsung (misalnya dari komponen kustom)
      setFormData(prev => ({
        ...prev,
        ...e
      }));
      // Panggil onFormChange prop jika ada
      if (onFormChange) onFormChange({ ...formData, ...e });
      // Mungkin perlu logika tambahan untuk membersihkan error jika ada field yang diubah
    }
  };

  const handleChange = (e) => {
    const nextForm = e.target.value;
    if (!selectedForm || !isFormDirty()) {
      // Tidak ada form yang dipilih atau form kosong, langsung ganti
      updateSelectedForm(nextForm);
    } else if (nextForm !== selectedForm) {
      // Form sedang diisi dan ingin ganti form, tampilkan modal konfirmasi
      setPendingForm(nextForm);
      setShowSwitchFormModal(true);
    }
  };

  const updateSelectedForm = (nextForm) => {
    // Panggil onJenisFormChange prop jika ada
    if (onJenisFormChange) {
      onJenisFormChange(setSelectedForm, nextForm);
    } else {
      setSelectedForm(nextForm);
    }
    resetForm(); // Reset form saat ganti jenis
  };

  const resetForm = () => {
    if (setFormData) setFormData({}); // Reset data form
    if (onFormChange) onFormChange({}); // Beri tahu parent bahwa form data kosong
    setErrors({}); // Reset error
    // *** Bersihkan objek ref saat form di-reset ***
    formRefs.current = {};
    // Reset state nama file
    setFileNameKedatangan('');
    setFileNamePengendalian(''); // *** Reset state nama file pengendalian ***
  };

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
         // *** Akses ref elemen DOM langsung dari formRefs.current ***
         // Pastikan elemen tersebut bisa difokus. Input file tidak bisa langsung difokus.
         // Jika field error adalah input file, fokus ke elemen label atau container-nya jika perlu.
         // Untuk saat ini, kita asumsikan elemen yang punya ref bisa difokus.
         // Menambahkan try-catch untuk menangani potensi error fokus pada elemen non-fokusable
         try {
             formRefs.current[firstErrorField].focus();
         } catch (error) {
             console.error("Failed to focus on element:", firstErrorField, error);
             // Fallback jika fokus gagal
             const formElement = e.target; // e.target adalah elemen <form>
             if (formElement) {
                 const firstFocusable = formElement.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])');
                 if (firstFocusable) {
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
              if (firstFocusable) {
                  firstFocusable.focus();
              }
          }
      }
    }
  };

  const handleModalConfirm = () => {
    setShowConfirmModal(false);
    // Di sini Anda akan menambahkan logika pengiriman data sebenarnya (misalnya ke API)
    console.log("Submitting data:", formData);
    alert("Data berhasil dikirim! (simulasi)");
    resetForm(); // Reset form setelah berhasil dikirim (simulasi)
  };

  const handleSwitchFormConfirm = () => {
    setShowSwitchFormModal(false);
    updateSelectedForm(pendingForm); // Ganti form setelah konfirmasi
    setPendingForm('');
  };

  const renderFormSelect = () => (
    <>
      <label htmlFor="barangFormSelect" style={{ fontWeight: 'bold', marginBottom: 8, display: 'block' }}>
        Pilih Formulir
      </label>
      <select
        id="barangFormSelect"
        value={selectedForm}
        onChange={handleChange}
        style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #b7bfd8', marginBottom: 24 }}
      >
        <option value="">-- Pilih Formulir --</option>
        <option value="keberangkatan">Formulir Keberangkatan</option>
        <option value="kedatangan">Formulir Kedatangan</option>
        <option value="pengendalian">Formulir Pengendalian</option> {/* Tambahkan opsi Pengendalian */}
      </select>
      {!selectedForm && (
        <div style={{ color: '#888', fontStyle: 'italic', marginTop: 12 }}>
          Silakan pilih jenis formulir yang ingin diisi.
        </div>
      )}
    </>
  );

  const renderSelectedForm = () => {
    // Props umum yang diteruskan ke semua form anak
    const commonProps = {
        formData: formData,
        onChange: handleChildFormChange,
        onSubmit: handleChildSubmit,
        // *** Teruskan objek ref itu sendiri, BUKAN formRefs.current ***
        inputRefs: formRefs,
        errors: errors,
        // Anda mungkin perlu menambahkan props loading dan success jika form anak membutuhkannya
        // loading: false, // Contoh
        // success: false, // Contoh
    };

    switch (selectedForm) {
      case 'keberangkatan':
        return (
          <BarangKeberangkatanForm
            {...commonProps}
            // Tambahkan props spesifik untuk form keberangkatan jika ada
            // Form keberangkatan Anda belum menerima fileName/setFileName
            // fileName={fileNameKeberangkatan}
            // setFileName={setFileNameKeberangkatan}
          />
        );
      case 'kedatangan':
        return (
          <BarangKedatanganForm
            {...commonProps}
            // Tambahkan props spesifik untuk form kedatangan
            fileName={fileNameKedatangan} // Teruskan state nama file
            setFileName={setFileNameKedatangan} // Teruskan setter state nama file
          />
        );
      case 'pengendalian': // *** Tambahkan case untuk form pengendalian ***
        return (
          <BarangPengendalianForm
            {...commonProps}
             // Tambahkan props spesifik untuk form pengendalian
            fileName={fileNamePengendalian} // Teruskan state nama file
            setFileName={setFileNamePengendalian} // Teruskan setter state nama file
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderFormSelect()}
      {renderSelectedForm()}

      <ModalConfirm
        open={showConfirmModal}
        title="Konfirmasi Pengiriman"
        text="Apakah Anda yakin data yang diisi sudah benar dan siap dikirim? Jika masih ragu, silakan cek kembali data Anda."
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={handleModalConfirm}
      />

      <ModalConfirm
        open={showSwitchFormModal}
        title="Pindah Formulir?"
        text="Anda memiliki data yang belum dikirim. Jika Anda berpindah formulir, data yang sudah diisi akan hilang. Lanjutkan?"
        onCancel={() => setShowSwitchFormModal(false)}
        onConfirm={handleSwitchFormConfirm}
      />
    </div>
  );
}

BarangForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onJenisFormChange: PropTypes.func,
  onFormChange: PropTypes.func,
};
