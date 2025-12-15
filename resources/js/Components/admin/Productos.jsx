import { useEffect, useState } from "react";
import ProductoModal from "./ProductoModal";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", category_code: "", unit_price: "" });
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  const fetchProducts = async (page = 1, searchTerm = "") => {
  setLoading(true);
  try {
    const res = await fetch(
      `/admin/productos?search=${encodeURIComponent(searchTerm)}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-CSRF-TOKEN": csrfToken, 
        },
        credentials: "same-origin", 
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    setProducts(data.data);
    setPage(data.current_page);
    setLastPage(data.last_page);
  } catch (err) {
    console.error("Error al obtener productos:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(1, search);
  };

  const openCreateModal = () => {
    setEditProduct(null);
    setForm({ name: "", category_code: "", unit_price: "" });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      category_code: product.category_code,
      unit_price: product.unit_price,
    });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    const url = editProduct ? `/admin/productos/${editProduct.id}` : "/admin/productos";
    const method = editProduct ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRF-TOKEN": csrfToken,
      },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(() => {
        fetchProducts(page, search);
        setModalOpen(false);
        setForm({ name: "", category_code: "", unit_price: "" });
        setEditProduct(null);
      })
      .catch(err => console.error(err));
  };

  const toggleActive = async (id) => {
  try {
    const res = await fetch(`/admin/productos/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
        "X-CSRF-TOKEN": csrfToken,          
      },
      credentials: "same-origin",          
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    setProducts(products.map(p => (p.id === id ? { ...p, active: data.active } : p)));
  } catch (err) {
    console.error("Error al cambiar estado del producto:", err);
  }
};


  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">Gestión de Productos</h2>
      <p className="text-gray-600 mb-6">Aquí puedes crear, editar y activar/desactivar productos.</p>

      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 sm:gap-0">
        <button
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg w-full sm:w-auto"
        >
          Crear Producto
        </button>

        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Buscar producto"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full sm:w-auto"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center py-4 text-gray-500">Cargando productos...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm sm:text-base">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-3 sm:px-4 py-2 border">ID</th>
                <th className="px-3 sm:px-4 py-2 border">Tamaño</th>
                <th className="px-3 sm:px-4 py-2 border">Categoría</th>
                <th className="px-3 sm:px-4 py-2 border">Precio</th>
                <th className="px-3 sm:px-4 py-2 border">Estado</th>
                <th className="px-3 sm:px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(p => (
                <tr key={p.id} className={p.active ? "" : "bg-gray-200"}>
                  <td className="px-2 sm:px-4 py-2 border">{p.id}</td>
                  <td className="px-2 sm:px-4 py-2 border">{p.name}</td>
                  <td className="px-2 sm:px-4 py-2 border">{p.category_code}</td>
                  <td className="px-2 sm:px-4 py-2 border">{p.unit_price}</td>
                  <td className="px-2 sm:px-4 py-2 border">{p.active ? "Activo" : "Desactivado"}</td>
                  <td className="px-2 sm:px-4 py-2 border flex flex-col sm:flex-row gap-2 sm:gap-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg w-full sm:w-auto"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleActive(p.id)}
                      className={`px-3 py-1 rounded-lg text-white w-full sm:w-auto ${
                        p.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {p.active ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center items-center mt-4 gap-2 flex-wrap">
            <button
              disabled={page <= 1}
              onClick={() => fetchProducts(page - 1, search)}
              className="px-3 py-1 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 border rounded-lg">{page}</span>
            <button
              disabled={page >= lastPage}
              onClick={() => fetchProducts(page + 1, search)}
              className="px-3 py-1 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <ProductoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editProduct={editProduct}
      />
    </div>
  );
}
