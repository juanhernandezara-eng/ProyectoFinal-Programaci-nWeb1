let todosLosLibros = []

function cargarConfiguracion() {
    cargarLibros()
    cargarLotes()
}

function cargarLibros() {
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

        todosLosLibros = librosConDatos
        renderizarLibros(librosConDatos)
    }).catch(err => console.error('Error cargarLibros:', err))
}

function renderizarLibros(libros) {
    const tbody = document.getElementById('tablaLibros')
    tbody.innerHTML = ''
    libros.forEach(l => {
        tbody.innerHTML += `
            <tr>
                <td>${l.nombre}</td>
                <td>${l.nivel}</td>
                <td>${l.tipo === 'StudentsBook' ? "Student's Book" : 'Workbook'}</td>
                <td>${l.edicion ?? '-'}</td>
                <td>${l.stockTotal ?? '-'}</td>
                <td>${l.lote ?? '-'}</td>
                <td>${l.valorVentaPublico ? '$' + l.valorVentaPublico.toLocaleString() : '-'}</td>
                <td><span class="enlace" onclick="editarLibro(${l.id})">Editar</span></td>
            </tr>`
    })
}

function filtrarLibros() {
    const texto = document.getElementById('buscarLibro').value.toLowerCase()
    const filtrados = todosLosLibros.filter(l =>
        l.nombre?.toLowerCase().includes(texto) ||
        l.nivel?.toLowerCase().includes(texto) ||
        l.tipo?.toString().toLowerCase().includes(texto) ||
        l.edicion?.toLowerCase().includes(texto)
    )
    renderizarLibros(filtrados)
}

function cargarLotes() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Lotes', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(lotes => {
            const select = document.getElementById('lote')
            if (!select) return
            select.innerHTML = '<option value="">- Selec. Lote</option>'
            lotes.forEach(l => {
                const op = document.createElement('option')
                op.value = l.codigo
                op.textContent = l.codigo
                select.appendChild(op)
            })
        })
        .catch(err => console.error('Error cargarLotes:', err))
}

function guardarLibro() {
    const token = localStorage.getItem('token')
    const id = document.getElementById('libroId').value

    const body = {
        nombre: document.getElementById('nombre').value,
        nivel: document.getElementById('nivel').value,
        lote: document.getElementById('lote').value,
        tipo: parseInt(document.getElementById('tipo').value),
        edicion: document.getElementById('edicion').value
    }

    const metodo = id ? 'PUT' : 'POST'
    const url = id ? APIURL + '/api/Libros/' + id : APIURL + '/api/Libros'

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    }).then(respuesta => {
        if (respuesta.ok) {
            const unidades = parseInt(document.getElementById('unidades').value)
            const lote = document.getElementById('lote').value
            const valorCompra = parseFloat(document.getElementById('valorCompra').value)
            const valorVentaPublico = parseFloat(document.getElementById('valorVentaPublico').value)

            if (unidades && lote) {
                fetch(APIURL + '/api/Ingresos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({
                        libroId: parseInt(id),
                        unidades,
                        lote,
                        valorCompra: valorCompra || 0,
                        valorVentaPublico: valorVentaPublico || 0
                    })
                }).then(r => {
                    if (!r.ok) r.json().then(e => console.error('Error ingreso:', e))
                }).catch(err => console.error('Error ingreso:', err))
            }

            alert(id ? 'Libro actualizado exitosamente' : 'Libro guardado exitosamente')
            limpiarLibro()
            setTimeout(() => cargarLibros(), 500)
        } else {
            respuesta.json().then(data => {
                alert('Error: ' + (data.detail || data.title || JSON.stringify(data.errors)))
            })
        }
    })
}

function editarLibro(id) {
    const libro = todosLosLibros.find(l => l.id === id)
    if (!libro) return

    document.getElementById('libroId').value = libro.id
    document.getElementById('nombre').value = libro.nombre
    document.getElementById('nivel').value = libro.nivel
    document.getElementById('tipo').value = libro.tipo === 'StudentsBook' ? 1 : 2
    document.getElementById('edicion').value = libro.edicion ?? ''
    document.getElementById('unidades').value = libro.stockTotal ?? ''
    document.getElementById('lote').value = libro.lote ?? ''
    document.getElementById('valorCompra').value = libro.valorCompra ?? ''
    document.getElementById('valorVentaPublico').value = libro.valorVentaPublico ?? ''
    document.getElementById('formTitulo').textContent = 'FORMULARIO: EDITAR LIBRO'
}

function limpiarLibro() {
    document.getElementById('libroId').value = ''
    document.getElementById('nombre').value = ''
    document.getElementById('nivel').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('edicion').value = ''
    document.getElementById('unidades').value = ''
    document.getElementById('lote').value = ''
    document.getElementById('valorCompra').value = ''
    document.getElementById('valorVentaPublico').value = ''
    document.getElementById('formTitulo').textContent = 'FORMULARIO: NUEVO LIBRO'
}