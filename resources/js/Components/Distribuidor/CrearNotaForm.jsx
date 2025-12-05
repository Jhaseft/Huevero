import { useState, useEffect } from "react";
import CrearClienteModal from "./CrearClienteModal.jsx";

export default function CrearNotaForm({ onClose }) {
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [metodos, setMetodos] = useState([]);
    const [items, setItems] = useState([]);

    const [form, setForm] = useState({
        client_id: "",
        payment_method_id: "",
        date: "",
        note_number: "",
        total: 0
    });

    const [loading, setLoading] = useState(false);

    // Modales internos
    const [crearClienteOpen, setCrearClienteOpen] = useState(false);


    useEffect(() => {
        fetch("/notas/datos-form")
            .then(res => res.json())
            .then(data => {
                console.log("JSON recibido de backend:", data);

                setClientes(data.clientes);
                setProductos(data.productos);
                setMetodos(data.metodos);

                setForm(f => ({
                    ...f,
                    date: data.hoy
                }));
            });
    }, []);

    // Agregar item
    const addItem = () => {
        setItems([...items, { product_id: "", quantity: 1 }]);
    };

    const updateItem = (index, key, value) => {
        const updated = [...items];
        updated[index][key] = value;
        setItems(updated);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

   const crearCliente = (nuevoCliente) => {
        // incluir token CSRF por si usas Laravel y estás en sesión
        const tokenMeta = document.querySelector('meta[name="csrf-token"]');
        const headers = { "Content-Type": "application/json" };
        if (tokenMeta) headers["X-CSRF-TOKEN"] = tokenMeta.content;

        fetch("/clientes/store", {
            method: "POST",
            headers,
            body: JSON.stringify(nuevoCliente)
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error("Error creando cliente: " + text);
                }
                return res.json();
            })
            .then(c => {
                setClientes(prev => [...prev, c]);
                setForm(prev => ({ ...prev, client_id: c.id }));
                setCrearClienteOpen(false);
            })
            .catch(err => {
                console.error(err);
                alert("No se pudo crear el cliente.");
            });
    };

    const guardarNota = async () => {
    try {
        setLoading(true);

        const total = items.reduce((sum, i) => {
            const p = productos.find(p => p.id == i.product_id);
            return sum + (p.unit_price * i.quantity);
        }, 0);

        const payload = {
            ...form,
            total,
            items,
        };

        console.log("Payload enviado:", payload);

        const res = await fetch("/notas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Error al guardar la nota");
        }

        const nuevaNota = await res.json(); // <-- Backend devuelve la nota creada
        console.log("Nota creada:", nuevaNota);

        // Cerrar modal
        onClose();

        // 🔄 Recargar automáticamente las notas en el Dashboard
        window.dispatchEvent(new Event("notaCreada"));

    } catch (e) {
        console.error(e);
        alert("Hubo un error al guardar la nota.");
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="p-4 space-y-4">

            {/* CLIENTE */}
            <div>
                <label className="font-semibold">Cliente</label>
                <div className="flex gap-2">
                    <select
                        className="w-full border p-2 rounded"
                        value={form.client_id}
                        onChange={e => setForm({ ...form, client_id: e.target.value })}
                    >
                        <option value="">Seleccione...</option>
                        {clientes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <button
                        className="bg-green-500 text-white px-3 rounded"
                        onClick={() => setCrearClienteOpen(true)}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* MÉTODO DE PAGO */}
            <div>
                <label className="font-semibold">Método de Pago</label>
                <select
                    className="w-full border p-2 rounded"
                    value={form.payment_method_id}
                    onChange={e => setForm({ ...form, payment_method_id: e.target.value })}
                >
                    <option value="">Seleccione...</option>
                    {metodos.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
            </div>

            {/* CÓDIGO DE NOTA */}
            <div>
                <label className="font-semibold">Código de Nota</label>
                <input
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Ej: 33098"
                    value={form.note_number}
                    onChange={e => setForm({ ...form, note_number: e.target.value })}
                />
            </div>

            {/* FECHA */}
            <div>
                <label className="font-semibold">Fecha</label>
                <input
                    type="date"
                    className="w-full border p-2 rounded"
                    value={form.date}
                    readOnly
                />
            </div>

            {/* ITEMS */}
            <div>
                <label className="font-semibold">Productos</label>

                {items.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <select
                            className="border p-2 rounded w-2/3"
                            value={item.product_id}
                            onChange={e => updateItem(i, "product_id", e.target.value)}
                        >
                            <option value="">Producto...</option>
                            {productos.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            className="border p-2 rounded w-1/3"
                            value={item.quantity}
                            onChange={e => updateItem(i, "quantity", e.target.value)}
                        />

                        <button
                            className="bg-red-500 text-white px-2 rounded"
                            onClick={() => removeItem(i)}
                        >
                            X
                        </button>
                    </div>
                ))}

                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={addItem}
                >
                    + Agregar Producto
                </button>
            </div>

            {/* BOTONES */}
            <div className="flex justify-end gap-3 mt-6">
                <button
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                    onClick={onClose}
                >
                    Cancelar
                </button>

                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={guardarNota}
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Crear Nota"}
                </button>
            </div>

             {crearClienteOpen && (
            <CrearClienteModal
                onClose={() => setCrearClienteOpen(false)}
                onSave={crearCliente}
            />
        )}
        </div>
    );
}
