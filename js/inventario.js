let todosLosLibrosInv = []

function cargarConfiguracion() {
    cargarInventario()
}

function cargarInventario() {
    const token = localStorage.getItem('token')

    Promise.all([
        fetch(APIURL + '/api/Libros/stock', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json()),
        fetch(APIURL + '/api/Ingresos', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json())
    ]).then(([libros, ingresos]) => {
        const librosConDatos = libros.map(l => {
            const ingresosLibro = ingresos.filter(i => i.id === l.id)
            const ultimoIngreso = ingresosLibro.sort((a, b) =>
                new Date(b.fecha) - new Date(a.fecha)
            )[0]
            return {
                ...l,
                valorCompra: ultimoIngreso?.valorCompra ?? 0,
                valorVentaPublico: ultimoIngreso?.valorVentaPublico ?? 0
            }
        })

        todosLosLibrosInv = librosConDatos
        renderizarInventario(librosConDatos)
    }).catch(err => console.error('Error cargarInventario:', err))
}

function renderizarInventario(libros) {
    const tbody = document.getElementById('tablaInventario')
    tbody.innerHTML = ''

    let totalUnidades = 0
    const lotesUnicos = new Set()

    libros.forEach(l => {
        const unidades = l.stockTotal ?? 0
        const lote = l.lote ?? '-'
        totalUnidades += unidades
        if (lote !== '-') lotesUnicos.add(lote)

        let estado, badge
        if (unidades === 0) {
            estado = 'Agotado'
            badge = 'badge-agotado'
        } else if (unidades <= 5) {
            estado = 'Bajo Stock'
            badge = 'badge-bajo'
        } else {
            estado = 'Disponible'
            badge = 'badge-ok'
        }

        tbody.innerHTML += `
            <tr>
                <td>${l.nombre}</td>
                <td>${lote}</td>
                <td>${unidades}</td>
                <td><span class="badge ${badge}">${estado}</span></td>
            </tr>`
    })

    document.getElementById('totalUnidades').textContent = totalUnidades
    document.getElementById('totalLotes').textContent = lotesUnicos.size

    if (libros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#999;">No hay libros registrados</td></tr>'
    }
}

function filtrarPorLote() {
    const texto = document.getElementById('filtroLote').value.toLowerCase().trim()
    if (!texto) {
        renderizarInventario(todosLosLibrosInv)
        return
    }
    const filtrados = todosLosLibrosInv.filter(l =>
        l.lote?.toLowerCase().includes(texto)
    )
    renderizarInventario(filtrados)
}