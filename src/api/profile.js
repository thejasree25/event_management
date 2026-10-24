import api from "./axios.js";

// Fetch the logged-in user's profile.
// Your backend must implement GET /users/me.
export const getProfile = () => api.get("/users/me");

// Update the logged-in user's profile.
// Your backend must implement PUT /users/me.
export const updateProfile = (profileData) =>
  api.put("/users/me", profileData);