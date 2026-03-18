import { getBookmarkedNotes } from '../api/note.api';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const useBookmarkList = () => {
    const { isLoggedIn } = useAuthStore()
    const { data, isLoading, isError, error  } = useQuery({
        queryKey: ['bookmarkedNotes'],
        queryFn: () => getBookmarkedNotes(0, 50), // 일단 상위 50개만 가져옴
        enabled: isLoggedIn,
    });

    return {
        bookmarkList: data?.content || [],
        totalElements: data?.totalElements || 0,
        isLoading,
        isError,
        error,
        isLoggedIn
    }
}