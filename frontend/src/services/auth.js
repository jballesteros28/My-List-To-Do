import { API_URL } from "./api";

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });   
  if (!response.ok) throw new Error("Login fallido");
  return await response.json();
}

export async function register(username, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error("Registro fallido");
  return await response.json();
}
