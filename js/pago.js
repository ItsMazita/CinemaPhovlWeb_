const API_URL = "https://cinema-phovl-api.onrender.com";

const precios = {
  ninos: 55,
  adultos: 85,
  estudiantes: 65,
  mayores: 60
};

const datos = JSON.parse(localStorage.getItem("boletos")) || {};

let total =
  (datos.ninos || 0) * precios.ninos +
  (datos.adultos || 0) * precios.adultos +
  (datos.estudiantes || 0) * precios.estudiantes +
  (datos.mayores || 0) * precios.mayores;

document.getElementById("total").textContent = `$${total} MXN`;

async function realizarCompra() {
  const id_funcion = Number(localStorage.getItem("id_funcion"));
  const id_usuario = Number(localStorage.getItem("id_usuario"));
  const asientos = JSON.parse(localStorage.getItem("asientosTemporal")) || [];

  if (!id_usuario) {
    alert("Debe iniciar sesión para continuar");
    return;
  }

  if (!id_funcion || asientos.length === 0) {
    alert("Datos inválidos de compra");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/tickets/comprar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_funcion,
        id_asientos: asientos.map(Number),
        id_usuario
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error al procesar la compra");
      return;
    }

    const ticketsGuardados =
      JSON.parse(localStorage.getItem("tickets")) || [];

    const ticketsConUsuario = data.tickets.map(t => ({
      ...t,
      id_usuario
    }));

    localStorage.setItem(
      "tickets",
      JSON.stringify([...ticketsGuardados, ...ticketsConUsuario])
    );

    localStorage.removeItem("asientosTemporal");
    localStorage.removeItem("boletos");

    alert("🎉 Compra realizada con éxito");
    window.location.href = "ticket.html";

  } catch (err) {
    console.error(err);
    alert("Error de conexión con el servidor");
  }
}

function confirmarPago() {
  const metodo = document.querySelector('input[name="pago"]:checked');

  if (!metodo) {
    alert("Seleccione un método de pago");
    return;
  }

  if (metodo.value === "Tarjeta") alert("💳 Pago con tarjeta aprobado");
  if (metodo.value === "Efectivo") alert("💵 Pago en efectivo registrado");
  if (metodo.value === "Transferencia") alert("🏦 Transferencia registrada");

  realizarCompra();
}

function cancelarCompra() {
  alert("❌ La compra ha sido cancelada.");
  localStorage.removeItem("asientosTemporal");
  localStorage.removeItem("boletos");
  window.location.href = "Pagina Principal.html";
}

paypal.Buttons({
  style: {
    shape: "rect",
    color: "gold",
    layout: "vertical",
    label: "paypal"
  },

  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: total.toFixed(2)
        }
      }]
    });
  },

  onApprove: function (data, actions) {
    return actions.order.capture().then(function () {
      alert("✅ Pago realizado con PayPal");
      realizarCompra();
    });
  }

}).render("#paypal-button-container");
