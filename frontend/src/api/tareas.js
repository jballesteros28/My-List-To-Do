import axios from "axios";

const API = 'https://my-list-to-do.onrender.com/tareas/';

export const getTareas = (token) =>
  axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createTarea = (data, token) =>
  axios.post(API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

export const deleteTarea = (id, token) =>
  axios.delete(`${API}${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateTarea = (id, data, token) =>
  axios.put(`${API}${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getTarea = (id, token) =>
  axios.get(`${API}${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });