import React from "react";

export default function ProductoModal({ open, onClose, onSubmit, form, setForm, editProduct }) {
  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {editProduct ? "Editar Producto" : "Crear Producto"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            required
          />
          <input
            type="text"
            name="category_code"
            placeholder="Categoría"
            value={form.category_code}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            required
          />
          <input
            type="number"
            name="unit_price"
            placeholder="Precio"
            value={form.unit_price}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {editProduct ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
