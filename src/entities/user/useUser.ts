import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  getCurrentUser,
  LoginPayload,
  logout as apiLogout,
  User,
  login as apiLogin,
} from '../../shared/api/auth.ts';
import { useUserStore } from './userStore.ts';

export const useUser = () => {
  const { user, setUser } = useUserStore();
  const { data, isLoading, refetch } = useQuery<User | null, Error>({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (data !== undefined) {
      setUser(data);
    }
  }, [data, setUser]);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  const signIn = async (payload: LoginPayload) => {
    await apiLogin(payload);
    await refetch(); // Ensure the state is fresh
  };

  return {
    user,
    isLoading,
    refetch,
    logout,
    signIn,
  };
};
