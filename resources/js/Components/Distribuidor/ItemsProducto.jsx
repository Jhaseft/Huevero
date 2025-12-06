import React from "react";

export default function ItemsProducto({ productos, items, setItems }) {

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

    const getPrecio = (product_id) => {
        const p = productos.find(p => p.id == product_id);
        return p ? Number(p.unit_price) : 0;
    };

    return (
        <div>
            <label className="font-semibold">Productos</label>

            {items.map((item, i) => {
                const precio = getPrecio(item.product_id);
                const subtotal = precio * item.quantity;

                return (
                    <div key={i} className="flex flex-col gap-1 p-2 mb-2 border rounded-lg bg-gray-50">

                        {/* FILA PRINCIPAL */}
                        <div className="flex gap-2">

                            {/* SELECT PRODUCTO */}
                            <select
                                className="border p-2 rounded w-1/2"
                                value={item.product_id}
                                onChange={e => updateItem(i, "product_id", e.target.value)}
                            >
                                <option value="">Producto...</option>
                                {productos
                                    .filter(p => p.active == 1)
                                    .map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                            </select>

                            {/* CANTIDAD */}
                            <input
                                type="number"
                                min="1"
                                className="border p-2 rounded w-1/4"
                                value={item.quantity}
                                onChange={e => updateItem(i, "quantity", e.target.value)}
                            />

                            {/* ELIMINAR */}
                            <button
                                className="bg-red-500 text-white px-2 rounded"
                                onClick={() => removeItem(i)}
                            >
                                X
                            </button>
                        </div>

                        {/* PRECIOS */}
                        {item.product_id && (
                            <div className="flex justify-between text-sm text-gray-600 px-1">
                                <span>Precio: <b>Bs {precio}</b></span>
                                <span>Subtotal: <b>Bs {subtotal}</b></span>
                            </div>
                        )}

                    </div>
                );
            })}

            <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={addItem}
            >
                + Agregar Producto
            </button>
        </div>
    );
}
