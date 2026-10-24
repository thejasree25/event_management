
import api from "./axios.js";

export const getEvents = () => api.get("/events");

export const getEvent = (id) => api.get(`/events/${id}`);

export const addEvent = (eventData) =>
  api.post("/events", eventData);

export const updateEvent = (id, eventData) =>
  api.put(`/events/${id}`, eventData);

export const deleteEvent = (id) =>
  api.delete(`/events/${id}`);

export const createBooking = (bookingData) =>
  api.post("/registrations", bookingData);

export const makeDemoPayment = (paymentData) =>
  api.post("/payments/demo", paymentData);
