import { store } from '../store';

export function getAuthUserRole() {
  return store.getState().auth.user?.role;
}

export function getApiEndPoints() {
  return getAuthUserRole() === 'admin' ? '/admin/' : '/';
}
