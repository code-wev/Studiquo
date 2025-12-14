"use server";

import { apiFetch } from "@/lib/fetcher";
import { cookies } from "next/headers";

/* ======================
   Register
====================== */
export async function registerAction(formData) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      dbsLink: formData.dbsLink,
      referralSource: formData.referralSource,
    }),
  });
}

/* ======================
   Login
====================== */
export async function loginAction(formData) {
  const response = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });

  console.log("LOGIN RESPONSE:", response);

  const token = response?.token || response?.data?.token;

  if (!token) {
    throw new Error("JWT token not returned from API");
  }

  const cookieStore = await cookies();

  cookieStore.set("token", String(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });

  return response;
}

/* ======================
   Logout
====================== */
export async function logoutAction() {
  cookies().delete("token");
  return { message: "Logged out successfully" };
}

/* ======================
   Forgot Password
====================== */
export async function forgotPasswordAction(email) {
  return apiFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/* ======================
   Reset Password
====================== */
export async function resetPasswordAction(data) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      email: data.email,
      token: data.token,
      newPassword: data.newPassword,
    }),
  });
}

/* ======================
   Change Password (Authenticated)
====================== */
export async function changePasswordAction(data) {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  return apiFetch("/auth/change-password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    }),
  });
}
