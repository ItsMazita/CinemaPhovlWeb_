const precios = {
    ninos: 55,
    adultos: 85,
    estudiantes: 65,
    mayores: 60
  };

  const toggleLogo = document.getElementById("toggleMenu");
  const menuItems = document.getElementById("menuItems");
  const sidebarPanel = document.getElementById("sidebarPanel");

  toggleLogo.onclick = ()=>{
    menuItems.classList.toggle("hidden");
    sidebarPanel.classList.toggle("collapsed");
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
    let total = 
      parseInt(ninos.textContent) * precios.ninos +
      parseInt(adultos.textContent) * precios.adultos +
      parseInt(estudiantes.textContent) * precios.estudiantes +
      parseInt(mayores.textContent) * precios.mayores;

    document.getElementById("total").textContent = `$${total} MXN`;
  }

  function guardarBoletos(){
    const datos = {
      ninos: parseInt(document.getElementById("ninos").textContent),
      adultos: parseInt(document.getElementById("adultos").textContent),
      estudiantes: parseInt(document.getElementById("estudiantes").textContent),
      mayores: parseInt(document.getElementById("mayores").textContent)
    };

    localStorage.setItem("boletos", JSON.stringify(datos));
    window.location.href = "seleccion_asientos.html";
  }