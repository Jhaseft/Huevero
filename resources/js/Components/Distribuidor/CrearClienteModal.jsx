import { useState } from "react";
export default function CrearClienteModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: ""
    });

    const guardar = () => {
        if (!form.name.trim()) {
            alert("El nombre es obligatorio");
            return;
        }

        onSave(form); // Llama al método del padre
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 space-y-4">

                <h2 className="text-xl font-bold">Crear Cliente</h2>

                <div>
                    <label className="font-semibold">Nombre</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>

                <div>
                    <label className="font-semibold">Teléfono</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="font-semibold">Dirección</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-400 text-white rounded"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={guardar}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}
