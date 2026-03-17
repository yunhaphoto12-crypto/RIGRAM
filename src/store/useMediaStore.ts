import { Media } from '@/types/media';
import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

interface MediaState {
  media: Media | null;
  mediaList: Media[];
  isLoading: boolean;
  error: string | null;

  fetchMediaList: (departmentId: string) => Promise<void>;
  // fetchMediaById: (mediaId: string) => Promise<void>;
  addMedia: (
    school_id: string,
    department_id: string,
    url: string | null,
    type: 'photo' | 'video',
    category: 'all' | 'team' | 'organization' | 'club' | 'event',
    video_thumbnail: string | null
  ) => Promise<void>;
  deleteMedia: (departmentId: string, mediaId: string) => Promise<boolean>;
}

export const useMediaStore = create<MediaState>((set) => ({
  media: null,
  mediaList: [],
  isLoading: false,
  error: null,

  /* 미디어 목록 불러오기 */
  fetchMediaList: async (departmentId) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('department_id', departmentId);

    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ mediaList: data || [], isLoading: false });
    }
  },

  /* 미디어 추가 */
  addMedia: async (school_id, department_id, url, type, category, video_thumbnail) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('media')
      .insert([{ school_id, department_id, url, type, category, video_thumbnail }])
      .single();

    if (error) {
      console.error('사진 또는 동영상 추가 중 오류가 발생했습니다. :', error);
      alert('사진 또는 동영상 추가 중 오류가 발생했습니다.');
      return;
    } else {
      set((state) => ({
        mediaList: [data, ...state.mediaList],
        isLoading: false,
      }));
    }
  },

  /* 미디어 삭제 */
  deleteMedia: async (departmentId, mediaId) => {
    set({ isLoading: true, error: null });

    try {
      const { data } = await supabase
        .from('media')
        .select('url, video_thumbnail')
        .eq('id', mediaId)
        .eq('department_id', departmentId)
        .single();

      /* Storage 파일 경로 추출 */
      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/`;
      const filePaths: string[] = [];

      const extractPath = (fullUrl?: string | null) => {
        if (!fullUrl) return null;
        if (!fullUrl.startsWith(baseUrl)) return null;
        return fullUrl.replace(baseUrl, '');
      };

      const mainPath = extractPath(data?.url);
      const thumbPath = extractPath(data?.video_thumbnail);

      if (mainPath) filePaths.push(mainPath);
      if (thumbPath) filePaths.push(thumbPath);

      /* Storage에서 파일 삭제 */
      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('media').remove(filePaths);
        if (storageError) console.warn('Storage 파일 삭제 중 오류:', storageError.message);
      }

      /* DB에서 미디어 row 삭제 */
      const { error: deleteError } = await supabase
        .from('media')
        .delete()
        .eq('id', mediaId)
        .eq('department_id', departmentId);

      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        mediaList: state.mediaList.filter((media) => media.id !== mediaId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('사진/동영상 삭제 중 오류가 발생했습니다. :', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
