// // src/hooks/useVideos.ts
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/utils/supabase";
// import { VideoType } from "@/constants/Types";

// export interface UseVideosResult {
//   categories: string[];
//   videosByCategory: Record<string, VideoType[]>;
// }

// export function useVideos(language: string) {
//   const query = useQuery<VideoType[], Error>({
//     // 1. put your queryKey here
//     queryKey: ["videos", language],
//     // 2. put your queryFn here
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("videos")
//         .select("*")
//         .eq("language_code", language)
//         .order("created_at", { ascending: false });

//       if (error) throw error;
//       return data ?? [];
//     },
//     enabled: Boolean(language),
//     staleTime: 5 * 60 * 1000,
//     retry: 1,
//   });

//   // grouping logic remains the same...
//   const videos = query.data ?? [];
//   const videosByCategory = videos.reduce<Record<string, VideoType[]>>(
//     (acc, vid) => {
//       (acc[vid.category] ||= []).push(vid);
//       return acc;
//     },
//     {}
//   );
//   const categories = Object.keys(videosByCategory);

//   return {
//     ...query,
//     categories,
//     videosByCategory,
//   } as const satisfies UseVideosResult & typeof query;
// }


import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { UseVideosResultType, VideoType } from "@/constants/Types"; 

export function useVideos(language: string) {
  const query = useQuery<VideoType[], Error>({
    queryKey: ["videos", language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("language_code", language)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(language),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const videos = query.data ?? [];
  const videosByCategory = videos.reduce<Record<string, VideoType[]>>(
    (acc, vid) => {
      (acc[vid.video_category] ||= []).push(vid);
      return acc;
    },
    {}
  );

  const categories = Object.keys(videosByCategory);

  return {
    ...query,
    categories,
    videosByCategory,
  } as const satisfies UseVideosResultType & typeof query;
}
