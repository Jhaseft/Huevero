import { useState, useEffect } from "react";
import NotaModal from "./NotaModal"; // Modal combinado

export default function Notas() {
  const [notas, setNotas] = useState([]);
  const [notaSelected, setNotaSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  const fetchNotas = async (pageNumber = 1, searchTerm = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/admin/notas?search=${encodeURIComponent(searchTerm)}&page=${pageNumber}`,
        {
          headers: { "Accept": "application/json", "X-CSRF-TOKEN": csrfToken },
        },
        { credentials: "same-origin",

        }
      );
      const data = await res.json();
      setNotas(data.data);           // Laravel paginator: data
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
        { credentials: "same-origin",
            
        }
    );
      setNotas(notas.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotas(1, search);
  };

  useEffect(() => {
    fetchNotas(page, search);
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow w-full max-w-full overflow-x-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        Notas
      </h1>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por ID, cliente o usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1 min-w-[200px]"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          Buscar
        </button>
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
                {notas.map((nota) => (
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
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

      {/* Modal combinado */}
      {notaSelected && (
        <NotaModal nota={notaSelected} onClose={() => setNotaSelected(null)} />
      )}
    </div>
  );
}
