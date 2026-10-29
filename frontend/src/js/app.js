
import "../css/main.css";

import { apiGet } from "./config/api.js";
import { login, register, logout } from "./services/auth.service.js";
import { getToken, getStoredUser, setSession, clearSession } from "./utils/storage.js";
import { getCurrentRoute, navigate } from "./router.js";
import { renderSidebar } from "./components/sidebar.js";
import { renderHeader } from "./components/header.js";
import { showToast } from "./components/toast.js";
import { listNotifications } from "./services/notifications.service.js";

import { renderLogin } from "./pages/login.js";
import { renderRegister } from "./pages/register.js";
import { renderDashboard } from "./pages/dashboard.js";
import { renderTicketsList } from "./pages/tickets-list.js";
import { renderTicketCreate, submitTicketCreate } from "./pages/ticket-create.js";
import {
  renderTicketDetail,
  submitComment,
  submitTicketUpdate,
} from "./pages/ticket-detail.js";
import { renderNotifications } from "./pages/notifications.js";
import { renderCategories } from "./pages/categories.js";
import { renderUsers } from "./pages/users.js";
import { renderProfile } from "./pages/profile.js";
import { markNotificationRead } from "./services/notifications.service.js";

const app = document.querySelector("#app");

let currentUser = getStoredUser();
let renderSequence = 0;
let unreadNotificationsCount = 0;

function showFormError(id, message) {
  const element = document.getElementById(id);
  if (!element) return;

  element.textContent = message;
  element.className = message ? "error-message" : "";
}

function normalizeUserResponse(response) {
  return response?.user || response?.data?.user || response?.data || response;
}

function renderAuthPage(route) {
  app.innerHTML = route === "register" ? renderRegister() : renderLogin();
}

