import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { noteQueries } from './noteQueries';

export const useBookmarkList = (page = 0, size = 50) => {
    const { isLoggedIn } = useAuthStore();
    const queryOption = noteQueries.bookmarkList(page, size);

    const { data, isLoading, isError, error } = useQuery({
        ...queryOption,
        enabled: isLoggedIn,
    });

    return {
        bookmarkList: data?.content || [],
        totalElements: data?.totalElements || 0,
        isLoading,
        isError,
        error,
        isLoggedIn,
    };
};