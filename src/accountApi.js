export async function readSession() {
  return apiAccount("/api/auth/session");
}

export async function signUpAccount(email, password, displayName, returnTo = "/") {
  return apiAccount("/api/auth/signup", {
    method: "POST",
    body: { email, password, displayName, returnTo }
  });
}

export async function signInAccount(email, password) {
  return apiAccount("/api/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export async function exchangeAuthTokens(accessToken, refreshToken) {
  return apiAccount("/api/auth/exchange", {
    method: "POST",
    body: { accessToken, refreshToken }
  });
}

export async function requestPasswordReset(email, returnTo = "/") {
  return apiAccount("/api/auth/recover", {
    method: "POST",
    body: { email, returnTo }
  });
}

export async function updateAccountPassword(password) {
  return apiAccount("/api/auth/password", {
    method: "POST",
    body: { password }
  });
}

export async function signOutAccount() {
  return apiAccount("/api/auth/logout", { method: "POST" });
}

export async function readAccountSummary() {
  return apiAccount("/api/account");
}

async function apiAccount(path, options = {}) {
  const response = await fetch(path, {
    method: options.method || "GET",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Account service did not respond.");
  return payload;
}
