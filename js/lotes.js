function cargarConfiguracion() {
    cargarLotes()
}

function cargarLotes() {
    const token = localStorage.getItem('token')

    Promise.all([
        fetch(APIURL + '/api/Lotes', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json()),
        fetch(APIURL + '/api/Ingresos', { headers: { 'Authorization': 'Bearer ' + token } }).then(r => r.json())
    ]).then(([lotes, ingresos]) => {
        const tbody = document.getElementById('tablaLotes')
        if (!tbody) return
        tbody.innerHTML = ''

        lotes
            .filter(l => l.codigo && l.codigo !== 'string')
            .forEach((l, index) => {
                const codigo = l.codigo

                const librosAsociados = new Set(
                    ingresos
                        .filter(i => i.codigoLote === codigo)
                        .map(i => i.id)
                ).size

                tbody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${codigo}</td>
                        <td>${librosAsociados}</td>
                    </tr>`
            })

    }).catch(err => console.error('Error cargarLotes:', err))
}

function guardarLote() {
    const token = localStorage.getItem('token')
    const codigo = document.getElementById('codigoLote').value.trim()

    if (!codigo) {
        alert('Ingresa un código de lote')
        return
    }

    fetch(APIURL + '/api/Lotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(codigo)
    }).then(respuesta => {
        if (respuesta.ok) {
            alert('Lote registrado exitosamente')
            document.getElementById('codigoLote').value = ''
            cargarLotes()
        } else {
            respuesta.text().then(texto => {
                try {
                    const data = JSON.parse(texto)
                    alert('Error: ' + (data.detail || data.title || 'Error desconocido'))
                } catch {
                    alert('Error: ' + texto)
                }
            })
        }
    })
}