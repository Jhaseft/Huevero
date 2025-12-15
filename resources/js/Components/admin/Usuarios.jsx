import { useEffect, useState } from "react"; 
import { Link } from '@inertiajs/react';

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

  const fetchUsers = (page = 1, searchTerm = "") => {
    setLoading(true);
    fetch(`/admin/usuarios?search=${encodeURIComponent(searchTerm)}&page=${page}`, {
      headers: { "Accept": "application/json", "X-CSRF-TOKEN": csrfToken },
      credentials: "same-origin",
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.data);
        setPage(data.current_page);
        setLastPage(data.last_page);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handleUpdate = async () => {
  try {
    const res = await fetch(`/admin/usuarios/${editUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",  
        "Accept": "application/json",
        "X-CSRF-TOKEN": csrfToken,           
      },
      credentials: "same-origin",            
      body: JSON.stringify(editUser),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    setUsers(users.map(u => (u.id === data.id ? data : u)));
    setEditUser(null);
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
  }
};


  const toggleActive = (id) => {
  fetch(`/admin/usuarios/${id}/toggle`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-CSRF-TOKEN": csrfToken
    },
    credentials: "same-origin", 
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.json();
    })
    .then(data => setUsers(users.map(u => u.id === id ? {...u, active: data.active} : u)))
    .catch(err => console.error(err));
};

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Gestión de Ruteros</h2>
      <p className="text-gray-600 mb-6">Aquí podrás ver, editar y activar/desactivar usuarios.</p>

      <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
        <Link 
          href="/register" 
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow transition"
        >
          Crear Usuario
        </Link>

        <form onSubmit={handleSearch} className="flex gap-2 flex-1 md:flex-none">
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
          >
            Buscar
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-center py-4 text-gray-500">Cargando usuarios...</p>
      ) : (
        <>
          {editUser && (
            <div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
              <h3 className="font-bold mb-3 text-lg">Editar Usuario: {editUser.name}</h3>
              <div className="flex flex-col md:flex-row md:gap-4 mb-3">
                <input type="text" placeholder="Nombre" className="border rounded-lg px-3 py-2 w-full md:w-auto mb-2 md:mb-0"
                       value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})}/>
                <input type="email" placeholder="Email" className="border rounded-lg px-3 py-2 w-full md:w-auto mb-2 md:mb-0"
                       value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})}/>
                <input type="password" placeholder="Nueva Contraseña" className="border rounded-lg px-3 py-2 w-full md:w-auto"
                       onChange={e => setEditUser({...editUser, password: e.target.value})}/>
              </div>
              <div className="flex gap-2">
                <button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow">
                  Guardar
                </button>
                <button onClick={() => setEditUser(null)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg shadow">
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">ID</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Nombre</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Email</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Activo</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-2">{u.id}</td>
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.active ? "Sí" : "No"}</td>
                    <td className="px-4 py-2 flex flex-wrap gap-2">
                      <button 
                        onClick={() => setEditUser(u)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow transition"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => toggleActive(u.id)} 
                        className={`px-3 py-1 rounded-lg shadow text-white transition ${u.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                      >
                        {u.active ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
            <button 
              disabled={page <= 1} 
              onClick={() => fetchUsers(page - 1, search)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2 border rounded-lg">{page}</span>
            <button 
              disabled={page >= lastPage} 
              onClick={() => fetchUsers(page + 1, search)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
