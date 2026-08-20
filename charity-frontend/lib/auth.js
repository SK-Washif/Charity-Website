import { api } from "@/lib/api";

export async function login(email, password) {
  return api.post("/api/auth/login", { email, password });
}

export async function logout() {
  return api.post("/api/auth/logout");
}

export async function getCurrentAdmin() {
  return api.get("/api/auth/me");
}
