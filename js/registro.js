function iniciarSesion(email, password) {
    let endPoint = '/api/Seguridad/iniciar-sesion'
    let url = APIURL + endPoint
    console.log(url)
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(respuesta => respuesta.json())
        .then(respuestaJSON => {
            if (respuestaJSON.token != undefined) {
                localStorage.setItem('token', respuestaJSON.token)
                window.location.href = 'html/dashboard.html'
            } else {
                alert('usuario/password errado')
                console.error(respuestaJSON)
            }
        })
}

function autenticar() {
    email = document.getElementById('email').value
    password = document.getElementById('contrasena').value
    console.log('email:', email, '| password:', password)
    iniciarSesion(email, password)
}

function verificarCorreo(token) {
    let url = APIURL + '/api/Seguridad/verificar-correo?token=' + token
    fetch(url)
        .then(respuesta => {
            if (respuesta.ok) {
                console.log('Correo verificado y usuario activado')
            } else {
                console.error('Error al verificar correo')
            }
        })
}

function activarUsuario(id) {
    const token = localStorage.getItem('token')
    let url = APIURL + '/api/Usuarios/' + id + '/estado?activo=true'

    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(respuesta => {
        if (respuesta.ok) {
            console.log('Usuario activado')
        } else {
            console.error('Error al activar usuario')
        }
    })
}

function activarUsuarioPorEmail(email) {
    const token = localStorage.getItem('token')
    let url = APIURL + '/api/Usuarios'

    fetch(url, {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(usuarios => {
            const usuario = usuarios.find(u => u.email === email)
            if (usuario) {
                activarUsuario(usuario.id)
            } else {
                console.error('No se encontró el usuario para activar')
            }
        })
}

function registrar() {
    const token = localStorage.getItem('token')
    if (!token) {
        alert('No hay sesión activa. Inicia sesión primero.')
        return
    }
    let url = APIURL + '/api/Usuarios'
    let datosFormulario = leerDatosFormulario()
    const body = {
        identificacion: datosFormulario.identificacion.value,
        nombres: datosFormulario.nombres.value,
        email: datosFormulario.email.value,
        password: datosFormulario.contraseña.value,
        rol: datosFormulario.rol.value
    }
    console.log('Body enviado:', body)
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    }).then(respuesta => {

        if (respuesta.ok) {

            respuesta.json().then(data => {
                console.log('Respuesta registro:', data)
                if (data.id) {
                    activarUsuario(data.id)
                } else if (data.emailVerificationToken) {
                    verificarCorreo(data.emailVerificationToken)
                }
            })
            alert('Usuario Guardado exitosamente')

        } else if (respuesta.status === 500) {

            // El usuario se registró pero falló el envío de email SMTP
            activarUsuarioPorEmail(body.email)
            alert('Usuario Guardado exitosamente')

        } else {

            respuesta.text().then(texto => {
                let mensaje = 'Error desconocido'
                if (texto) {
                    try {
                        const data = JSON.parse(texto)
                        mensaje = obtenerMensajeError(data)
                    } catch {
                        mensaje = texto
                    }
                } else if (respuesta.status === 401) {
                    mensaje = 'No autorizado. Token inválido o expirado.'
                }
                alert('Error al insertar: ' + mensaje)
            })
        }
    })
}

function leerDatosFormulario() {
    datos = {
        identificacion: document.getElementById('identificacion'),
        nombres: document.getElementById('nombres'),
        email: document.getElementById('correo'),
        contraseña: document.getElementById('contrasena'),
        rol: document.getElementById('rol')
    }
    return datos
}