function renderShell(route) {
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar(currentUser, route.name, unreadNotificationsCount)}
      <div class="main-area">
        ${renderHeader(route.name, currentUser, unreadNotificationsCount)}
        <main class="page-content" id="page-content"></main>
      </div>
    </div>
  `;

  return document.querySelector("#page-content");
}

async function verifySession() {
  if (!getToken()) {
    currentUser = null;
    return false;
  }

  try {
    const response = await apiGet("/auth/me");
    currentUser = normalizeUserResponse(response);

    if (!currentUser || !currentUser.id || !currentUser.role) {
      throw new Error("La respuesta de /auth/me no contiene los datos de usuario esperados.");
    }

    setSession(getToken(), currentUser);
    return true;
  } catch {
    clearSession();
    currentUser = null;
    return false;
  }
}

async function renderCurrentPage() {
  const sequence = ++renderSequence;
  const route = getCurrentRoute();

  if (route.name === "login" || route.name === "register") {
    if (getToken() && await verifySession()) {
      navigate("dashboard");
      return;
    }

    renderAuthPage(route.name);
    return;
  }

  const authenticated = await verifySession();

  if (sequence !== renderSequence) return;

  if (!authenticated) {
    navigate("login");
    renderAuthPage("login");
    return;
  }

  if (route.name === "users" && currentUser.role !== "admin") {
    navigate("dashboard");
    showToast("Esta sección es exclusiva para administradores.", "error");
    return;
  }

  try {
  const response = await listNotifications();
  const notifications = Array.isArray(response.data) ? response.data : [];

  unreadNotificationsCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;
} catch {
  // Si falla la consulta, la aplicación sigue funcionando.
  unreadNotificationsCount = 0;
}

if (sequence !== renderSequence) return;

const container = renderShell(route);

  try {
    switch (route.name) {
      case "dashboard":
        await renderDashboard(container);
        break;

      case "tickets":
        await renderTicketsList(container);
        break;

      case "ticket-create":
        await renderTicketCreate(container);
        break;

      case "ticket-detail":
        await renderTicketDetail(container, route.id, currentUser);
        break;

      case "notifications":
        await renderNotifications(container);
        break;

      case "categories":
        await renderCategories(container, currentUser);
        break;

      case "users":
        await renderUsers(container);
        break;

      case "profile":
        renderProfile(container, currentUser);
        break;

      default:
        await renderDashboard(container);
    }
  } catch (error) {
    if (sequence !== renderSequence) return;
    container.innerHTML = "";
    const message = document.createElement("div");
    message.className = "error-message";
    message.textContent = error.message || "No se pudo cargar la página.";
    container.append(message);
  }
}

window.addEventListener("hashchange", renderCurrentPage);

app.addEventListener("click", async (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) {
    navigate(routeButton.dataset.route);
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const { action } = actionButton.dataset;

  if (action === "logout") {
    logout();
    currentUser = null;
    navigate("login");
    renderAuthPage("login");
    showToast("Sesión cerrada.", "success");
  }

  if (action === "reload-page") {
    await renderCurrentPage();
  }

  if (action === "mark-notification-read") {
    actionButton.disabled = true;

    try {
      await markNotificationRead(actionButton.dataset.id);
      showToast("Notificación marcada como leída.", "success");
      await renderCurrentPage();
    } catch (error) {
      actionButton.disabled = false;
      showToast(error.message, "error");
    }
  }
});

app.addEventListener("submit", async (event) => {
  const form = event.target;
  event.preventDefault();

  if (form.id === "login-form") {
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    showFormError("login-error", "");

    try {
      await login({
        email: form.elements.email.value.trim(),
        password: form.elements.password.value,
      });

      await verifySession();

      if (!currentUser) {
        throw new Error("Se inició sesión, pero no se pudo verificar el usuario.");
      }

      showToast("Sesión iniciada correctamente.", "success");
      navigate("dashboard");
    } catch (error) {
      showFormError("login-error", error.message);
    } finally {
      submitButton.disabled = false;
    }

    return;
  }

  if (form.id === "register-form") {
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    showFormError("register-error", "");

    try {
      await register({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        password: form.elements.password.value,
      });

      showToast("Cuenta creada. Ahora puedes iniciar sesión.", "success");
      navigate("login");
    } catch (error) {
      showFormError("register-error", error.message);
    } finally {
      submitButton.disabled = false;
    }

    return;
  }

  if (form.id === "ticket-filter-form") {
    const data = new FormData(form);
    const query = new URLSearchParams();

    for (const key of ["status", "priority", "search"]) {
      const value = String(data.get(key) || "").trim();
      if (value) query.set(key, value);
    }

    navigate(`tickets${query.size ? `?${query.toString()}` : ""}`);
    return;
  }

  if (form.id === "ticket-create-form") {
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    showFormError("ticket-create-error", "");

    try {
      const result = await submitTicketCreate(form);
      const ticket = result.ticket || result.data || result;

      showToast("Ticket creado correctamente.", "success");
      navigate(`ticket/${encodeURIComponent(ticket.id)}`);
    } catch (error) {
      showFormError("ticket-create-error", error.message);
    } finally {
      button.disabled = false;
    }

    return;
  }

  if (form.id === "ticket-comment-form") {
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;

    try {
      const route = getCurrentRoute();
      await submitComment(route.id, form);
      showToast("Comentario enviado.", "success");
      await renderCurrentPage();
    } catch (error) {
      const errorElement = document.querySelector("#ticket-detail-error");
      if (errorElement) {
        errorElement.className = "error-message";
        errorElement.textContent = error.message;
      }
    } finally {
      button.disabled = false;
    }

    return;
  }

  if (form.id === "ticket-update-form") {
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;

    try {
      const route = getCurrentRoute();
      await submitTicketUpdate(route.id, form, currentUser);
      showToast("Ticket actualizado.", "success");
      await renderCurrentPage();
    } catch (error) {
      const errorElement = document.querySelector("#ticket-detail-error");
      if (errorElement) {
        errorElement.className = "error-message";
        errorElement.textContent = error.message;
      }
    } finally {
      button.disabled = false;
    }
  }
});

renderCurrentPage();
