
export function renderLoader(message = "Cargando información...") {
  const loader = document.createElement("div");
  loader.className = "loading-state";
  loader.setAttribute("role", "status");

  const spinner = document.createElement("span");
  spinner.className = "spinner";
  spinner.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.textContent = message;

  loader.append(spinner, text);
  return loader;
}
