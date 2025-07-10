import React, { useState } from 'react';
import styles from './KapalLautKeberangkatanForm.module.css';

const wilayahOptions = [
  { value: '', label: 'Choose' },
  { value: 'wilayah1', label: 'Wilayah 1' },
  { value: 'wilayah2', label: 'Wilayah 2' },
  // Tambahkan opsi wilayah lain sesuai kebutuhan
];

const jenisPesawatOptions = [
  { value: '', label: 'Choose' },
  { value: 'penumpang', label: 'Penumpang' },
  { value: 'kargo', label: 'Kargo' },
  { value: 'private_jet', label: 'Private Jet' },
  { value: 'vvip', label: 'VVIP' },
  { value: 'tni_polri', label: 'TNI/POLRI' },
  { value: 'helikopter', label: 'Helikopter' },
];

export default function PesawatKeberangkatanForm({
  formData: initialFormData = {},
  onChange,
  onSubmit,
  inputRefs = {}
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    setErrors({ ...errors, [field]: undefined });
    if (onChange) onChange(newFormData);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal harus diisi';
    if (!formData.wilayah) newErrors.wilayah = 'Wilayah harus diisi';
    if (!formData.namaPetugas) newErrors.namaPetugas = 'Nama Petugas harus diisi';
    if (!formData.jabatan) newErrors.jabatan = 'Jabatan harus diisi';
    if (!formData.namaPesawat) newErrors.namaPesawat = 'Nama Pesawat harus diisi';
    if (!formData.noPenerbangan) newErrors.noPenerbangan = 'No Penerbangan harus diisi';
    if (!formData.jenisPesawat) newErrors.jenisPesawat = 'Jenis Pesawat harus diisi';
    if (!formData.bandaraTujuan) newErrors.bandaraTujuan = 'Bandara Tujuan harus diisi';
    if (
      formData.jumlahCrewWNI === undefined ||
      formData.jumlahCrewWNI === '' ||
      isNaN(Number(formData.jumlahCrewWNI))
    ) newErrors.jumlahCrewWNI = 'Jumlah Crew WNI harus diisi';
    if (
      formData.jumlahCrewWNA === undefined ||
      formData.jumlahCrewWNA === '' ||
      isNaN(Number(formData.jumlahCrewWNA))
    ) newErrors.jumlahCrewWNA = 'Jumlah Crew WNA harus diisi';
    if (
      formData.jumlahPenumpangWNI === undefined ||
      formData.jumlahPenumpangWNI === '' ||
      isNaN(Number(formData.jumlahPenumpangWNI))
    ) newErrors.jumlahPenumpangWNI = 'Jumlah Penumpang WNI harus diisi';
    if (
      formData.jumlahPenumpangWNA === undefined ||
      formData.jumlahPenumpangWNA === '' ||
      isNaN(Number(formData.jumlahPenumpangWNA))
    ) newErrors.jumlahPenumpangWNA = 'Jumlah Penumpang WNA harus diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      if (onSubmit) onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" className={styles.formContainer}>
      <div>
        <label className={styles.formLabel}>
          Tanggal Pelaksanaan <span className={styles.required}>*</span>
        </label>
        <input
          type="date"
          className={styles.formInput}
          ref={inputRefs.tanggal}
          value={formData.tanggal || ''}
          onChange={(e) => handleChange('tanggal', e.target.value)}
        />
        {errors.tanggal && <div className={styles.errorText}>{errors.tanggal}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Wilayah Kerja/Pos <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.formSelect}
          ref={inputRefs.wilayah}
          value={formData.wilayah || ''}
          onChange={(e) => handleChange('wilayah', e.target.value)}
        >
          {wilayahOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.wilayah && <div className={styles.errorText}>{errors.wilayah}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Nama Petugas <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.formInput}
          ref={inputRefs.namaPetugas}
          value={formData.namaPetugas || ''}
          onChange={(e) => handleChange('namaPetugas', e.target.value)}
          placeholder="Your answer"
        />
        {errors.namaPetugas && <div className={styles.errorText}>{errors.namaPetugas}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Jabatan <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.formInput}
          ref={inputRefs.jabatan}
          value={formData.jabatan || ''}
          onChange={(e) => handleChange('jabatan', e.target.value)}
          placeholder="Your answer"
        />
        {errors.jabatan && <div className={styles.errorText}>{errors.jabatan}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Nama Pesawat <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.formInput}
          ref={inputRefs.namaPesawat}
          value={formData.namaPesawat || ''}
          onChange={(e) => handleChange('namaPesawat', e.target.value)}
          placeholder="Your answer"
        />
        {errors.namaPesawat && <div className={styles.errorText}>{errors.namaPesawat}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          No Penerbangan <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.formInput}
          ref={inputRefs.noPenerbangan}
          value={formData.noPenerbangan || ''}
          onChange={(e) => handleChange('noPenerbangan', e.target.value)}
          placeholder="Your answer"
        />
        {errors.noPenerbangan && <div className={styles.errorText}>{errors.noPenerbangan}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Jenis Pesawat <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.formSelect}
          ref={inputRefs.jenisPesawat}
          value={formData.jenisPesawat || ''}
          onChange={(e) => handleChange('jenisPesawat', e.target.value)}
        >
          {jenisPesawatOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.jenisPesawat && <div className={styles.errorText}>{errors.jenisPesawat}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Bandara Tujuan <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          className={styles.formInput}
          ref={inputRefs.bandaraTujuan}
          value={formData.bandaraTujuan || ''}
          onChange={(e) => handleChange('bandaraTujuan', e.target.value)}
          placeholder="Your answer"
        />
        {errors.bandaraTujuan && <div className={styles.errorText}>{errors.bandaraTujuan}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Jumlah Crew WNI <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          className={styles.formInput}
          min="0"
          ref={inputRefs.jumlahCrewWNI}
          value={formData.jumlahCrewWNI || ''}
          onChange={(e) => handleChange('jumlahCrewWNI', e.target.value.replace(/\D/,''))}
          placeholder="Your answer"
        />
        {errors.jumlahCrewWNI && <div className={styles.errorText}>{errors.jumlahCrewWNI}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Jumlah Crew WNA <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          className={styles.formInput}
          min="0"
          ref={inputRefs.jumlahCrewWNA}
          value={formData.jumlahCrewWNA || ''}
          onChange={(e) => handleChange('jumlahCrewWNA', e.target.value.replace(/\D/,''))}
          placeholder="Your answer"
        />
        {errors.jumlahCrewWNA && <div className={styles.errorText}>{errors.jumlahCrewWNA}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Jumlah Penumpang WNI <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          className={styles.formInput}
          min="0"
          ref={inputRefs.jumlahPenumpangWNI}
          value={formData.jumlahPenumpangWNI || ''}
          onChange={(e) => handleChange('jumlahPenumpangWNI', e.target.value.replace(/\D/,''))}
          placeholder="Your answer"
        />
        {errors.jumlahPenumpangWNI && <div className={styles.errorText}>{errors.jumlahPenumpangWNI}</div>}
      </div>

      <div>
        <label className={styles.formLabel}>
          Jumlah Penumpang WNA <span className={styles.required}>*</span>
        </label>
        <input
          type="number"
          className={styles.formInput}
          min="0"
          ref={inputRefs.jumlahPenumpangWNA}
          value={formData.jumlahPenumpangWNA || ''}
          onChange={(e) => handleChange('jumlahPenumpangWNA', e.target.value.replace(/\D/,''))}
          placeholder="Your answer"
        />
        {errors.jumlahPenumpangWNA && <div className={styles.errorText}>{errors.jumlahPenumpangWNA}</div>}
      </div>

      <button type="submit" className={styles.formButton}>
        Simpan
      </button>
    </form>
  );
}
