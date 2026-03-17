import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type College = {
  id: string;
  school_id: string;
  name: string;
  created_at: string;
};

interface CollegesState {
  colleges: College[];
  loading: boolean;
  error: string | null;
  fetchColleges: (schoolId: string) => Promise<void>;
  fetchCollegeById: (collegeId: string) => Promise<College | null>;
  addCollege: (schoolId: string, name: string) => Promise<College | null>;
}

export const useCollegeStore = create<CollegesState>((set) => ({
  colleges: [],
  loading: false,
  error: null,

  // 학교ID별 모든 단과대학명 조회
  fetchColleges: async (schoolId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.from('colleges').select('*').eq('school_id', schoolId);

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ colleges: data ?? [], loading: false });
    }
  },

  // 단일 단과대학 조회
  fetchCollegeById: async (collegeId: string) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', collegeId)
      .single();

    if (error) {
      set({ error: error.message, loading: false });
      return null;
    } else {
      // 기존 state에 업데이트
      set((state) => {
        const exists = state.colleges.some((c) => c.id === data.id);
        if (exists) {
          return {
            colleges: state.colleges.map((c) => (c.id === data.id ? data : c)),
            loading: false,
          };
        }
        return { colleges: [...state.colleges, data], loading: false };
      });
      return data;
    }
  },

  // 학교ID별 단과대학명 추가
  addCollege: async (schoolId: string, name: string) => {
    // 중복 확인
    const { data: existing, error: checkError } = await supabase
      .from('colleges')
      .select('*')
      .eq('school_id', schoolId)
      .eq('name', name)
      .maybeSingle(); // 있으면 객체, 없으면 null
    if (checkError) {
      set({ error: checkError.message });
      return null;
    }
    if (existing) {
      return existing;
    }

    const { data, error } = await supabase
      .from('colleges')
      .insert([{ school_id: schoolId, name }])
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return null;
    } else if (data) {
      set((state) => {
        const exists = state.colleges.some((c) => c.id === data.id);
        if (exists) return state;
        return { colleges: [...state.colleges, data] };
      });
      return data; // 생성된 단과대학 반환
    }

    return null;
  },
}));
