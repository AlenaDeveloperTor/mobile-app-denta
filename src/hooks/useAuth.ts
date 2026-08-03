import { useAuthStore } from '@/store/useAuthStore';

/** Удобный доступ к auth-стору */
export function useAuth() {
  const { user, isLoading, isAuthenticated, checkAuth, requestCode, verifyCode, logout } =
    useAuthStore();

  return { user, isLoading, isAuthenticated, checkAuth, requestCode, verifyCode, logout };
}
