import { useState, useEffect } from 'react';

export default function AmortizarModal({ open, onClose, onSave, saldoActual }) {
    const [amount, setAmount] = useState("");
    const [payment_method_id, setPaymentMethod] = useState("");
    const [notes, setNotes] = useState("");
    const [metodos, setMetodos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        fetch("/metodos/datos-form")
            .then(res => res.ok ? res.json() : Promise.reject("Error en backend"))
            .then(data => setMetodos(data.metodos || []))
            .catch(err => {
                console.error("Error al obtener métodos de pago:", err);
                setMetodos([]);
            });
    }, [open]);

    const handleSubmit = async () => {
        if (!amount) return alert("Ingrese un monto");
        if (amount > saldoActual) return alert("El monto no puede superar la deuda actual");
        if (!payment_method_id) return alert("Seleccione un método de pago");

        setLoading(true);

        try {
            await onSave({
                amount: parseFloat(amount),
                payment_method_id,
                notes
            });

            // Reset campos al guardar
            setAmount("");
            setPaymentMethod("");
            setNotes("");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            onClose(); // cerrar modal automáticamente
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-6 rounded w-96 space-y-4">
                <h2 className="text-xl font-bold">Amortizar deuda</h2>
                <p><strong>Saldo actual:</strong> Bs {saldoActual}</p>

                <input
                    type="number"
                    placeholder="Monto"
                    className="w-full border p-2 rounded"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />

                <select
                    className="w-full border p-2 rounded"
                    value={payment_method_id}
                    onChange={e => setPaymentMethod(e.target.value)}
                >
                    <option value="">Método de pago</option>
                    {metodos.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>

                <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Notas (opcional)"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button
                        className="bg-gray-400 px-4 py-2 text-white rounded"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>

                    <button
                        className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-600'}`}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Guardando...' : 'Guardar pago'}
                    </button>
                </div>
            </div>
        </div>
    );
}
