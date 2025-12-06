<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $titulo }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        th { background: #f0f0f0; }
        h2, h3 { margin-bottom: 5px; margin-top: 10px; }
        .total { font-weight: bold; }
    </style>
</head>
<body>
    <!-- DATOS GENERALES -->
    <h2>{{ $titulo }}</h2>
    <p><strong>Fecha:</strong> {{ $fecha }}</p>
    <h3>Resumen General</h3>
    <table>
        <tr>
            <th>Total Vendido</th>
            <th>Total Deuda</th>
        </tr>
        <tr>
            <td>{{ number_format($resumen_general['total_vendido'], 2) }}</td>
            <td>{{ number_format($resumen_general['total_deuda'], 2) }}</td>
        </tr>
    </table>
    @foreach($usuarios as $usuarioData)
        <h3>Usuario: {{ $usuarioData['usuario'] }}</h3>
        <p><strong>Total vendido:</strong> {{ number_format($usuarioData['total_vendido'], 2) }} | 
           <strong>Total deuda:</strong> {{ number_format($usuarioData['total_deuda'], 2) }}</p>

        @foreach($usuarioData['notas'] as $nota)
            <table>
                <tr>
                    <th>Nota</th>
                    <th>Cliente</th>
                    <th>Método Pago</th>
                    <th>Total Nota</th>
                    @if(isset($nota['pagado']))
                        <th>Pagado</th>
                        <th>Deuda</th>
                    @endif
                </tr>
                <tr>
                    <td>{{ $nota['nota'] }}</td>
                    <td>{{ $nota['cliente'] }}</td>
                    <td>{{ $nota['metodo_pago_nota'] }}</td>
                    <td>{{ number_format($nota['total_nota'], 2) }}</td>
                    @if(isset($nota['pagado']))
                        <td>{{ number_format($nota['pagado'], 2) }}</td>
                        <td>{{ number_format($nota['deuda'], 2) }}</td>
                    @endif
                </tr>
            </table>

            <!-- TABLA DE PRODUCTOS CON PRECIO UNITARIO -->
            <table>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
                @foreach($nota['items'] as $item)
                <tr>
                    <td>{{ $item['producto'] }}</td>
                    <td>{{ $item['cantidad'] }}</td>
                    <td>{{ number_format($item['precio_unitario'] ?? 0, 2) }}</td>
                    <td>{{ number_format($item['subtotal'], 2) }}</td>
                </tr>
                @endforeach
            </table>

            @if(isset($nota['pagos']) && count($nota['pagos']) > 0)
                <table>
                    <tr>
                        <th>Pagos</th>
                        <th>Monto</th>
                        <th>Método Pago</th>
                        <th>Fecha</th>
                    </tr>
                    @foreach($nota['pagos'] as $pago)
                    <tr>
                        <td></td>
                        <td>{{ number_format($pago['monto'], 2) }}</td>
                        <td>{{ $pago['metodo_pago'] }}</td>
                        <td>{{ $pago['fecha'] }}</td>
                    </tr>
                    @endforeach
                </table>
            @endif
        @endforeach
        <hr>
    @endforeach

</body>
</html>
