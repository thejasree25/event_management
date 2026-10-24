
import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getBookings = () =>
  axios.get(`${API_URL}/registrations`);

export const getUserBookings = (userId) =>
  axios.get(`${API_URL}/registrations/user/${userId}`);

export const getBooking = (registrationId) =>
  axios.get(`${API_URL}/registrations/${registrationId}`);

export const createBooking = ({ userId, eventId, quantity }) =>
  axios.post(`${API_URL}/registrations`, {
    userId: Number(userId),
    eventId: Number(eventId),
    quantity: Number(quantity),
  });

export const cancelBooking = (registrationId) =>
  axios.delete(`${API_URL}/registrations/${registrationId}`);

export const makeDemoPayment = ({ registrationId, simulateSuccess }) =>
  axios.post(`${API_URL}/payments/demo`, {
    registrationId: Number(registrationId),
    simulateSuccess: Boolean(simulateSuccess),
  });
