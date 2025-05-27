import { useAuthProviderContext } from '@/contexts/auth-provider';
import { getUSerTheme } from '@/http/principal-service';
import { UserTheme } from '@/types/model/user-theme';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function useUserTheme() {
    const {principal} = useAuthProviderContext();
    return useQuery<UserTheme>({
        queryKey: ['user-theme', principal.id],
        queryFn: () => getUSerTheme(principal?.id, "CRM").then((res) => res?.data?.data),
        enabled: !!principal?.id
    })
} 