import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type Symbol = {
  id: string;
  school_id: string;
  title: string;
  description: string;
  url: string | null;
};

interface SymbolState {
  isLoading: boolean;
  error: string | null;

  symbol: Symbol | null;
  symbolList: Symbol[];

  fetchSymbolList: (school_id: string) => Promise<void>;
  addSymbol: (
    school_id: string,
    title: string,
    description: string,
    url: string | null
  ) => Promise<void>;
  deleteSymbol: (school_id: string, symbolId: string) => Promise<boolean>;
}

export const useSymbolStore = create<SymbolState>((set) => ({
  isLoading: false,
  error: null,

  symbol: null,
  symbolList: [],

  fetchSymbolList: async (school_id) => {
    set({ isLoading: false, error: null });

    const { data, error } = await supabase.from('symbol').select('*').eq('school_id', school_id);
    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ symbolList: data || [], isLoading: false });
    }
  },
  addSymbol: async (school_id, title, description, url) => {
    set({ isLoading: false, error: null });

    const { data, error } = await supabase
      .from('symbol')
      .insert([{ school_id, title, description, url }])
      .select('*')
      .single();
    if (error) {
      console.error('상징 추가 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false, error: error.message });
      return;
    } else if (data) {
      set((state) => ({
        symbolList: [data, ...state.symbolList],
        isLoading: false,
      }));
    }
  },
  deleteSymbol: async (school_id, symbolId) => {
    set({ isLoading: true, error: null });

    try {
      /* storage 파일 삭제 */
      const { data } = await supabase
        .from('symbol')
        .select('url')
        .eq('school_id', school_id)
        .eq('id', symbolId)
        .single();

      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/public/symbols/`;
      const filePaths: string[] = [];

      const extractPath = (fullUrl?: string | null) => {
        if (!fullUrl) return null;
        if (!fullUrl.startsWith(baseUrl)) return null;

        return fullUrl.replace(baseUrl, '');
      };

      const mainPath = extractPath(data?.url);
      if (mainPath) filePaths.push(mainPath);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage.from('symbols').remove(filePaths);
        if (storageError) console.warn(`Storage 파일 삭제 중 오류:`, storageError.message);
      }

      const { error: deleteError } = await supabase
        .from('symbol')
        .delete()
        .eq('school_id', school_id)
        .eq('id', symbolId);
      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        symbolList: state.symbolList.filter((symbol) => symbol.id !== symbolId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('상징 삭제 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
