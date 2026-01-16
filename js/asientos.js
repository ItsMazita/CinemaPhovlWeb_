const API_URL = "https://cinema-phovl-api.onrender.com";

const id_funcion = localStorage.getItem("id_funcion");
const id_sala = localStorage.getItem("id_sala");

if (!id_funcion || !id_sala) {
  alert("Función o sala no seleccionada");
  window.location.href = "Pagina Principal.html";
}


const datos = JSON.parse(localStorage.getItem("boletos")) || {
  ninos: 0,
  adultos: 0,
  estudiantes: 0,
  mayores: 0
};

const total =
  (+datos.ninos) +
  (+datos.adultos) +
  (+datos.estudiantes) +
  (+datos.mayores);

document.getElementById("infoBoletos").textContent =
  "Boletos seleccionados: " + total;


let ocupados = [];
let seleccionados = [];
let asientos = [];


async function cargarAsientos() {
  try {
    const res = await fetch(
      `${API_URL}/api/asientos/salas/${id_sala}/asientos`
    );
    asientos = await res.json();
  } catch (err) {
    console.error("❌ Error cargando asientos", err);
  }
}

async function cargarOcupados() {
  try {
    const res = await fetch(
      `${API_URL}/api/asientos/funciones/${id_funcion}/asientos-ocupados`
    );
    ocupados = await res.json().then(arr => arr.map(Number));
  } catch (err) {
    console.error("❌ Error cargando ocupados", err);
  }
}


function generarSala() {
  const sala = document.getElementById("sala");
  sala.innerHTML = "";

  const filas = {};

  asientos.forEach(a => {
    if (!filas[a.fila]) filas[a.fila] = [];
    filas[a.fila].push(a);
  });

  for (const fila in filas) {
    const filaDiv = document.createElement("div");
    filaDiv.classList.add("fila");

    const label = document.createElement("span");
    label.classList.add("fila-label");
    label.textContent = fila;
    filaDiv.appendChild(label);

    filas[fila]
      .sort((a, b) => a.numero - b.numero)
      .forEach(a => {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.textContent = a.numero;
        seat.dataset.id = a.id_asiento;

        if (ocupados.includes(a.id_asiento)) {
          seat.classList.add("occupied");
        }

        seat.onclick = () => toggleSeat(seat);
        filaDiv.appendChild(seat);
      });

    sala.appendChild(filaDiv);
  }
}

function toggleSeat(seat) {
  const id = Number(seat.dataset.id);

  if (seat.classList.contains("occupied")) return;

  if (seat.classList.contains("selected")) {
    seat.classList.remove("selected");
    seleccionados = seleccionados.filter(s => s !== id);
  } else {
    if (seleccionados.length < total) {
      seat.classList.add("selected");
      seleccionados.push(id);
    }
  }
}


function confirmar() {
  if (seleccionados.length !== total) {
    alert(`Debe seleccionar exactamente ${total} asientos.`);
    return;
  }

  localStorage.setItem("asientosTemporal", JSON.stringify(seleccionados));
  window.location.href = "pago.html";
}

async function init() {
  await cargarAsientos();
  await cargarOcupados();
  generarSala();
}

init();
