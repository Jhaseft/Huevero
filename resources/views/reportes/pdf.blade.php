<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $titulo }}</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
        }

        th {
            background: #f0f0f0;
        }

        .header {
            width: 100%;
            margin-bottom: 10px;
        }

        .header td {
            border: none;
            padding: 4px;
            font-weight: bold;
            text-align: left;
        }

        .page-break {
            page-break-after: always;
        }

        tfoot td {
            font-weight: bold;
            background: #e0e0e0;
        }
    </style>
</head>
<body>

@foreach($usuarios as $usuarioData)

    <!-- ENCABEZADO HORIZONTAL -->
    <table class="header">
        <tr>
            <td>Fecha: {{ $fecha }}</td>
            <td>Rutero: {{ $usuarioData['usuario'] }}</td>
        </tr>
    </table>

    <!-- TABLA DINÁMICA -->
    <table>
        <thead>
            <tr>
                <th>N°</th>
                <th>Cliente</th>
                <th>N° Nota</th>

                <!-- COLUMNAS DE PRODUCTOS -->
                @foreach($productos as $producto)
                    <th>{{ $producto }}</th>
                @endforeach

                <!-- MÉTODOS DE PAGO -->
                @foreach($metodos_pago as $metodo)
                    <th>{{ $metodo }}</th>
                @endforeach

                <!-- COLUMNA DE DEUDA -->
                <th>Deuda</th>
            </tr>
        </thead>

        <tbody>
            @php
                $contador = 1;

                // Inicializar totales
                $totalesProductos = array_fill_keys($productos->toArray(), 0);
                $totalesPagos = array_fill_keys($metodos_pago->toArray(), 0);
                $totalDeuda = 0;
            @endphp

            @foreach($usuarioData['notas'] as $nota)
                <tr>
                    <td>{{ $contador }}</td>
                    <td>{{ $nota['cliente'] }}</td>
                    <td>{{ $nota['nota'] }}</td>

                    <!-- PRODUCTOS -->
                    @foreach($productos as $producto)
                        @php
                            $valor = $nota['productos'][$producto] ?? 0;
                            $totalesProductos[$producto] += $valor;
                        @endphp
                        <td>{{ $valor }}</td>
                    @endforeach

                    <!-- MÉTODOS DE PAGO -->
                    @foreach($metodos_pago as $metodo)
                        @php
                            $valorPago = $nota['metodos_pago'][$metodo] ?? 0;
                            $totalesPagos[$metodo] += $valorPago;
                        @endphp
                        <td>{{ $valorPago }}</td>
                    @endforeach

                    <!-- DEUDA -->
                    @php $totalDeuda += $nota['deuda'] ?? 0; @endphp
                    <td>{{ $nota['deuda'] ?? 0 }}</td>
                </tr>
                @php $contador++; @endphp
            @endforeach
        </tbody>

        <tfoot>
            <tr>
                <td colspan="3">Totales</td>

                <!-- Totales productos -->
                @foreach($totalesProductos as $total)
                    <td>{{ $total }}</td>
                @endforeach

                <!-- Totales métodos de pago -->
                @foreach($totalesPagos as $total)
                    <td>{{ $total }}</td>
                @endforeach

                <!-- Total deuda -->
                <td>{{ $totalDeuda }}</td>
            </tr>
        </tfoot>
    </table>

    @if(!$loop->last)
        <div class="page-break"></div>
    @endif

@endforeach

</body>
</html>
