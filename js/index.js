async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password }) 
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Correo o contraseña incorrectos");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("id_usuario", data.id_usuario);

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: data.name,
        email: data.email
      })
    );

    window.location.href = "Pagina Principal.html";

  } catch (error) {
    console.error("❌ Error login:", error);
    alert("No se pudo conectar con el servidor");
  }
}

localStorage.removeItem("tickets");
function goToRegister() {
  window.location.href = "register.html";
}
