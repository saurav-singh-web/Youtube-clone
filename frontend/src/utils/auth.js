export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}

