export interface User {
  id: number;
  username: string;
  role: 'admin' | 'student';
  // Note: The password is intentionally not included here,
  // as the backend should never send it back to the frontend.
}
