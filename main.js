const NUMERO_VENDEDOR = "+51 902 515 748"
let subtotal = 0
let detalle = ""

function mostrarMensaje(idCaja, texto, color) {
    let caja = document.getElementById(idCaja)
    if (caja) {
        caja.textContent = texto
        caja.style.color = color
    }
}

function obtenerEnvio(zona) {
    let costo = 6
    if (zona == "Puerto / Malecón Chancay") {
        costo = 5
    } else if (zona == "Cercado de Chancay") {
        costo = 8
    } else if (zona == "Zona Playa / Costa") {
        costo = 10
    }
    return costo
}

function obtenerDescuento(monto) {
    let descuento = 0
    if (monto >= 500) {
        descuento = monto * 0.10
    }
    return descuento
}

function calcularCotizador() {
    let select = document.getElementById("producto-cotizar")
    let inputCant = document.getElementById("cantidad-cotizar")
    if (!select || !inputCant) {
        return
    }

    let opcion = select.options[select.selectedIndex]
    let precio = Number(select.value)
    let stock = Number(opcion.getAttribute("data-stock"))
    let cantidad = Number(inputCant.value)

    if (stock <= 0) {
        cantidad = 0
        inputCant.value = 0
        mostrarMensaje("aviso-cotizador", "Producto sin stock", "red")
    } else if (cantidad <= 0) {
        cantidad = 1
        inputCant.value = 1
        mostrarMensaje("aviso-cotizador", "Cantidad mínima: 1", "orange")
    } else if (cantidad > stock) {
        cantidad = stock
        inputCant.value = stock
        mostrarMensaje("aviso-cotizador", "Stock máximo: " + stock, "orange")
    } else {
        mostrarMensaje("aviso-cotizador", "Cotización lista", "green")
    }

    let total = precio * cantidad
    document.getElementById("cot-stock").textContent = stock > 0 ? stock : "Agotado (0)"
    document.getElementById("cot-unitario").textContent = "S/ " + precio.toFixed(2)
    document.getElementById("cot-cantidad").textContent = cantidad
    document.getElementById("cot-total").textContent = "S/ " + total.toFixed(2)
}

function guardarCotizador(e) {
    e.preventDefault()

    let select = document.getElementById("producto-cotizar")
    let inputCant = document.getElementById("cantidad-cotizar")
    let opcion = select.options[select.selectedIndex]
    let nombre = opcion.getAttribute("data-nombre")
    let precio = Number(select.value)
    let stock = Number(opcion.getAttribute("data-stock"))
    let cantidad = Number(inputCant.value)

    if (stock <= 0 || cantidad <= 0) {
        mostrarMensaje("aviso-cotizador", "No hay stock para guardar", "red")
        return
    }

    stock -= cantidad
    opcion.setAttribute("data-stock", stock)

    let monto = precio * cantidad
    subtotal += monto
    detalle += "• " + nombre + " x" + cantidad + " - S/ " + monto.toFixed(2) + "<br>"

    mostrarMensaje("aviso-cotizador", "Guardado (+S/ " + monto.toFixed(2) + ") | Acumulado: S/ " + subtotal.toFixed(2), "green")
    inputCant.value = stock > 0 ? 1 : 0
    calcularCotizador()
    mostrarResumenCotizador()
}

function mostrarResumenCotizador() {
    let cajaItems = document.getElementById("resumen-pedido-items")
    let totalEl = document.getElementById("pedido-total")
    let selectZona = document.getElementById("zona-entrega")

    if (!cajaItems || !totalEl) {
        return
    }

    let zona = selectZona ? selectZona.value : "Puerto / Malecón Chancay"
    let envio = obtenerEnvio(zona)
    let descuento = obtenerDescuento(subtotal)
    let total = subtotal - descuento + envio

    let itemsTexto = detalle != "" ? detalle : "<p>Sin productos guardados aún</p>"
    let promoTexto = descuento > 0 ? "-S/ " + descuento.toFixed(2) : "S/ 0.00"

    cajaItems.innerHTML =
        "<div>" + itemsTexto + "</div>" +
        "<p>Subtotal: S/ " + subtotal.toFixed(2) + "</p>" +
        "<p>Descuento: " + promoTexto + "</p>" +
        "<p>Envío (" + zona + "): S/ " + envio.toFixed(2) + "</p>"

    totalEl.textContent = "S/ " + total.toFixed(2)
}

function confirmarEnCotizador(e) {
    e.preventDefault()

    let nombreEl = document.getElementById("nombre-cliente")
    let telefonoEl = document.getElementById("telefono-cliente")
    let zonaEl = document.getElementById("zona-entrega")
    let notasEl = document.getElementById("notas-pedido")
    let modalCheck = document.getElementById("modal-check")
    let detalleModal = document.getElementById("detalle-modal-pedido")

    let nombre = nombreEl ? nombreEl.value.trim() : ""
    let telefono = telefonoEl ? telefonoEl.value.trim() : ""
    let zona = zonaEl ? zonaEl.value : "Puerto / Malecón Chancay"
    let notas = notasEl ? notasEl.value.trim() : ""

    if (modalCheck) {
        modalCheck.checked = false
    }

    if (nombre.length < 3) {
        mostrarMensaje("mensaje-pedido", "Escribe tu nombre (mínimo 3 letras)", "red")
        return
    }

    if (telefono.length < 7) {
        mostrarMensaje("mensaje-pedido", "Escribe un teléfono válido", "red")
        return
    }

    mostrarMensaje("mensaje-pedido", "Cotización confirmada con éxito", "green")

    let envio = obtenerEnvio(zona)
    let descuento = obtenerDescuento(subtotal)
    let total = subtotal - descuento + envio
    let itemsModal = detalle != "" ? detalle : "Sin ítems guardados<br>"
    let notaModal = notas != "" ? notas : "Ninguna"

    if (detalleModal) {
        detalleModal.innerHTML =
            "<p>Cliente: " + nombre + "</p>" +
            "<p>Teléfono: " + telefono + "</p>" +
            "<p>Cotizado:<br>" + itemsModal + "</p>" +
            "<p>Descuento: S/ " + descuento.toFixed(2) + "</p>" +
            "<p>Envío: " + zona + " (S/ " + envio.toFixed(2) + ")</p>" +
            "<p>Total: S/ " + total.toFixed(2) + "</p>" +
            "<p>Nota: " + notaModal + "</p>"
    }

    if (modalCheck) {
        modalCheck.checked = true
    }

    subtotal = 0
    detalle = ""
    mostrarResumenCotizador()
}

function prepararCotizador() {
    let form = document.getElementById("form-cotizador")
    let select = document.getElementById("producto-cotizar")
    let inputCant = document.getElementById("cantidad-cotizar")
    let formConfirmar = document.getElementById("form-confirmar-cotizacion")
    let selectZona = document.getElementById("zona-entrega")

    if (!form || !select || !inputCant) {
        return
    }

    let numeroEl = document.querySelector(".modal-numero")
    if (numeroEl) {
        numeroEl.textContent = "📱 " + NUMERO_VENDEDOR
    }

    select.addEventListener("change", calcularCotizador)
    inputCant.addEventListener("input", calcularCotizador)
    form.addEventListener("submit", guardarCotizador)

    if (selectZona) {
        selectZona.addEventListener("change", mostrarResumenCotizador)
    }

    if (formConfirmar) {
        formConfirmar.addEventListener("submit", confirmarEnCotizador)
    }

    calcularCotizador()
    mostrarResumenCotizador()
}

function iniciar() {
    prepararCotizador()
}

document.addEventListener("DOMContentLoaded", iniciar)