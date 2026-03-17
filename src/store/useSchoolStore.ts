import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

// import { createJSONStorage, persist } from 'zustand/middleware';

interface SchoolTable {
  id?: string;
  school_name?: string;
  school_name_en?: string;
  graduation_year?: string;
  school_img_url?: File | string | null;
  manager_name?: string;
  manager_email?: string;
  manager_contact?: string;
  created_at?: string;
  updated_at?: string;
}

interface SchoolStore {
  school: SchoolTable | null;
  isLoading: boolean;
  fetchSchool: (useId: string) => Promise<void>;
  addSchool: (data: SchoolTable, userId: string) => Promise<void>;
  editSchool: (data: SchoolTable, userId: string) => Promise<void>;
}

export const useSchoolStore = create<SchoolStore>()((set) => ({
  school: null,
  isLoading: false,

  // 학교 불러오기
  fetchSchool: async (userId) => {
    set({ isLoading: true });

    try {
      // * user테이블에서 user_type과 school_id 가져오기
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('user_type, school_id')
        .eq('id', userId)
        .single();
      if (userError) throw userError;

      // * 실제로 조회할 학교 ID결정
      const targetSchoolId = user?.user_type === 'student' ? user?.school_id : userId;
      if (!targetSchoolId) throw new Error('학교 ID를 찾을 수 없습니다.');

      // * schools 테이블에서 학교 데이터 가져오기
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .select('*')
        .eq('id', targetSchoolId)
        .single();
      if (schoolError) throw schoolError;

      set({ school, isLoading: false });
    } catch (error) {
      console.error('학교 데이터를 가져오는 중 오류:', error);
      set({ school: null, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  // 학교 추가하기
  addSchool: async (data, userId) => {
    try {
      const { error: schoolError } = await supabase
        .from('schools')
        .insert([{ ...data, id: userId }]);

      if (schoolError) throw schoolError;

      const { error: userError } = await supabase
        .from('users')
        .update({ school_name_en: data.school_name_en })
        .eq('id', userId);
      if (userError) throw userError;

      set({ school: { ...(data as SchoolTable), id: userId } });
    } catch (error) {
      console.error('학교 추가 중 오류가 발생했습니다. : ', error);
    }
  },
  // 학교 수정하기
  editSchool: async (data, userId) => {
    try {
      const { error } = await supabase
        .from('schools')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', userId);
      if (error) throw error;

      set((state) => ({
        school: state.school ? { ...state.school, ...data } : null,
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
