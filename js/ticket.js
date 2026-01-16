const { jsPDF } = window.jspdf;

const id_usuario = Number(localStorage.getItem("id_usuario"));
const contenedor = document.getElementById("tickets");

if (!id_usuario) {
  contenedor.innerHTML = "<p>⚠️ Debe iniciar sesión</p>";
  throw new Error("Usuario no loggeado");
}

const todosLosTickets = JSON.parse(localStorage.getItem("tickets")) || [];


const ticketsUsuario = todosLosTickets.filter(
  t => Number(t.id_usuario) === id_usuario
);

if (!ticketsUsuario.length) {
  contenedor.innerHTML = "<p>No tienes tickets disponibles</p>";
} else {
  contenedor.innerHTML = "";

  ticketsUsuario.forEach((t, i) => {
    const ticketDiv = document.createElement("div");
    ticketDiv.className = "ticket";
    ticketDiv.id = `ticket-${i}`;

    ticketDiv.innerHTML = `
      <h3>🎟️ Ticket #${i + 1}</h3>
      <p><strong>Película:</strong> ${t.pelicula}</p>
      <p><strong>Fecha:</strong> ${new Date(t.fecha).toLocaleDateString()}</p>
      <p><strong>Hora:</strong> ${t.hora_inicio}</p>
      <p><strong>Asiento:</strong> ${t.id_asiento}</p>

      <div class="qr" id="qr-${i}"></div>

      <button class="btn-descargar" onclick="descargarTicket(${i})">
        ⬇️ Descargar PDF
      </button>
    `;

    contenedor.appendChild(ticketDiv);

    new QRCode(document.getElementById(`qr-${i}`), {
      text: t.codigo_qr,
      width: 150,
      height: 150
    });
  });
}

async function descargarTicket(index) {
  const ticketElement = document.getElementById(`ticket-${index}`);

  const botones = ticketElement.querySelectorAll("button");
  botones.forEach(btn => btn.style.display = "none");

  const canvas = await html2canvas(ticketElement, {
    scale: 2,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`ticket_${index + 1}.pdf`);

  botones.forEach(btn => btn.style.display = "inline-block");
}

function volver() {
  window.location.href = "Pagina Principal.html";
}