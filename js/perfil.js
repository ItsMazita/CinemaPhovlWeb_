const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("username").textContent =
  user && user.name ? user.name : "Invitado";

document.getElementById("email").textContent =
  user && user.email ? user.email : "correo@ejemplo.com";


const historyList = document.getElementById("purchase-history");


const tickets = JSON.parse(localStorage.getItem("tickets")) || [];

if (tickets.length === 0) {
  historyList.innerHTML = "<li>No hay compras registradas</li>";
} else {
  historyList.innerHTML = ""; 

  tickets.forEach(ticket => {
    const li = document.createElement("li");

    li.textContent =
      `🎬 ${ticket.pelicula} – ` +
      `📅 ${new Date(ticket.fecha).toLocaleDateString()} – ` +
      `🕒 ${ticket.hora_inicio} – ` +
      `💺 Asiento ${ticket.id_asiento}`;

    historyList.appendChild(li);
  });
}

function verTickets() {
  if (!tickets.length) {
    alert("No tienes tickets disponibles");
    return;
  }
  window.location.href = "ticket.html";
}
