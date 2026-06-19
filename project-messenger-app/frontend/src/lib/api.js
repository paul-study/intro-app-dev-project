// @ts-nocheck
// const API_URL = import.meta.env.VITE_API_URL;

const API_URL = "http://localhost:3000"

export async function apiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  
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