const API_URL = "https://cinema-phovl-api.onrender.com";
const id_sucursal = Number(document.body.dataset.sucursal);

let fechaSeleccionada = new Date().toISOString().split("T")[0];

function cargarSemana() {
  const contenedor = document.getElementById("weekDays");
  contenedor.innerHTML = "";

  const hoy = new Date();

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);

    const fechaISO = fecha.toISOString().split("T")[0];

    const btn = document.createElement("button");
    btn.textContent = fecha.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric"
    });

    if (fechaISO === fechaSeleccionada) {
      btn.classList.add("activo");
    }

    btn.onclick = () => {
      fechaSeleccionada = fechaISO;
      cargarSemana();
      cargarCartelera();
    };

    contenedor.appendChild(btn);
  }
}


async function cargarCartelera() {
  try {
    const cartelera = document.getElementById("cartelera");
    cartelera.innerHTML = "<p>Cargando cartelera...</p>";

    const resPeliculas = await fetch(`${API_URL}/api/peliculas`);
    const peliculas = await resPeliculas.json();

    cartelera.innerHTML = "";

    for (const peli of peliculas) {
      const resFunciones = await fetch(
        `${API_URL}/api/funciones/${peli.id_pelicula}/${id_sucursal}/${fechaSeleccionada}`
      );

      if (!resFunciones.ok) continue;

      const funciones = await resFunciones.json();
      if (funciones.length === 0) continue;

      cartelera.innerHTML += `
        <div class="pelicula-card">
          <img src="${peli.cartelera_url}" alt="${peli.titulo}">
          <div class="info">
            <h3>${peli.titulo}</h3>
            <p><b>Clasificación:</b> ${peli.clasificacion}</p>
            <p><b>Duración:</b> ${peli.duracion} min</p>

            ${renderFunciones(funciones)}
          </div>
        </div>
      `;
    }

    if (cartelera.innerHTML === "") {
      cartelera.innerHTML = "<p>No hay funciones para este día.</p>";
    }

  } catch (err) {
    console.error("❌ Error cargando cartelera", err);
  }
}

function renderFunciones(funciones) {
  let html = "";
  const idiomas = [...new Set(funciones.map(f => f.idioma))];

  idiomas.forEach(idioma => {
    html += `<div class="titulo-botones">${idioma}</div>`;
    html += `<div class="botones-h">`;

    funciones
      .filter(f => f.idioma === idioma)
      .forEach(f => {
        html += `
          <button onclick="seleccionarFuncion(${f.id_funcion})">
            ${f.hora_inicio}
          </button>
        `;
      });

    html += "</div>";
  });

  return html;
}

function seleccionarFuncion(id_funcion) {
  localStorage.setItem("id_funcion", id_funcion);
  localStorage.setItem("fecha", fechaSeleccionada);
  localStorage.setItem("id_sucursal", id_sucursal);
  window.location.href = "pagina_boletos.html";
}

document.addEventListener("DOMContentLoaded", () => {
  cargarSemana();
  cargarCartelera();
});
