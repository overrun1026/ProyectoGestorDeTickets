
export function renderLogin() {
  return `
    <main class="auth-page">
      <section class="auth-intro">
        <div class="brand">
          <span class="brand-mark">H</span>
          <span class="brand-name">HelpDesk</span>
        </div>
        <h1>El soporte que mantiene todo en movimiento.</h1>
        <p>
          Gestiona solicitudes, consulta su progreso y mantén
          las conversaciones del equipo en un solo lugar.
        </p>
      </section>

      <section class="auth-panel">
        <div class="auth-card">
          <h2>Bienvenido de nuevo</h2>
          <p>Inicia sesión para acceder a tu espacio de soporte.</p>

          <form id="login-form">
            <div class="form-field">
              <label for="login-email">Correo electrónico</label>
              <input id="login-email" name="email" type="email"
                autocomplete="email" required />
            </div>

            <div class="form-field">
              <label for="login-password">Contraseña</label>
              <input id="login-password" name="password" type="password"
                autocomplete="current-password" required />
            </div>

            <div id="login-error" role="alert"></div>

            <button class="button button-primary" type="submit" style="width:100%">
              Iniciar sesión
            </button>
          </form>

          <div class="auth-switch">
            ¿Todavía no tienes cuenta?
            <button type="button" data-route="register">Crear cuenta</button>
          </div>
        </div>
      </section>
    </main>
  `;
}
