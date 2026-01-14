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

function cancelarCompra(){
  alert("❌ La compra ha sido cancelada.");
  localStorage.removeItem("asientosTemporal");
  window.location.href = "Pagina Principal.html";
}

/* ================== PAYPAL ================== */
paypal.Buttons({
    style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'paypal'
    },
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: total.toFixed(2)  // Total que ya calculaste
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            alert("✅ Pago con PayPal completado por " + details.payer.name.given_name);
            // Marcar asientos como ocupados
            const ocupados = JSON.parse(localStorage.getItem("asientosOcupados")) || [];
            const temporal = JSON.parse(localStorage.getItem("asientosTemporal")) || [];
            localStorage.setItem(
                "asientosOcupados",
                JSON.stringify([...ocupados, ...temporal])
            );
            localStorage.removeItem("asientosTemporal");
            window.location.href = "Pagina Principal.html";
        });
    }
}).render('#paypal-button-container'); // Renderizar en el contenedor


