export default function ProductosModal({ items, total, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-4xl overflow-y-auto max-h-[90vh] shadow-lg">
        <h3 className="font-semibold mb-4 text-lg text-center">Productos</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-1 text-left">Producto</th>
                <th className="px-2 py-1 text-left">Cantidad</th>
                <th className="px-2 py-1 text-left">Precio Unitario</th>
                <th className="px-2 py-1 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t border-gray-200">
                  <td className="px-2 py-1">{item.product?.name}</td>
                  <td className="px-2 py-1">{item.quantity}</td>
                  <td className="px-2 py-1">{item.unit_price}</td>
                  <td className="px-2 py-1">{(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-semibold border-t border-gray-200">
                <td colSpan="3" className="text-right px-2 py-1">Total:</td>
                <td className="px-2 py-1">{total}</td>
              </tr>
            </tfoot>
          </table>
        </div>

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
