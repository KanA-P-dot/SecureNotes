import axios from "axios";
import { encryptText, decryptText, getStoredEncryptionKey } from "../utils/crypto";

const API_URL = "http://localhost:3000/api";

export const getToken = () => localStorage.getItem("token");

export const fetchNotes = async () => {
  const res = await axios.get(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  
  // dechiffre les notes reçues
  const key = getStoredEncryptionKey();
  if (key) {
    return res.data.map(note => ({
      ...note,
      content: decryptText(note.content, key)
    }));
  }
  
  return res.data;
};

export const addNote = async (content) => {
  // chiffre avant envoi
  const key = getStoredEncryptionKey();
  const finalContent = key ? encryptText(content, key) : content;
  
  const res = await axios.post(
    `${API_URL}/notes`,
    { content: finalContent },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  
  // retourne avec contenu original pour affichage
  return { ...res.data, content };
};

export const editNote = async (id, content) => {
  // chiffre avant envoi
  const key = getStoredEncryptionKey();
  const finalContent = key ? encryptText(content, key) : content;
  
  const res = await axios.put(
    `${API_URL}/notes/${id}`,
    { content: finalContent },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  
  return { ...res.data, content };
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
