/**
 * Decode JWT payload safely
 * @param {string} token
 * @returns {object|null}
 */
export function decodeJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

/**
 * Check if JWT is valid (not expired)
 * @param {string} token
 * @returns {boolean}
 */
export function isTokenValid(token) {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;

  return payload.exp > Math.floor(Date.now() / 1000);
}

/**
 * Get auth user from cookies (client-side)
 * @returns {{ id: string, role: string } | null}
 */
export function getAuthUser() {
  if (typeof document === "undefined") return null;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token || !isTokenValid(token)) return null;

  const payload = decodeJwt(token);

  return {
    id: payload.sub,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    role: payload.role,
    exp: payload.exp,
  };
}

/**
 * Role checker
 * @param {string} requiredRole
 * @returns {boolean}
 */
export function hasRole(requiredRole) {
  const user = getAuthUser();
  return user?.role === requiredRole;
}
