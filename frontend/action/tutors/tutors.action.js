"use server";

import { apiFetch } from "@/lib/fetcher";

/* ======================
   Search / Get Tutors
   GET /tutors
   Public Api
====================== */

export async function getOurTutors(query = {}) {
  const params = new URLSearchParams();

  if (query.subject) params.append("subject", query.subject);
  if (query.maxHourlyRate !== undefined)
    params.append("maxHourlyRate", String(query.maxHourlyRate));
  if (query.minRating !== undefined)
    params.append("minRating", String(query.minRating));
  if (query.firstName) params.append("firstName", query.firstName);
  if (query.lastName) params.append("lastName", query.lastName);
  if (query.bio) params.append("bio", query.bio);

  const queryString = params.toString();
  const endpoint = queryString ? `/tutors/?${queryString}` : "/tutors";

  return apiFetch(endpoint, {
    method: "GET",
    cache: "no-store", // always fetch fresh tutors
  });
}

/* ======================
   Get Tutor Public Profile
   GET /tutors/:tutorId
   Public Api
====================== */
export async function getTutorById(tutorId) {
  if (!tutorId) {
    throw new Error("Tutor ID is required");
  }

  return apiFetch(`/tutors/${tutorId}`, {
    method: "GET",
  });
}

/* ======================
   Get Tutor Reviews
   GET /tutors/:tutorId/reviews
   Public Api
====================== */
export async function getTutorReviews(tutorId, query = {}) {
  if (!tutorId) {
    throw new Error("Tutor ID is required");
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const endpoint = queryString
    ? `/tutors/${tutorId}/reviews?${queryString}`
    : `/tutors/${tutorId}/reviews`;

  return apiFetch(endpoint, {
    method: "GET",
  });
}

/* ======================
   Get Tutor Availability
   GET /tutors/:tutorId/availability
   Public Api
====================== */
export async function getTutorAvailability(tutorId) {
  if (!tutorId) {
    throw new Error("Tutor ID is required");
  }

  return apiFetch(`/tutors/${tutorId}/availability`, {
    method: "GET",
  });
}
