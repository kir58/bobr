import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getCurrentUser, LoginPayload, logout as apiLogout, User, login as apiLogin } from '../../shared/api/auth.ts';
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
    await refetch(); // This will trigger the query to run again and set user to null
  };

  const signIn = async (payload: LoginPayload) => {
    const response = await apiLogin(payload);
    setUser(response.user);
    await refetch(); // Ensure the state is fresh
    return response.user;
  };

  return {
    user,
    isLoading,
    refetch,
    logout,
    signIn,
  };
};