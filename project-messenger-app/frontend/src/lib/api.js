// @ts-nocheck
<<<<<<< HEAD
const API_URL = import.meta.env.VITE_API_URL;

// const API_URL = "http://localhost:3000"
=======
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
>>>>>>> 00db62fd3712e51c3b0574e24d202bc2daaa3ae9

export async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  const data = await response.json();

  if (!response.ok) {
    if (data.errors) {
      const messages = data.errors.map((e) => e.message).join(', ');
      throw new Error(messages);
    }
    throw new Error(data.message || response.statusText);
  }

  return data;
}