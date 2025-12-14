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
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });

  // Store JWT securely in HttpOnly cookie
  cookies().set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return data;
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
