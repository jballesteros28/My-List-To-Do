import axios from "axios";

const API = "https://my-list-to-do.onrender.com";

export const loginUsuario = async (email, password) => {
  const res = await axios.post(`${API}/login`, new URLSearchParams({
    username: email,
    password: password,
  }));
  return res.data;
};

export const registrarUsuario = async (email, password) => {
  const res = await axios.post(`${API}/registro`, {
    email,
    password
  });
  return res.data;
};