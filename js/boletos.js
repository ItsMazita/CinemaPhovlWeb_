const API_URL = "https://cinema-phovl-api.onrender.com";
const infoFuncionDiv = document.getElementById("infoFuncion");

const precios = {
  ninos: 55,
  adultos: 85,
  estudiantes: 65,
  mayores: 60
};

function cambiar(id, amount){
  const span = document.getElementById(id);
  let valor = parseInt(span.textContent);
  valor += amount;
  if(valor < 0) valor = 0;
  span.textContent = valor;
  actualizarSubtotales();
  actualizarTotal();
}

function actualizarSubtotales(){
  document.getElementById("sub_ninos").textContent =
    "Subtotal: $" + (parseInt(ninos.textContent) * precios.ninos) + " MXN";
  document.getElementById("sub_adultos").textContent =
    "Subtotal: $" + (parseInt(adultos.textContent) * precios.adultos) + " MXN";
  document.getElementById("sub_estudiantes").textContent =
    "Subtotal: $" + (parseInt(estudiantes.textContent) * precios.estudiantes) + " MXN";
  document.getElementById("sub_mayores").textContent =
    "Subtotal: $" + (parseInt(mayores.textContent) * precios.mayores) + " MXN";
}

function actualizarTotal(){
  const total = 
    parseInt(ninos.textContent) * precios.ninos +
    parseInt(adultos.textContent) * precios.adultos +
    parseInt(estudiantes.textContent) * precios.estudiantes +
    parseInt(mayores.textContent) * precios.mayores;
  document.getElementById("total").textContent = `$${total} MXN`;
}

function guardarBoletos(){
  const datos = {
    ninos: parseInt(ninos.textContent),
    adultos: parseInt(adultos.textContent),
    estudiantes: parseInt(estudiantes.textContent),
    mayores: parseInt(mayores.textContent),
    funcion: localStorage.getItem("id_funcion"),
    sala: localStorage.getItem("nombre_sala"),
    sucursal: localStorage.getItem("id_sucursal"),
    fecha: localStorage.getItem("fecha"),
    idioma: localStorage.getItem("idioma_funcion")
  };
  localStorage.setItem("boletos", JSON.stringify(datos));
  window.location.href = "seleccion_asientos.html";
}

document.addEventListener("DOMContentLoaded", ()=>{
  mostrarInfoFuncion();
});
