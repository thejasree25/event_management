
import api from "./axios.js";

// Admin dashboard statistics
export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Get all events
export const getAdminEvents = async () => {
  const response = await api.get("/admin/events");
  return response.data;
};

// Get all users
export const getAdminUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Get all bookings
export const getAdminBookings = async () => {
  const response = await api.get("/admin/bookings");
  return response.data;
};

// Get all registrations
export const getAdminRegistrations = async () => {
  const response = await api.get("/registrations");
  return response.data;
};

// Delete a registration
export const deleteAdminRegistration = async (id) => {
  const response = await api.delete(`/registrations/${id}`);
  return response.data;
};

// Get all payments
export const getAdminPayments = async () => {
  const response = await api.get("/payments");
  return response;
};
