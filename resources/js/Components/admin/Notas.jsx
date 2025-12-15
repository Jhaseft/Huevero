import { useState, useEffect } from "react";
import NotaModal from "./NotaModal"; // Modal combinado

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [notaSelected, setNotaSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  const fetchNotas = async (pageNumber = 1, searchTerm = "", start = "", end = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (start) params.append("start_date", start);
      if (end) params.append("end_date", end);
      params.append("page", pageNumber);

      const res = await fetch(`/admin/notas?${params.toString()}`, {
        headers: { "Accept": "application/json", "X-CSRF-TOKEN": csrfToken },
      });
      const data = await res.json();
      console.log("notas", data);
      setNotas(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const openModal = (nota) => setNotaSelected(nota);

  const eliminarNota = async (id) => {
    if (!confirm("¿Deseas eliminar esta nota?")) return;
    try {
      await fetch(`/admin/notas/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-TOKEN": csrfToken },
      },
        {
          credentials: "same-origin",

        }
      );
      setNotas(notas.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotas(1, search, startDate, endDate);
  };
  useEffect(() => {
    fetchNotas(page, search);
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        Notas
      </h1>


      <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end mb-4">

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Buscar</label>
          <input
            type="text"
            placeholder="ID, cliente o usuario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>


        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Fecha inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>


        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium mb-1">Fecha fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg w-full sm:w-auto">
            Buscar
          </button>
        </div>
      </form>


      {loading ? (
        <p className="text-center py-4 text-gray-500">Cargando notas...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">Usuario</th>
                  <th className="p-2 border">Cliente</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Método de Pago</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {notas?.length > 0 ? (
                  notas.map((nota) => (
                    <tr key={nota.id} className="text-center hover:bg-gray-50">
                      <td className="p-2 border">{nota.note_number}</td>
                      <td className="p-2 border">{nota.client.user.name}</td>
                      <td className="p-2 border">{nota.client.name}</td>
                      <td className="p-2 border">{nota.date}</td>
                      <td className="p-2 border">{nota.total}</td>
                      <td className="p-2 border">{nota.payment_method.name}</td>
                      <td className="p-2 border flex flex-col sm:flex-row justify-center gap-2">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition w-full sm:w-auto"
                          onClick={() => openModal(nota)}
                        >
                          {nota.payment_method.type === "credito"
                            ? "Ver Productos / Deuda"
                            : "Ver Productos"}
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm hover:bg-red-600 transition w-full sm:w-auto"
                          onClick={() => eliminarNota(nota.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (<tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No hay notas disponibles
                  </td>
                </tr>
                )}
              </tbody>
            </table>
          </div>


          <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
            <button
              disabled={page <= 1}
              onClick={() => fetchNotas(page - 1, search)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 border rounded-lg">{page}</span>
            <button
              disabled={page >= lastPage}
              onClick={() => fetchNotas(page + 1, search)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {notaSelected && (
        <NotaModal nota={notaSelected} onClose={() => setNotaSelected(null)} />
      )}
    </div>
  );
}
