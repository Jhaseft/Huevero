import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Modal from '../Components/Distribuidor/ModalGenerico.jsx';
import ProductosTable from '../Components/Distribuidor/ProductosTable.jsx';
import AmortizacionTable from '../Components/Distribuidor/AmortizacionTable.jsx';
import CrearNotaForm from '../Components/Distribuidor/CrearNotaForm.jsx';
import AmortizarModal from '../Components/Distribuidor/AmortizarModal.jsx';

export default function Dashboard() {
    const [notas, setNotas] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState({ open: false, content: null, title: '' });
    const [amortizarOpen, setAmortizarOpen] = useState(false);
    const [selectedNota, setSelectedNota] = useState(null);

    const getSaldoActual = (nota) => {
        if (!nota.payments || nota.payments.length === 0) return parseFloat(nota.total);
        const lastPayment = nota.payments[nota.payments.length - 1];
        return parseFloat(lastPayment.new_balance);
    };

    const handleGuardarAmortizacion = async (data) => {
        const saldoActual = getSaldoActual(selectedNota);
        const previous_balance = saldoActual;
        const new_balance = previous_balance - parseFloat(data.amount);

        const payload = {
            sales_note_id: selectedNota.id,
            amount: parseFloat(data.amount),
            previous_balance,
            new_balance,
            payment_date: new Date().toISOString().slice(0, 10),
            payment_type: "credito",
            payment_method_id: data.payment_method_id,
            notes: data.notes || ""
        };

        const res = await fetch("/payments/store", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",  
                "Accept": "application/json",        
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content, 
            },
            credentials: "same-origin",           
            body: JSON.stringify(payload),
        });

        const nuevoPago = await res.json();
        setNotas(notas.map(n => n.id === selectedNota.id ? { ...n, payments: [...n.payments, nuevoPago] } : n));
        setAmortizarOpen(false);
        setModalData(false);

        fetch('/notas')
            .then(res => res.json())
            .then(data => setNotas(data.notas))
            .catch(err => console.error("Error recargando notas:", err));
    };

    useEffect(() => {
        fetch('/notas')
            .then(res => res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`))
            .then(data => {
                setUser(data.user);
                setNotas(data.notas);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching notas:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const recargar = () => {
            fetch('/notas')
                .then(res => res.json())
                .then(data => setNotas(data.notas));
        };
        window.addEventListener("notaCreada", recargar);
        return () => window.removeEventListener("notaCreada", recargar);
    }, []);

    const openModal = (nota) => {
        if (nota.payment_method.name === 'credito') {
            setModalData({
                open: true,
                title: `Amortización - Nota ${nota.note_number}`,
                content: (
                    <AmortizacionTable
                        payments={nota.payments}
                        items={nota.items}
                        total={nota.total}
                        onAmortizar={() => {
                            setSelectedNota(nota);
                            setAmortizarOpen(true);
                        }}
                    />
                )
            });
        } else {
            setModalData({
                open: true,
                title: `Productos Vendidos - Nota ${nota.note_number}`,
                content: <ProductosTable items={nota.items} total={nota.total} />
            });
        }
    };
    const closeModal = () => setModalData({ open: false, content: null, title: '' });

    return (
        <div className="container mx-auto p-6">
            <Head title="Dashboard" />

            {user && (
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white shadow p-4 rounded-lg">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Bienvenido, {user.name}</h1>
                        <p className="text-gray-600 mt-1">Estas son tus notas de venta recientes</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                setModalData({
                                    open: true,
                                    content: <CrearNotaForm onClose={() => setModalData({ open: false })} />
                                })
                            }
                            className="bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
                        >
                            Crear Nota
                        </button>
                        <Link
                            href="/logout"
                            method="post"
                            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-gray-600">Cargando notas...</p>
            ) : (
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Número de Nota</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Método de Pago</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {notas.length > 0 ? notas.map(nota => (
                                <tr key={nota.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-4 py-3 text-sm text-gray-700">{nota.note_number}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{nota.client?.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{nota.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{nota.total}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{nota.payment_method.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 flex gap-2">
                                        <button
                                            onClick={() => openModal(nota)}
                                            className={nota.payment_method.name === 'credito'
                                                ? "bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                                                : "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                                            }
                                        >
                                            {nota.payment_method.name === 'credito' ? 'Amortización' : 'Ver Productos'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-3 text-center text-gray-500">No tienes notas aún</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal open={modalData.open} onClose={closeModal} title={modalData.title}>
                {modalData.content}
            </Modal>
            {selectedNota && (
                <AmortizarModal
                    open={amortizarOpen}
                    onClose={() => setAmortizarOpen(false)}
                    onSave={handleGuardarAmortizacion}
                    saldoActual={getSaldoActual(selectedNota)}
                />
            )}
        </div>
    );
}
