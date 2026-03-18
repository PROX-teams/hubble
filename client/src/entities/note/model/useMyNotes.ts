import { useQuery } from '@tanstack/react-query';
import { getMyNotes } from '../api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore'; 

export const useMyNotes = (page = 0, size = 100) => {
  const { isLoggedIn } = useAuthStore()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myNotes', page, size],
    queryFn: () => getMyNotes(page, size),
    enabled: isLoggedIn,
  });

  return {
    notes: data?.content || [],
    totalElements: data?.totalElements || 0,
    isLoading,
    isError,
    error,
  };
};
