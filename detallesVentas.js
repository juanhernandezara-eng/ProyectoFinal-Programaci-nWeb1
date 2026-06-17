function cargarConfiguracion() {
    cargarStats()
    cargarVentasRecientes()
}

function cargarStats() {
    const token = localStorage.getItem('token')

    // Libros
    fetch(APIURL + '/api/Libros', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(libros => {
            document.getElementById('totalLibros').textContent = libros.length
        })
        .catch(() => document.getElementById('totalLibros').textContent = '-')

    // Clientes
    fetch(APIURL + '/api/Clientes', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(clientes => {
            document.getElementById('totalClientes').textContent = clientes.length
        })
        .catch(() => document.getElementById('totalClientes').textContent = '-')

    // Ventas
    fetch(APIURL + '/api/Ventas', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(ventas => {
            document.getElementById('totalVentas').textContent = ventas.length
            renderizarBarras(ventas)
        })
        .catch(() => document.getElementById('totalVentas').textContent = '-')

    // Usuarios
    fetch(APIURL + '/api/Usuarios', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(usuarios => {
            document.getElementById('totalUsuarios').textContent = usuarios.length
        })
        .catch(() => document.getElementById('totalUsuarios').textContent = '-')
}

function renderizarBarras(ventas) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const conteo = new Array(12).fill(0)

    ventas.forEach(v => {
        const mes = new Date(v.fecha).getMonth()
        if (!isNaN(mes)) conteo[mes]++
    })

    const max = Math.max(...conteo, 1)
    const alturaMax = 90

    const barras = document.getElementById('barrasVentas')
    barras.innerHTML = ''

    conteo.forEach((cant, i) => {
        const altura = Math.round((cant / max) * alturaMax)
        barras.innerHTML += `
            <div class="barra-wrap">
                <div class="barra ${cant === 0 ? 'baja' : ''}" style="height:${altura}px;" title="${cant} ventas"></div>
                <span class="barra-texto">${meses[i]}</span>
            </div>`
    })

    document.getElementById('escalaBarras').textContent = '0 ' + Math.round(max / 4) + ' ' + Math.round(max / 2) + ' ' + max
}

function cargarVentasRecientes() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Ventas', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(ventas => {
            const tbody = document.getElementById('tablaVentasRecientes')
            tbody.innerHTML = ''

            if (ventas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#999;">No hay ventas registradas</td></tr>'
                return
            }

            const ventasGuardadas = JSON.parse(localStorage.getItem('ventasItems') || '{}')
            const recientes = ventas.slice(-5).reverse()
            recientes.forEach(v => {
                const itemsVenta = ventasGuardadas[v.id]
                const cantItems = itemsVenta ? itemsVenta.length : '-'
                tbody.innerHTML += `
                    <tr>
                        <td>${v.numeroComprobante ?? '-'}</td>
                        <td>${v.clienteNombre ?? '-'}</td>
                        <td>${v.fecha ? new Date(v.fecha).toLocaleDateString() : '-'}</td>
                        <td>${cantItems}</td>
                        <td><a href="detalle_venta.html?id=${v.id}" class="enlace">👁</a></td>
                    </tr>`
            })
        })
        .catch(() => {
            document.getElementById('tablaVentasRecientes').innerHTML =
                '<tr><td colspan="5" style="text-align:center; color:#999;">Error al cargar ventas</td></tr>'
        })
}