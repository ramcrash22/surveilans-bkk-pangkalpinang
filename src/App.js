import React, { useState, useEffect } from "react";
import "./App.css";
import { Container, Button } from "react-bootstrap";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import HeroSlider from "./components/HeroSlider/HeroSlider";
import AppGrid from "./components/AppGrid/AppGrid";
import MainLayout from "./components/MainLayout";
import FormulirAlatAngkut from "./components/FormulirAlatAngkut/FormulirAlatAngkut";
import ModalConfirm from "./components/Modal/ModalConfirm";
import FormulirBarang from "./components/FormulirBarang/FormulirBarang";
import FormulirOrang from "./components/FormulirOrang/FormulirOrang";

function HomeContent({ pesanDariApi, loading, error }) {
  return (
    <>
      <HeroSlider />
      <AppGrid />
      <Container className="mt-4">
        <h1>Selamat Datang di Surveilans BKK Pangkalpinang</h1>
        {loading ? (
          <p>Memuat pesan...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p>Pesan dari API: {pesanDariApi}</p>
        )}
        <Button variant="success" className="mt-3">
          Contoh Tombol Bootstrap
        </Button>
      </Container>
    </>
  );
}

function App() {
  const [pesanDariApi, setPesanDariApi] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // STATE MODAL GLOBAL
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    text: "",
    onConfirm: null,
    onCancel: null,
  });

  // FUNGSI GLOBAL UNTUK BUKA MODAL
  const openModal = ({ title, text, onConfirm, onCancel }) => {
    setModalContent({
      title: title || "",
      text: text || "",
      onConfirm: typeof onConfirm === "function" ? onConfirm : null,
      onCancel: typeof onCancel === "function" ? onCancel : null,
    });
    setModalOpen(true);
  };

  // OPTIONAL: Untuk menutup modal (tidak wajib, karena sudah di-handle di onCancel/onConfirm)
  const closeModal = () => setModalOpen(false);

  // FETCH DATA API
  useEffect(() => {
    // Ganti ke endpoint API online (jika belum punya, biarkan kosong agar tidak error)
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? "https://your-api-online.com/api/halo" // Ganti dengan URL API online kamu
        : "http://localhost:8000/api/halo";
    const controller = new AbortController();
    const signal = controller.signal;

    axios
      .get(apiUrl, { signal: signal })
      .then((res) => {
        setPesanDariApi(res.data.pesan);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("Request aborted", err.message);
        } else {
          console.error("Error fetching data:", err);
          setError("Gagal memuat pesan dari API.");
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <HomeContent pesanDariApi={pesanDariApi} loading={loading} error={error} />
            </MainLayout>
          }
        />
        <Route
          path="/Formulir-Alat-Angkut"
          element={
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <FormulirAlatAngkut openModal={openModal} />
            </MainLayout>
          }
        />
        <Route
          path="/Formulir-Barang"
          element={
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <FormulirBarang openModal={openModal} />
            </MainLayout>
          }
        />
        <Route
          path="/Formulir-Orang"
          element={
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <FormulirOrang openModal={openModal} />
            </MainLayout>
          }
        />
        {/* Tambah route lain di sini jika perlu */}
      </Routes>
      {/* ModalConfirm GLOBAL, selalu di luar <Routes> */}
      <ModalConfirm
        open={modalOpen}
        title={modalContent.title}
        text={modalContent.text}
        onCancel={() => {
          setModalOpen(false);
          if (typeof modalContent.onCancel === "function") modalContent.onCancel();
        }}
        onConfirm={() => {
          setModalOpen(false);
          if (typeof modalContent.onConfirm === "function") modalContent.onConfirm();
        }}
      />
    </>
  );
}

export default App;
