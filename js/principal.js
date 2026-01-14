const API_URL = "https://cinema-phovl-api.onrender.com";

let currentSlide = 0;
const cardWidth = 185;

/* ================= SIDEBAR ================= */
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

/* ================= CARTELERA ================= */
async function cargarPeliculas() {
  try {
    const res = await fetch(`${API_URL}/api/peliculas`);
    const peliculas = await res.json();

    if (!Array.isArray(peliculas)) return;

    const slide = document.getElementById("carouselEstrenos");
    if (!slide) {
      console.error("❌ No existe carouselEstrenos");
      return;
    }

    slide.innerHTML = "";
    currentSlide = 0;

    peliculas.forEach(p => {

      const card = document.createElement("div");
      card.className = "movie-container";

      card.innerHTML = `
        <img src="${p.cartelera_url}" alt="${p.titulo}">
        <div class="overlay">
          <strong>${p.titulo}</strong><br>
          Clasificación: ${p.clasificacion}<br>
          Duración: ${p.duracion} min<br><br>
          ${p.sinopsis}<br><br>
        </div>
      `;

      slide.appendChild(card);
    });

  } catch (error) {
    console.error("❌ Error cargando cartelera:", error);
  }
}

/* ================= NAVEGACIÓN ================= */
function verFunciones(id_pelicula) {
  localStorage.setItem("id_pelicula", id_pelicula);
  window.location.href = "horarios.html";
}

/* ================= CARRUSEL ================= */
function moveSlide(dir) {
  const slide = document.getElementById("carouselEstrenos");
  if (!slide) return;

  const total = slide.children.length;
  if (total === 0) return;

  currentSlide += dir;

  if (currentSlide < 0) currentSlide = total - 1;
  if (currentSlide >= total) currentSlide = 0;

  slide.style.transform = `translateX(${-currentSlide * cardWidth}px)`;
}
