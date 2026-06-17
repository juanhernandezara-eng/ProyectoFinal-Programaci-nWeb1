// Roles
const ROL_ADMIN = 0
const ROL_BIBLIOTECARIO = 1
const ROL_CONSULTA = 2

const rolesTexto = {
    'Admin': ROL_ADMIN,
    'Bibliotecario': ROL_BIBLIOTECARIO,
    'Consulta': ROL_CONSULTA
}

function obtenerRol(rol) {
    if (typeof rol === 'string' && isNaN(parseInt(rol))) {
        return rolesTexto[rol] ?? -1
    }
    return parseInt(rol)
}

// Permisos por página
const permisos = {
    'dashboard.html':          [ROL_ADMIN, ROL_BIBLIOTECARIO, ROL_CONSULTA],
    'libros.html':             [ROL_ADMIN, ROL_BIBLIOTECARIO],
    'lotes.html':              [ROL_ADMIN, ROL_BIBLIOTECARIO],
    'ventas.html':             [ROL_ADMIN, ROL_BIBLIOTECARIO],
    'clientes.html':           [ROL_ADMIN, ROL_BIBLIOTECARIO],
    'inventario.html':         [ROL_ADMIN, ROL_BIBLIOTECARIO, ROL_CONSULTA],
    'inventario_ingreso.html': [ROL_ADMIN, ROL_BIBLIOTECARIO],
    'detalle_venta.html':      [ROL_ADMIN, ROL_BIBLIOTECARIO],
    'registro.html':           [ROL_ADMIN],
}

function verificarAcceso() {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = '../index.html'
        return
    }

    fetch(APIURL + '/api/Usuarios/perfil', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
        .then(r => r.json())
        .then(perfil => {
            const rol = obtenerRol(perfil.rol)
            const pagina = window.location.pathname.split('/').pop()
            const rolesPermitidos = permisos[pagina]

            if (!rolesPermitidos || !rolesPermitidos.includes(rol)) {
                alert('No tienes permiso para acceder a esta página.')
                window.location.href = 'dashboard.html'
                return
            }

            // Mostrar la página solo si tiene permiso
            document.body.style.display = 'block'

            // Actualizar datos del sidebar
            const elNombre = document.querySelector('.sidebar-usuario .nombre')
            const elCorreo = document.querySelector('.sidebar-usuario .correo')
            const elAvatar = document.querySelector('.sidebar-usuario .avatar')

            if (elNombre) elNombre.textContent = perfil.nombres
            if (elCorreo) elCorreo.textContent = perfil.email
            if (elAvatar) elAvatar.textContent = perfil.nombres.charAt(0).toUpperCase()

            // Ocultar menús según rol
            if (rol === ROL_CONSULTA) {
                ocultarEnlace('libros.html')
                ocultarEnlace('lotes.html')
                ocultarEnlace('ventas.html')
                ocultarEnlace('clientes.html')
            }

            // Llamar función de la página si existe
            if (typeof cargarConfiguracion === 'function') {
                cargarConfiguracion()
            }
        })
        .catch(() => {
            window.location.href = '../index.html'
        })
}

function ocultarEnlace(pagina) {
    const enlace = document.querySelector(`.sidebar-menu a[href="${pagina}"]`)
    if (enlace) enlace.style.display = 'none'
}

function cerrarSesion() {
    localStorage.removeItem('token')
    window.location.href = '../index.html'
}