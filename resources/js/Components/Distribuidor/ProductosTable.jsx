// Componente para ver productos de la nota
export default function ProductosTable({ items, total }) {
    return (
        <table className="w-full text-sm text-gray-700 border border-gray-200">
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
                    <tr key={item.id}>
                        <td className="px-2 py-1">{item.product?.name}</td>
                        <td className="px-2 py-1">{item.quantity}</td>
                        <td className="px-2 py-1">{item.unit_price}</td>
                        <td className="px-2 py-1">{(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="font-semibold">
                    <td colSpan="3" className="px-2 py-1 text-right">Total:</td>
                    <td className="px-2 py-1">{total}</td>
                </tr>
            </tfoot>
        </table>
    );
}