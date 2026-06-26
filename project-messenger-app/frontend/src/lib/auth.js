import { writable } from 'svelte/store';

export const currentUser = writable(null);

export function logout() {
  localStorage.removeItem('token');
  currentUser.set(null);
}