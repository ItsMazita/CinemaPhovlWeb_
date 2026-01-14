const msgBox = document.getElementById("welcomeBox");

async function handleRegister(e) {
  e.preventDefault();

  msgBox.textContent = "⏳ Registrando usuario...";

  const nombre = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono")
    ? document.getElementById("telefono").value.trim()
    : null;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!nombre || !email || !password) {
    msgBox.textContent = "❌ Completa todos los campos obligatorios";
    return;
  }

  if (password !== confirm) {
    msgBox.textContent = "❌ Las contraseñas no coinciden";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        email,
        telefono,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      msgBox.textContent = `❌ ${data.error || "Error al registrar usuario"}`;
      return;
    }

    msgBox.textContent = "✅ Registro exitoso 🎉 Redirigiendo al login...";

    setTimeout(() => {
      window.location.href = "index.html"; // login
    }, 1500);

  } catch (error) {
    console.error(error);
    msgBox.textContent = "❌ No se pudo conectar con el servidor";
  }
}
