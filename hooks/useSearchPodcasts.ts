// File: @/utils/searchPodcasts.ts

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/utils/supabase';
import { PodcastType } from '@/constants/Types';

export function useSearchPodcasts(searchTerm: string) {
  return useQuery<PodcastType[], Error>(
    // 1) Query key includes the search term for caching
    ['search', 'podcasts', searchTerm],

    // 2) Query function: only runs when searchTerm.trim() !== ''
    async () => {
      if (!searchTerm.trim()) {
        return [];
      }

      // 3) Supabase query: search title OR description in "episodes" table
      const { data, error } = await supabase
        .from<PodcastType>('episodes')
        .select('*')
        .ilike('title', `%${searchTerm}%`)
        .or(`description.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data ?? [];
    },

    // 4) Options object (v5 style)
    {
      enabled: Boolean(searchTerm.trim()),
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}
