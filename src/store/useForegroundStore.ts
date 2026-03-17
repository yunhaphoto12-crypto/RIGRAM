import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type Foreground = {
  id: string;
  school_id: string;
  title: string;
  url: string | null;
};

interface ForegroundState {
  isLoading: boolean;
  error: string | null;

  foreground: Foreground | null;
  foregroundList: Foreground[];

  fetchForegroundList: (schoolId: string) => Promise<void>;
  addForeground: (school_id: string, title: string, url: string | null) => Promise<void>;
  deleteForeground: (school_id: string, foregroundId: string) => Promise<boolean>;
}

export const useForegroundStore = create<ForegroundState>((set) => ({
  isLoading: false,
  error: null,

  foreground: null,
  foregroundList: [],

  fetchForegroundList: async (schoolId) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase.from('foreground').select('*').eq('school_id', schoolId);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ foregroundList: data || [], isLoading: false });
    }
  },
  addForeground: async (school_id, title, url) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('foreground')
      .insert([{ school_id, title, url }])
      .select('*')
      .single();

    if (error) {
      console.error('전경 이미지 추가 중 오류가 발생했습니다. :', error);
      set({ isLoading: false, error: error.message });
      return;
    } else if (data) {
      set((state) => ({
        foregroundList: [data, ...state.foregroundList],
        isLoading: false,
      }));
    }
  },
  deleteForeground: async (school_id, foregroundId) => {
    set({ isLoading: true, error: null });

    try {
      /* storage 파일 삭제 */
      const { data } = await supabase
        .from('foreground')
        .select('url')
        .eq('school_id', school_id)
        .eq('id', foregroundId)
        .single();

      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/public/foregrounds/`;
      const filePaths: string[] = [];

      const extractPath = (fullUrl?: string | null) => {
        if (!fullUrl) return null;
        if (!fullUrl.startsWith(baseUrl)) return null;

        return fullUrl.replace(baseUrl, '');
      };

      const mainPath = extractPath(data?.url);
      if (mainPath) filePaths.push(mainPath);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('foregrounds')
          .remove(filePaths);
        if (storageError) console.warn(`Storage 파일 삭제 중 오류:`, storageError.message);
      }

      const { error: deleteError } = await supabase
        .from('foreground')
        .delete()
        .eq('school_id', school_id)
        .eq('id', foregroundId);
      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        foregroundList: state.foregroundList.filter((foreground) => foreground.id !== foregroundId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('전경 이미지 삭제 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
