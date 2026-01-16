const API_URL = "https://cinema-phovl-api.onrender.com";
let currentSlide = { estrenos: 0, preventa: 0, reestrenos: 0 };
const cardWidth = 140; 

let peliculasPorTipo = { estrenos: [], preventa: [], reestrenos: [] };

document.addEventListener("DOMContentLoaded", () => {
  const toggleLogo = document.getElementById("toggleMenu");
  const menuItems = document.getElementById("menuItems");
  const sidebarPanel = document.getElementById("sidebarPanel");

  if (toggleLogo && menuItems && sidebarPanel) {
    toggleLogo.onclick = () => {
      menuItems.classList.toggle("hidden");
      sidebarPanel.classList.toggle("collapsed");
    };
  }

  cargarPeliculas();
});

async function cargarPeliculas() {
  const estrenosDiv = document.getElementById("carrusel-estrenos");
  const preventaDiv = document.getElementById("carrusel-preventa");
  const reestrenosDiv = document.getElementById("carrusel-reestrenos");

  estrenosDiv.innerHTML = "";
  preventaDiv.innerHTML = "";
  reestrenosDiv.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}/api/peliculas`);
    const peliculas = await res.json();

    if (!peliculas.length) {
      estrenosDiv.innerHTML = preventaDiv.innerHTML = reestrenosDiv.innerHTML = "<p>No hay películas disponibles.</p>";
      return;
    }

    const crearCard = (peli) => {
      const card = document.createElement("div");
      card.className = "pelicula-card";
      card.innerHTML = `
        <img src="${peli.cartelera_url}" alt="${peli.titulo}">
        <div class="info">
          <h3>${peli.titulo}</h3>
          <p><b>Clasificación:</b> ${peli.clasificacion}</p>
          <p><b>Duración:</b> ${peli.duracion} min</p>
        </div>
      `;
      card.onclick = () => verFunciones(peli.id_pelicula);
      return card;
    };

    peliculasPorTipo.estrenos = peliculas.filter(p => p.tipo === "estreno");
    peliculasPorTipo.preventa = peliculas.filter(p => p.tipo === "preventa");
    peliculasPorTipo.reestrenos = peliculas.filter(p => p.tipo === "reestreno");

    ["estrenos", "preventa", "reestrenos"].forEach(tipo => {
      const div = document.getElementById(`carrusel-${tipo}`);
      peliculasPorTipo[tipo].forEach(peli => div.appendChild(crearCard(peli)));
    });

  } catch (err) {
    console.error(err);
    estrenosDiv.innerHTML = preventaDiv.innerHTML = reestrenosDiv.innerHTML = "<p>Error cargando películas.</p>";
  }
}

function moveSlide(tipo, dir) {
  const slide = document.getElementById(`carrusel-${tipo}`);
  const peliculas = peliculasPorTipo[tipo];
  if (!slide || !peliculas.length) return;

  currentSlide[tipo] = (currentSlide[tipo] + dir + peliculas.length) % peliculas.length;

  slide.scrollLeft = currentSlide[tipo] * cardWidth;
}

