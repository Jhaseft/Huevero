export default function AmortizacionTable({ payments, items, total, onAmortizar }) {
    // Ordenamos los pagos por fecha ascendente
    const sortedPayments = [...payments].sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date));

    // Verificar si hay deuda pendiente
    const lastPayment = sortedPayments[sortedPayments.length - 1];

    // Si no hay pagos o el último saldo nuevo > 0, hay deuda pendiente
    const hasDebt = !lastPayment || parseFloat(lastPayment.new_balance) > 0;

    return (
        <div className=" space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Pagos realizados */}
            <div className="overflow-x-auto">
                <h4 className="text-lg font-semibold mb-2">Pagos realizados</h4>
                {sortedPayments.length > 0 ? (
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left">Fecha</th>
                                <th className="px-3 py-2 text-left">Monto</th>
                                <th className="px-3 py-2 text-left">Saldo Anterior</th>
                                <th className="px-3 py-2 text-left">Saldo Nuevo</th>
                                <th className="px-3 py-2 text-left">Método</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPayments.map(p => (
                                <tr key={p.id} className="border-t border-gray-200">
                                    <td className="px-3 py-1">{p.payment_date}</td>
                                    <td className="px-3 py-1">{p.amount}</td>
                                    <td className="px-3 py-1">{p.previous_balance}</td>
                                    <td className="px-3 py-1">{p.new_balance}</td>
                                    <td className="px-3 py-1">{p.payment_method?.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No hay pagos registrados.</p>
                )}

                {/* Botón amortizar deuda */}
                {hasDebt && (
                    <div className="mt-3">
                        <button
                            onClick={onAmortizar}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
                        >
                            Amortizar deuda
                        </button>
                    </div>
                )}
            </div>

            {/* Productos de la nota */}
            <div className="overflow-x-auto">
                <h4 className="text-lg font-semibold mb-2">Productos vendidos</h4>
                {items.length > 0 ? (
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-3 py-2 text-left">Producto</th>
                                <th className="px-3 py-2 text-left">Cantidad</th>
                                <th className="px-3 py-2 text-left">Precio Unitario</th>
                                <th className="px-3 py-2 text-left">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id} className="border-t border-gray-200">
                                    <td className="px-3 py-1">{item.product?.name}</td>
                                    <td className="px-3 py-1">{item.quantity}</td>
                                    <td className="px-3 py-1">{item.unit_price}</td>
                                    <td className="px-3 py-1">{(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold border-t border-gray-200">
                                <td colSpan="3" className="px-3 py-2 text-right">Total:</td>
                                <td className="px-3 py-2">{total}</td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <p className="text-gray-500">No hay productos registrados.</p>
                )}
            </div>
        </div>
    );
}
