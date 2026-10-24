
import axios from "axios";

const API_URL = "http://localhost:8080/api/venues";

// Get all venues
export const getVenues = async () => {
  return axios.get(API_URL);
};

// Get a venue by ID
export const getVenueById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Create a venue
export const createVenue = async (venue) => {
  return axios.post(API_URL, venue);
};

// Update a venue
export const updateVenue = async (id, venue) => {
  return axios.put(`${API_URL}/${id}`, venue);
};

// Delete a venue
export const deleteVenue = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
