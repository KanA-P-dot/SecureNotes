import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getToken = () => localStorage.getItem("token");

export const fetchNotes = async () => {
  const res = await axios.get(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const addNote = async (content) => {
  const res = await axios.post(
    `${API_URL}/notes`,
    { content },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};

export const editNote = async (id, content) => {
  const res = await axios.put(
    `${API_URL}/notes/${id}`,
    { content },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return res.data;
};

export const rmNote = async (id) => {
  const res = await axios.delete(`${API_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  return res.data;
};

export const register = async (email, password) => {
  const res = await axios.post(`${API_URL}/register`, { email, password });
  return res.data;
};
