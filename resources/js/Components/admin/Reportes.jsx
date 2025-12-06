import { useState } from "react";

export default function Reportes() {
  const [tipo, setTipo] = useState("diario");
  const [fecha, setFecha] = useState("");

  const generarPDF = () => {
    if (!fecha) {
      alert("Selecciona una fecha primero");
      return;
    }

    const url = `/admin/reportes/${tipo}/pdf?date=${fecha}`;

    window.open(url, "_blank"); // 🔥 descarga directa
  };

  return (
    <div className="w-full max-w-6xl bg-white p-8 rounded-2xl shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reportes</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Tipo de reporte
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded-lg p-2 text-gray-700"
          >
            <option value="diario">Diario</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Seleccionar fecha
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border rounded-lg p-2 text-gray-700"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={generarPDF}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
