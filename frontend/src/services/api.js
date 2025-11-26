import axios from "axios";

// frontend/src/services/api.js
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// EMPLOYEES
export const fetchEmployees = async () => {
  const res = await axios.get(`${BASE_URL}/employees`);
  return res.data;
};

export const createEmployee = async (data) => {
  const res = await axios.post(`${BASE_URL}/employees`, data);
  return res.data;
};

export const updateEmployee = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/employees/${id}`, data);
  return res.data;
};

export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${BASE_URL}/employees/${id}`);
  return res.data;
};


// TASKS  ✔ adding missing function here
export const fetchTasks = async () => {
  const res = await axios.get(`${BASE_URL}/tasks`);
  return res.data;
};

export const createTask = async (data) => {
  const res = await axios.post(`${BASE_URL}/tasks`, data);
  return res.data;
};

export const updateTask = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/tasks/${id}`, data);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await axios.delete(`${BASE_URL}/tasks/${id}`);
  return res.data;
};
