function cargarConfiguracion() {
    cargarClientes()
}

function cargarClientes() {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Clientes', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(clientes => {
            const tbody = document.getElementById('tablaClientes')
            if (!tbody) return
            tbody.innerHTML = ''
            clientes.forEach(c => {
                tbody.innerHTML += `
                    <tr>
                        <td>${c.identificacion}</td>
                        <td>${c.nombres}</td>
                        <td>${c.email}</td>
                        <td>${c.celular}</td>
                        <td>${c.fechaNacimiento}</td>
                        <td><span class="enlace" onclick="editarCliente('${c.identificacion}')">Ver · Editar</span></td>
                    </tr>`
            })
        })
}

function guardarCliente() {
    const token = localStorage.getItem('token')
    const id = document.getElementById('clienteIdEdit').value

    const body = {
        identificacion: document.getElementById('identificacion').value,
        nombres: document.getElementById('nombres').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('celular').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value
    }

    if (!body.identificacion || !body.nombres || !body.email) {
        alert('Completa los campos obligatorios')
        return
    }

    const metodo = id ? 'PUT' : 'POST'
    const url = id ? APIURL + '/api/Clientes/' + id : APIURL + '/api/Clientes'

    fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    }).then(respuesta => {
        if (respuesta.ok) {
            alert(id ? 'Cliente actualizado exitosamente' : 'Cliente guardado exitosamente')
            limpiarCliente()
            cargarClientes()
        } else {
            respuesta.json().then(data => {
                alert('Error: ' + (data.detail || data.title || JSON.stringify(data.errors)))
            })
        }
    })
}

function editarCliente(identificacion) {
    const token = localStorage.getItem('token')
    fetch(APIURL + '/api/Clientes/' + identificacion, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(c => {
            document.getElementById('clienteIdEdit').value = c.identificacion
            document.getElementById('identificacion').value = c.identificacion
            document.getElementById('nombres').value = c.nombres
            document.getElementById('email').value = c.email
            document.getElementById('celular').value = c.celular
            document.getElementById('fechaNacimiento').value = c.fechaNacimiento?.split('T')[0] ?? ''
            document.getElementById('formTitulo').textContent = 'FORMULARIO: EDITAR CLIENTE'
        })
}

function limpiarCliente() {
    document.getElementById('clienteIdEdit').value = ''
    document.getElementById('identificacion').value = ''
    document.getElementById('nombres').value = ''
    document.getElementById('email').value = ''
    document.getElementById('celular').value = ''
    document.getElementById('fechaNacimiento').value = ''
    document.getElementById('formTitulo').textContent = 'FORMULARIO: NUEVO / EDITAR CLIENTE'
}