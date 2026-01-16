const API_URL = "https://cinema-phovl-api.onrender.com";
const id_sucursal = Number(document.body.dataset.sucursal);

let hoy = new Date();
hoy.setHours(0,0,0,0); 
let fechaSeleccionada = hoy.toISOString().split("T")[0];
let mesActual = hoy.getMonth();
let anioActual = hoy.getFullYear();

const weekDaysContainer = document.getElementById("weekDays");
const miniCalendar = document.getElementById("miniCalendar");
const monthLabel = document.getElementById("miniMonth");
const calendarGrid = document.getElementById("calendarGrid");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const fechaHoyBtn = document.getElementById("fechaHoyBtn");

fechaHoyBtn.textContent = `Hoy: ${hoy.toLocaleDateString("es-MX",{ weekday:"long", day:"numeric", month:"long" })}`;
fechaHoyBtn.onclick = () => {
  miniCalendar.style.display = miniCalendar.style.display === "none" ? "block" : "none";
};

function cargarSemana() {
  weekDaysContainer.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const fechaISO = fecha.toISOString().split("T")[0];

    const btn = document.createElement("button");
    btn.textContent = fecha.toLocaleDateString("es-MX",{ weekday:"short", day:"numeric" });

    if (fechaISO === fechaSeleccionada) btn.classList.add("activo");

    btn.onclick = () => {
      fechaSeleccionada = fechaISO;
      cargarSemana();
      renderMiniCalendar();
      cargarCartelera();
    };

    weekDaysContainer.appendChild(btn);
  }
}

function renderMiniCalendar() {
  calendarGrid.innerHTML = "";

  const primerDia = new Date(anioActual, mesActual, 1);
  const ultimoDia = new Date(anioActual, mesActual + 1, 0);

  monthLabel.textContent = primerDia.toLocaleDateString("es-MX",{ month:"long", year:"numeric" });

  const inicioSemana = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

  for (let i = 0; i < inicioSemana; i++) calendarGrid.appendChild(document.createElement("div"));

  const limite = new Date(hoy);
  limite.setDate(hoy.getDate() + 6);
  
  for (let d = 1; d <= ultimoDia.getDate(); d++) {
    const fecha = new Date(anioActual, mesActual, d);
    fecha.setHours(0,0,0,0);
    const fechaISO = fecha.toISOString().split("T")[0];

    const btn = document.createElement("button");
    btn.textContent = d;

    if (fecha < hoy || fecha > limite) {
      btn.disabled = true;
      btn.classList.add("disabled");
    }

    if (fechaISO === fechaSeleccionada) btn.classList.add("activo");

    btn.onclick = () => {
      if(fecha < hoy || fecha > limite) return; 
      fechaSeleccionada = fechaISO;
      miniCalendar.style.display = "none";
      cargarSemana();
      renderMiniCalendar();
      cargarCartelera();
    };

    calendarGrid.appendChild(btn);
  }
}

prevBtn.onclick = () => {
  mesActual--;
  if(mesActual<0){ mesActual=11; anioActual--; }
  renderMiniCalendar();
};

nextBtn.onclick = () => {
  mesActual++;
  if(mesActual>11){ mesActual=0; anioActual++; }
  renderMiniCalendar();
};

async function cargarCartelera() {
  const cartelera = document.getElementById("cartelera");
  cartelera.innerHTML = "<p>Cargando cartelera...</p>";

  try {
    const resPeliculas = await fetch(`${API_URL}/api/peliculas`);
    const peliculas = await resPeliculas.json();
    cartelera.innerHTML = "";

    for(const peli of peliculas){
      const resFunciones = await fetch(`${API_URL}/api/funciones/${peli.id_pelicula}/${id_sucursal}/${fechaSeleccionada}`);
      if(!resFunciones.ok) continue;
      const funciones = await resFunciones.json();
      if(!funciones.length) continue;

      cartelera.innerHTML += `
        <div class="pelicula-card">
          <img src="${peli.cartelera_url}">
          <div class="info">
            <h3>${peli.titulo}</h3>
            <p><b>Clasificación:</b> ${peli.clasificacion}</p>
            <p><b>Duración:</b> ${peli.duracion} min</p>
            ${renderFunciones(funciones)}
          </div>
        </div>
      `;
    }
    if(!cartelera.innerHTML) cartelera.innerHTML = "<p>No hay funciones para este día.</p>";
  } catch(err){
    console.error(err);
    cartelera.innerHTML = "<p>Error cargando cartelera.</p>";
  }
}

function renderFunciones(funciones){
  let html = "";
  const idiomas = [...new Set(funciones.map(f=>f.idioma))];
  idiomas.forEach(idioma=>{
    html += `<div class="titulo-botones">${idioma}</div><div class="botones-h">`;
    funciones.filter(f=>f.idioma===idioma).forEach(f=>{
      html += `<button onclick="seleccionarFuncion(${f.id_funcion},${f.id_sala})">${f.hora_inicio}</button>`;
    });
    html += "</div>";
  });
  return html;
}

function seleccionarFuncion(id_funcion,id_sala){
  localStorage.setItem("id_funcion",id_funcion);
  localStorage.setItem("id_sala",id_sala);
  localStorage.setItem("fecha",fechaSeleccionada);
  localStorage.setItem("id_sucursal",id_sucursal);
  window.location.href="pagina_boletos.html";
}

document.addEventListener("DOMContentLoaded", ()=>{
  cargarSemana();
  renderMiniCalendar();
  cargarCartelera();
});
