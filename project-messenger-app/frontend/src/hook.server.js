// @ts-nocheck
export async function handle({ event, resolve }) {
  // 1. Get the session token from cookies or localstorage
  const token = event.cookies.get('session_token');

  if (token) {
    // 2. Fetch or decrypt user details (mock database check)
    event.locals.user = {
      id: '123',
      username: 'SvelteCoder',
      email: 'user@example.com'
    };
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}