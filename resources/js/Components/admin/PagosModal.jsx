export default function PagosModal({ pagos, items, total, onClose, onAmortizar }) {
  const sortedPayments = [...pagos].sort(
    (a, b) => new Date(a.payment_date) - new Date(b.payment_date)
  );

  const lastPayment = sortedPayments[sortedPayments.length - 1];
  const hasDebt = !lastPayment || parseFloat(lastPayment.new_balance) > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] shadow-lg">
        <h3 className="font-semibold mb-4 text-lg text-center">Pagos / Deuda</h3>

        {/* Pagos */}
        <div className="overflow-x-auto mb-6">
          {sortedPayments.length > 0 ? (
            <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg mb-2">
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
            <p className="text-gray-500 mb-2">No hay pagos registrados.</p>
          )}

          {hasDebt && onAmortizar && (
            <button
              onClick={onAmortizar}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
            >
              Amortizar deuda
            </button>
          )}
        </div>

        {/* Productos */}
        {items && items.length > 0 && (
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-2">Productos vendidos</h4>
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
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
