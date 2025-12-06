import { useRef } from "react";
import { motion } from "framer-motion";
import { Head, Link } from "@inertiajs/react";
import AdminHeader from "@/Components/admin/AdminHeader.jsx";
import Usuarios from "@/Components/admin/Usuarios.jsx";
import Productos from "@/Components/admin/Productos.jsx";
import Reportes from "@/Components/admin/Reportes.jsx";
import Notas from "@/Components/admin/Notas.jsx"; // <-- Importa tu componente Notas

export default function AdminDashboard() {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null); // <-- Nuevo ref para Notas

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 flex flex-col">

      <AdminHeader onLogout={handleLogout} />
      <Head title="Admin Dashboard" />

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center space-y-10 px-4">
        <motion.h1
          className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-gray-800 drop-shadow-lg leading-tight"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Bienvenido <span className="text-pink-500">Admin</span> 🚀
        </motion.h1>

        {/* Botones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl">
          <button
            onClick={() => scrollToSection(section1Ref)}
            className="px-6 py-4 bg-white rounded-2xl shadow-lg text-base sm:text-lg font-semibold text-gray-800 hover:bg-yellow-100 transition w-full"
          >
            Usuarios
          </button>

          <button
            onClick={() => scrollToSection(section2Ref)}
            className="px-6 py-4 bg-white rounded-2xl shadow-lg text-base sm:text-lg font-semibold text-gray-800 hover:bg-yellow-100 transition w-full"
          >
            Productos
          </button>

          <button
            onClick={() => scrollToSection(section3Ref)}
            className="px-6 py-4 bg-white rounded-2xl shadow-lg text-base sm:text-lg font-semibold text-gray-800 hover:bg-blue-100 transition w-full"
          >
            Reportes
          </button>

          <button
            onClick={() => scrollToSection(section4Ref)}
            className="px-6 py-4 bg-white rounded-2xl shadow-lg text-base sm:text-lg font-semibold text-gray-800 hover:bg-green-100 transition w-full"
          >
            Notas
          </button>
        </div>
      </section>

      <section ref={section1Ref} className="min-h-screen flex justify-center items-center px-4">
        <Usuarios />
      </section>

      <section ref={section2Ref} className="min-h-screen flex justify-center items-center px-4">
        <Productos />
      </section>

      <section ref={section3Ref} className="min-h-screen flex justify-center items-center px-4">
        <Reportes />
      </section>

      <section ref={section4Ref} className="min-h-screen flex justify-center items-center px-4">
        <Notas /> 
      </section>

    </div>
  );
}
