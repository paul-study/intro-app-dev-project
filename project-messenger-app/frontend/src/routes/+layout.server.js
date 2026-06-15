// @ts-nocheck
export async function load({ locals }) {
  // Pass the user object from hooks.server.js down to the client layout
  return {
    user: locals.user
  };
}