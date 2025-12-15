import { useState, useEffect } from "react";
import CrearClienteModal from "./CrearClienteModal.jsx";

export default function CrearNotaForm({ onClose }) {

    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [metodos, setMetodos] = useState([]);
    const [items, setItems] = useState([]);

    const [fechaHoy, setFechaHoy] = useState("");

    const [form, setForm] = useState({
        client_id: "",
        note_number: "",
        date: "",
        payment_method_id: "",
        total: 0
    });

    const [formaPago, setFormaPago] = useState(""); // contado | credito
    const [loading, setLoading] = useState(false);
    const [crearClienteOpen, setCrearClienteOpen] = useState(false);
    const formasPago = [
        ...new Map(metodos.map(m => [m.type, m.type])).values()
    ];

    const getMetodoCreditoId = () => {
        const credito = metodos.find(m => m.type === "credito");
        return credito ? credito.id : "";
    };

    useEffect(() => {
        fetch("/notas/datos-form")
            .then(res => res.json())
            .then(data => {
                setClientes(data.clientes);
                setProductos(data.productos);
                setMetodos(data.metodos);
                setFechaHoy(data.hoy);
                setForm(f => ({ ...f, date: data.hoy }));
            });
    }, []);

    const crearCliente = async (nuevoCliente) => {
        const res = await fetch("/clientes/store", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify(nuevoCliente),
        });

        const c = await res.json();
        setClientes(prev => [...prev, c]);
        setForm(prev => ({ ...prev, client_id: c.id }));
        setCrearClienteOpen(false);
    };

    const agregarItem = () => {
        setItems([...items, { product_id: "", quantity: 1 }]);
    };

    const eliminarItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calcularTotal = () => {
        return items.reduce((sum, i) => {
            const p = productos.find(p => p.id == i.product_id);
            return p ? sum + (p.unit_price * i.quantity) : sum;
        }, 0);
    };

    const guardarNota = async () => {
        setLoading(true);

        const payload = {
            ...form,
            total: calcularTotal(),
            items,
            payment_method_id: form.payment_method_id,
        };

        await fetch("/notas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify(payload),
        });

        onClose();
        window.dispatchEvent(new Event("notaCreada"));
        setLoading(false);
    };

    return (
        <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto">


            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Nota de Venta</h2>
                <span className="text-sm text-gray-600">
                    Fecha de hoy: {fechaHoy}
                </span>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        >+</button>
                    </div>
                </div>

                <div>
                    <label className="font-semibold">N° Nota de Venta</label>
                    <input
                        className="w-full border p-2 rounded"
                        value={form.note_number}
                        onChange={e => setForm({ ...form, note_number: e.target.value })}
                    />
                </div>

                <div>
                    <label className="font-semibold">Fecha de la Nota</label>
                    <input
                        type="date"
                        className="w-full border p-2 rounded"
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <h3 className="font-semibold">Productos</h3>
                    <button onClick={agregarItem} className="bg-blue-500 text-white px-3 py-1 rounded">
                        + Agregar
                    </button>
                </div>

                <table className="w-full border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, i) => {
                            const p = productos.find(p => p.id == item.product_id);
                            return (
                                <tr key={i}>
                                    <td className="text-center">
                                        <select
                                            className="border-black p-1 pr-10"
                                            value={item.product_id}
                                            onChange={e => {
                                                const n = [...items];
                                                n[i].product_id = e.target.value;
                                                setItems(n);
                                            }}
                                        >
                                            <option value="">Seleccione</option>
                                            {productos.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <input
                                            type="number"
                                            className=" text-center p-1 w-20"
                                            value={item.quantity}
                                            onChange={e => {
                                                const n = [...items];
                                                n[i].quantity = e.target.value;
                                                setItems(n);
                                            }}
                                        />
                                    </td>
                                    <td className="text-center">{p?.unit_price || 0}</td>
                                    <td className="text-center">{p ? p.unit_price * item.quantity : 0}</td>
                                    <td className="text-center">
                                        <button onClick={() => eliminarItem(i)} className="text-red-500">
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="text-right font-bold text-lg">
                Total: Bs {calcularTotal()}
            </div>

            <div>
                <label className="font-semibold">Forma de Pago</label>
                <select
                    className="w-full border p-2 rounded"
                    value={formaPago}
                    onChange={e => {
                        const value = e.target.value;
                        setFormaPago(value);

                        if (value === "credito") {
                            setForm({
                                ...form,
                                payment_method_id: getMetodoCreditoId(), // ← ID 4
                            });
                        } else {
                            setForm({
                                ...form,
                                payment_method_id: "",
                            });
                        }
                    }}
                >
                    <option value="">Seleccione...</option>
                    {formasPago.map(type => (
                        <option key={type} value={type}>
                            {type === "contado" ? "Al contado" : "Crédito"}
                        </option>
                    ))}
                </select>
            </div>

            {formaPago === "contado" && (
                <div>
                    <label className="font-semibold">Método de Pago</label>
                    <select
                        className="w-full border p-2 rounded"
                        value={form.payment_method_id}
                        onChange={e =>
                            setForm({ ...form, payment_method_id: e.target.value })
                        }
                    >
                        <option value="">Seleccione...</option>
                        {metodos
                            .filter(m => m.type === "contado")
                            .map(m => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                    </select>
                </div>
            )}

            <div className="flex justify-end gap-3">
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
                    Cancelar
                </button>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
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
