    const savedName = localStorage.getItem("registeredName");
    const savedEmail = localStorage.getItem("registeredEmail");

    document.getElementById("username").textContent = savedName || "Invitado";
    document.getElementById("email").textContent = savedEmail || "correo@ejemplo.com";

    const historyList = document.getElementById('purchase-history');
    let cart = JSON.parse(localStorage.getItem('cart_s1')) || [];

    if(cart.length === 0){
      historyList.innerHTML = "<li>No hay compras registradas</li>";
    } else {
      cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - $${item.price.toFixed(2)} MXN`;
        historyList.appendChild(li);
      });
    }