import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type Union = {
  id: string;
  department_id: string;
  name: string;
  position: string;
  profile_url: string;
};

interface UnionState {
  isLoading: boolean;
  error: string | null;

  union: Union | null;
  unions: Union[];

  fetchUnions: (departmentId: string) => Promise<void>;
  addUnionProfile: (
    school_id: string,
    department_id: string,
    name: string,
    position: string,
    profile_url: string | null
  ) => Promise<void>;
  deleteUnion: (departmentId: string, unionId: string) => Promise<boolean>;
}

export const useUnionStore = create<UnionState>((set) => ({
  isLoading: false,
  error: null,

  union: null,
  unions: [],

  fetchUnions: async (departmentId) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('unions')
      .select('*')
      .eq('department_id', departmentId);

    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ unions: data || [], isLoading: false });
    }
  },
  addUnionProfile: async (school_id, department_id, name, position, profile_url) => {
    const { data, error } = await supabase
      .from('unions')
      .insert([
        {
          school_id,
          department_id,
          name,
          position,
          profile_url,
        },
      ])
      .single();
    if (error) {
      console.error('프로필을 추가하던 중 오류가 발생했습니다. :', error);
      set({ isLoading: false, error: error.message });
    } else if (data) {
      set((state) => ({
        unions: [...state.unions, data],
        isLoading: false,
      }));
    }
  },
  deleteUnion: async (departmentId, unionId) => {
    set({ isLoading: true, error: null });

    try {
      /* storage 파일 삭제 */
      const { data } = await supabase
        .from('unions')
        .select('profile_url')
        .eq('department_id', departmentId)
        .eq('id', unionId)
        .single();

      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/public/union-profiles/`;
      const filePaths: string[] = [];

      const extractPath = (fullUrl?: string | null) => {
        if (!fullUrl) return null;
        if (!fullUrl.startsWith(baseUrl)) return null;

        return fullUrl.replace(baseUrl, '');
      };

      const mainPath = extractPath(data?.profile_url);
      if (mainPath) filePaths.push(mainPath);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('union-profiles')
          .remove(filePaths);
        if (storageError) console.warn(`Storage 파일 삭제 중 오류:`, storageError.message);
      }

      const { error: deleteError } = await supabase
        .from('unions')
        .delete()
        .eq('id', unionId)
        .eq('department_id', departmentId);
      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        unions: state.unions.filter((union) => union.id !== unionId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('학생회 삭제 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
