import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type History = {
  id: string;
  school_id: string;
  title: string;
  background_url: string | null;
  description: string;
  date: string;
};

interface HistoryState {
  isLoading: boolean;
  error: string | null;

  history: History | null;
  histories: History[];

  fetchHistories: (schoolId: string) => Promise<void>;
  fetchHistoryById: (schoolId: string, historyId: string) => Promise<void>;
  addHistory: (
    school_id: string,
    title: string,
    background_url: string | null,
    description: string,
    date: string
  ) => Promise<void>;
  deleteHistory: (schoolId: string, historyId: string) => Promise<boolean>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  isLoading: false,
  error: null,

  history: null,
  histories: [],

  fetchHistories: async (schoolId) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('school_id', schoolId)
      .order('date', { ascending: true });
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ histories: data || [], isLoading: false });
    }
  },
  fetchHistoryById: async (schoolId, historyId) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('school_id', schoolId)
      .eq('id', historyId)
      .single();

    if (error) {
      console.error('연혁 단일 조회 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false, error: error.message });
      return;
    }

    set({ history: data, isLoading: false });
  },
  addHistory: async (school_id, title, background_url, description, date) => {
    const formattedDate = date;

    const { data, error } = await supabase
      .from('history')
      .insert([
        {
          school_id,
          title,
          background_url,
          description,
          date: formattedDate,
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('연혁을 추가하던 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false, error: error.message });
    } else if (data) {
      set((state) => ({
        histories: [...state.histories, data],
        isLoading: false,
      }));
    }
  },
  deleteHistory: async (schoolId, historyId) => {
    set({ isLoading: true, error: null });

    try {
      /* storage 파일 삭제 */
      const { data } = await supabase
        .from('history')
        .select('background_url')
        .eq('school_id', schoolId)
        .eq('id', historyId)
        .single();

      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/public/history-backgrounds/`;
      const filePaths: string[] = [];

      const extractPath = (fullUrl?: string | null) => {
        if (!fullUrl) return null;
        if (!fullUrl.startsWith(baseUrl)) return null;

        return fullUrl.replace(baseUrl, '');
      };

      const mainPath = extractPath(data?.background_url);
      if (mainPath) filePaths.push(mainPath);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('history-backgrounds')
          .remove(filePaths);
        if (storageError) console.warn(`Storage 파일 삭제 중 오류:`, storageError.message);
      }

      const { error: deleteError } = await supabase
        .from('history')
        .delete()
        .eq('id', historyId)
        .eq('school_id', schoolId);
      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        histories: state.histories.filter((history) => history.id !== historyId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('연혁 삭제 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
