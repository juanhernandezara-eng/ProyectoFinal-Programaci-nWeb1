let items = []
let librosStock = []

function cargarConfiguracion() {
    cargarClientes()
    cargarLibros()
    cargarLotes()
    cargarVentas()
}

function cargarClientes() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Clientes', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(clientes => {
            const select = document.getElementById('clienteId')
            clientes.forEach(c => {
                const op = document.createElement('option')
                op.value = c.identificacion
                op.textContent = c.nombres
                select.appendChild(op)
            })
        })
}

function cargarLibros() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Libros/stock', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(libros => {
            librosStock = libros
            const select = document.getElementById('libroId')
            libros.forEach(l => {
                const op = document.createElement('option')
                op.value = l.id
                op.textContent = l.nombre
                select.appendChild(op)
            })
        })
}

function cargarLotes() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Lotes', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(lotes => {
            const select = document.getElementById('lote')
            lotes
                .filter(l => l.codigo && l.codigo !== 'string')
                .forEach(l => {
                    const op = document.createElement('option')
                    op.value = l.codigo
                    op.textContent = l.codigo
                    select.appendChild(op)
                })
        })
}

function cargarVentas() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Ventas', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(ventas => {
            const tbody = document.getElementById('tablaVentas')
            tbody.innerHTML = ''
            const ventasGuardadas = JSON.parse(localStorage.getItem('ventasItems') || '{}')
            ventas.forEach(v => {
                const itemsVenta = ventasGuardadas[v.id]
                const cantItems = itemsVenta ? itemsVenta.length : '-'
                tbody.innerHTML += `
                    <tr>
                        <td>${v.numeroComprobante}</td>
                        <td>${v.clienteNombre}</td>
                        <td>${cantItems}</td>
                        <td>${new Date(v.fecha).toLocaleDateString()}</td>
                        <td><a href="detalle_venta.html?id=${v.id}" class="flecha">→</a></td>
                    </tr>`
            })
        })
}

function agregarItem() {
    const libroId = parseInt(document.getElementById('libroId').value)
    const lote = document.getElementById('lote').value
    const cantidad = parseInt(document.getElementById('cantidad').value)

    if (!libroId || !lote || !cantidad) {
        alert('Completa libro, lote y cantidad')
        return
    }

    // Verificar que el lote corresponde al libro
    const libro = librosStock.find(l => l.id === libroId)
    if (libro && libro.lote !== lote) {
        alert(`El libro "${libro.nombre}" pertenece al lote ${libro.lote}, no al lote ${lote}`)
        return
    }

    // Verificar stock disponible
    if (libro && cantidad > libro.stockTotal) {
        alert(`Stock insuficiente. Solo hay ${libro.stockTotal} unidades disponibles de "${libro.nombre}"`)
        return
    }

    const libroTexto = document.getElementById('libroId').selectedOptions[0].textContent
    items.push({ libroId, lote, cantidad })

    const lista = document.getElementById('listaItems')
    lista.innerHTML += `
        <div class="fila mt8" style="font-size:13px; padding:6px; background:#f5f5f5; border-radius:4px;">
            📚 ${libroTexto} | Lote: ${lote} | Cant: ${cantidad}
        </div>`

    document.getElementById('libroId').value = ''
    document.getElementById('lote').value = ''
    document.getElementById('cantidad').value = ''
}

function registrarVenta() {
    const token = localStorage.getItem('token')

    if (items.length === 0) {
        alert('Agrega al menos un item')
        return
    }

    const body = {
        identificacionCliente: document.getElementById('clienteId').value,
        numeroComprobante: document.getElementById('numeroComprobante').value,
        observaciones: document.getElementById('observaciones').value,
        items: items
    }

    if (!body.identificacionCliente) {
        alert('Selecciona un cliente')
        return
    }

    const libroSelect = document.getElementById('libroId')
    const itemsConNombre = items.map(i => ({
        ...i,
        libroNombre: libroSelect.querySelector(`option[value="${i.libroId}"]`)?.textContent ?? 'Libro ' + i.libroId
    }))

    fetch(APIURL + '/api/Ventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    }).then(() => {
        return fetch(APIURL + '/api/Ventas', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(r => r.json()).then(ventas => {
            const ventaCreada = ventas.find(v => v.numeroComprobante === body.numeroComprobante)
            if (ventaCreada) {
                const ventasGuardadas = JSON.parse(localStorage.getItem('ventasItems') || '{}')
                ventasGuardadas[ventaCreada.id] = itemsConNombre
                localStorage.setItem('ventasItems', JSON.stringify(ventasGuardadas))
            }
            alert('Venta registrada exitosamente')
            limpiarVenta()
            cargarVentas()
        })
    }).catch(err => console.error('Error registrarVenta:', err))
}

function limpiarVenta() {
    items = []
    document.getElementById('clienteId').value = ''
    document.getElementById('numeroComprobante').value = ''
    document.getElementById('observaciones').value = ''
    document.getElementById('listaItems').innerHTML = ''
}