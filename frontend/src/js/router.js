
export function getCurrentRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "") || "dashboard";
  const [path, query = ""] = hash.split("?");

  if (path.startsWith("ticket/")) {
    return {
      name: "ticket-detail",
      id: decodeURIComponent(path.slice("ticket/".length)),
      query,
    };
  }

  const allowed = [
    "login",
    "register",
    "dashboard",
    "tickets",
    "ticket-create",
    "notifications",
    "categories",
    "users",
    "profile",
  ];

  return {
    name: allowed.includes(path) ? path : "dashboard",
    query,
  };
}

export function navigate(route) {
  window.location.hash = route;
}
