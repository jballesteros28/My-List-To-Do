import axios from "axios";

const API = 'https://my-list-to-do.onrender.com/tareas/'; // url base de datos

export const getTareas = () => axios.get(API);
export const createTarea = (data) =>
  axios.post(API, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
export const deleteTarea = (id) => axios.delete(`${API}${id}`);
export const updateTarea = (id, data) => axios.put(`${API}${id}`, data);
export const getTarea = (id) => axios.get(`${API}${id}`);