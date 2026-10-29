
export function isAdmin(user) {
  return user?.role === "admin";
}

export function canManageUsers(user) {
  return isAdmin(user);
}

export function canManageTicket(ticket, user) {
  if (!ticket || !user) return false;

  return (
    isAdmin(user) ||
    Number(ticket.created_by) === Number(user.id)
  );
}
