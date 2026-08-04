/**
 * Custom React Auth Hook (SPR-302 / ARCH-004)
 */

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import authService, { UserProfile } from './authService';
import { STORAGE_KEYS } from '../../constants';
import { logger } from '../../lib/logger';
import { parseError } from '../../lib/errorHandler';

export function useAuth() {
  const { user, token, setUser, setToken, logout: storeLogout } = useStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user session on mount
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (isMounted && res.success && res.data?.user) {
          setUser(res.data.user as any);
        }
      } catch (err) {
        logger.warn('Initial session sync failed', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [setUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.login({ email, password });
        if (res.success && res.data) {
          setToken(res.data.accessToken);
          setUser(res.data.user as any);
          if (res.data.refreshToken) {
            localStorage.setItem('dos_refresh_token', res.data.refreshToken);
          }
          logger.info(`User logged in: ${res.data.user.id}`);
          setLoading(false);
          return true;
        }
        setError(res.message || 'Login failed');
        setLoading(false);
        return false;
      } catch (err: any) {
        const parsed = parseError(err);
        setError(parsed.message);
        setLoading(false);
        return false;
      }
    },
    [setToken, setUser]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.register({ name, email, password });
        if (res.success && res.data) {
          setToken(res.data.accessToken);
          setUser(res.data.user as any);
          if (res.data.refreshToken) {
            localStorage.setItem('dos_refresh_token', res.data.refreshToken);
          }
          logger.info(`User registered: ${res.data.user.id}`);
          setLoading(false);
          return true;
        }
        setError(res.message || 'Registration failed');
        setLoading(false);
        return false;
      } catch (err: any) {
        const parsed = parseError(err);
        setError(parsed.message);
        setLoading(false);
        return false;
      }
    },
    [setToken, setUser]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      logger.warn('Backend logout call failed', err);
    } finally {
      localStorage.removeItem('dos_refresh_token');
      storeLogout();
      setLoading(false);
    }
  }, [storeLogout]);

  return {
    user: user as UserProfile | null,
    isAuthenticated: Boolean(token || localStorage.getItem(STORAGE_KEYS.TOKEN)),
    loading,
    error,
    login,
    register,
    logout,
  };
}

export default useAuth;
