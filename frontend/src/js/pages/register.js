
export function renderRegister() {
  return `
    <main class="auth-page">
      <section class="auth-intro">
        <div class="brand">
          <span class="brand-mark">H</span>
          <span class="brand-name">HelpDesk</span>
        </div>
        <h1>Tu espacio para resolver solicitudes.</h1>
        <p>Crea tu cuenta para registrar y seguir tus tickets de soporte.</p>
      </section>

      <section class="auth-panel">
        <div class="auth-card">
          <h2>Crear una cuenta</h2>
          <p>Completa los datos para registrarte.</p>

          <form id="register-form">
            <div class="form-field">
              <label for="register-name">Nombre completo</label>
              <input id="register-name" name="name" autocomplete="name"
                minlength="2" required />
            </div>

            <div class="form-field">
              <label for="register-email">Correo electrónico</label>
              <input id="register-email" name="email" type="email"
                autocomplete="email" required />
            </div>

            <div class="form-field">
              <label for="register-password">Contraseña</label>
              <input id="register-password" name="password" type="password"
                autocomplete="new-password" minlength="8" required />
            </div>

            <div id="register-error" role="alert"></div>

            <button class="button button-primary" type="submit" style="width:100%">
              Crear cuenta
            </button>
          </form>

          <div class="auth-switch">
            ¿Ya tienes cuenta?
            <button type="button" data-route="login">Iniciar sesión</button>
          </div>
        </div>
      </section>
    </main>
  `;
}
