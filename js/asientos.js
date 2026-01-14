const distribucion = {
  "A": 12,
  "B": 12,
  "C": 12,
  "D": 12,
  "E": 12,
  "F": 12,
  "G": 12,
  "H": 12,
  "I": 12,
  "J": 12,
  "K": 12,
  "L": 12
};


const datos = JSON.parse(localStorage.getItem("boletos")) || {ninos:0, adultos:0, estudiantes:0, mayores:0};
const total = (+datos.ninos) + (+datos.adultos) + (+datos.estudiantes) + (+datos.mayores);

document.getElementById("infoBoletos").textContent =
  "Boletos seleccionados: " + total;

let ocupados = JSON.parse(localStorage.getItem("asientosOcupados")) || [];
let seleccionados = [];

function generarSala(){
  const sala = document.getElementById("sala");

  for(const fila in distribucion){
    const numAsientos = distribucion[fila];

    const filaDiv = document.createElement("div");
    filaDiv.classList.add("fila");

    const label = document.createElement("span");
    label.classList.add("fila-label");
    label.textContent = fila;
    filaDiv.appendChild(label);

    for(let n=1; n<=numAsientos; n++){
      const seat = document.createElement("div");
      seat.classList.add("seat");
      seat.textContent = n;

      const id = `${fila}${n}`;
      seat.dataset.id = id;

      if(ocupados.includes(id)){
        seat.classList.add("occupied");
      }

      seat.onclick = ()=>toggleSeat(seat);

      filaDiv.appendChild(seat);
    }

    sala.appendChild(filaDiv);
  }
}

function toggleSeat(seat){
  const id = seat.dataset.id;

  if(seat.classList.contains("occupied"))
    return;

  if(seat.classList.contains("selected")){
    seat.classList.remove("selected");
    seleccionados = seleccionados.filter(s=>s!==id);
  } else {
    if(seleccionados.length < total){
      seat.classList.add("selected");
      seleccionados.push(id);
    }
  }
}

function confirmar(){
  if(seleccionados.length !== total){
    alert("Debe seleccionar exactamente " + total + " asientos.");
    return;
  }

  localStorage.setItem("asientosTemporal", JSON.stringify(seleccionados));

  window.location.href = "pago.html";
}

generarSala();