async function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) {
    alert("Error en el formulario");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

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

    // 🔐 Guardar sesión correctamente según tu API
    localStorage.setItem("token", data.token);
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

function goToRegister() {
  window.location.href = "register.html";
}
