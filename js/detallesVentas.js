function cargarConfiguracion() {
    const params = new URLSearchParams(window.location.search)
    const id = parseInt(params.get('id'))
    if (!id) return

    const token = localStorage.getItem('token')

    Promise.all([
        fetch(APIURL + '/api/Ventas', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json()),
        fetch(APIURL + '/api/Libros', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json()),
        fetch(APIURL + '/api/Ingresos', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json())
    ]).then(([ventas, libros, ingresos]) => {
        const venta = ventas.find(v => v.id === id)
        if (!venta) {
            document.getElementById('ventaTitulo').textContent = 'Venta no encontrada'
            return
        }

        document.getElementById('ventaTitulo').textContent = 'Venta ' + (venta.numeroRecibo ?? venta.numeroComprobante)
        document.getElementById('clienteNombre').textContent = venta.clienteNombre ?? '-'
        document.getElementById('ventaFecha').textContent = venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '-'
        document.getElementById('numeroComprobante').textContent = venta.numeroComprobante ?? '-'
        document.getElementById('observaciones').textContent = venta.observaciones ?? '-'
        document.getElementById('ventaTotal').textContent = 'TOTAL: $' + (venta.total?.toLocaleString() ?? '0')

        // Cargar items desde localStorage
        const ventasGuardadas = JSON.parse(localStorage.getItem('ventasItems') || '{}')
        const itemsVenta = ventasGuardadas[id]
        const tbody = document.getElementById('tablaItems')

        if (itemsVenta && itemsVenta.length > 0) {
            tbody.innerHTML = ''
            itemsVenta.forEach(i => {
                const libro = libros.find(l => l.id === i.libroId)
                const nombre = i.libroNombre ?? libro?.nombre ?? 'Libro ' + i.libroId

                // Buscar el ingreso más reciente para ese libro y lote
                const ingresosLibro = ingresos
                    .filter(ing => ing.id === i.libroId && ing.codigoLote === i.lote)
                    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                const ultimoIngreso = ingresosLibro[0]
                const precioUnit = ultimoIngreso?.valorVentaPublico ?? 0
                const subtotal = precioUnit * i.cantidad

                tbody.innerHTML += `
                    <tr>
                        <td>${nombre}</td>
                        <td>${i.lote}</td>
                        <td>${i.cantidad}</td>
                        <td>$${precioUnit.toLocaleString()}</td>
                        <td>$${subtotal.toLocaleString()}</td>
                    </tr>`
            })
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#999;">Sin detalle de items disponible</td></tr>'
        }
    })
    .catch(err => console.error('Error detalle venta:', err))
}