import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type Department = {
  id: string;
  college_id: string;
  name: string;
  name_en: string;
  graduation_year: string;
  img_url: string | null;
  description: string;
  created_at: string;
  updated_at: string;
};

interface DepartmentsState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  fetchDepartments: (collegeId: string) => Promise<void>;
  fetchDepartmentById: (departmentId: string) => Promise<Department | null>;
  addDepartment: (
    college_id: string,
    name: string,
    name_en: string,
    description: string,
    graduation_year: string,
    img_url: string | null
  ) => Promise<void>;
  updateDepartment: (
    id: string,
    updates: Partial<Omit<Department, 'id' | 'created_at'>>
  ) => Promise<Department | null>;
  deleteDepartment: (id: string) => Promise<boolean>;
}

export const useDepartmentStore = create<DepartmentsState>((set, get) => ({
  departments: [],
  isLoading: false,
  error: null,

  // 학교ID별 모든 학과 조회(select)
  fetchDepartments: async (collegeId: string) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('college_id', collegeId);

    if (error) {
      set({ error: error.message, isLoading: false });
    } else {
      const current = get().departments.filter((d) => d.college_id !== collegeId);
      set({
        departments: [...current, ...(data ?? [])],
        isLoading: false,
      });
    }
  },
  // 단일 학과 조회(select)
  fetchDepartmentById: async (departmentId: string) => {
    set({ isLoading: true, error: null });
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();

    if (error) {
      set({ error: error.message, isLoading: false });
      return null;
    } else {
      // 이미 있으면 교체, 없으면 추가
      set((state) => {
        const exists = state.departments.some((d) => d.id === data.id);
        if (exists) {
          return {
            departments: state.departments.map((d) => (d.id === data.id ? data : d)),
            isLoading: false,
          };
        }
        return { departments: [...state.departments, data], isLoading: false };
      });
      return data;
    }
  },
  // 학과 추가하기(insert)
  addDepartment: async (collegeId, name, nameEn, graduation_year, description, img_url) => {
    const { data, error } = await supabase
      .from('departments')
      .insert([
        { college_id: collegeId, name, name_en: nameEn, graduation_year, description, img_url },
      ])
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      set({ error: error.message });
    } else if (data) {
      set((state) => {
        const exists = state.departments.some((d) => d.id === data.id);
        if (exists) return state;
        return { departments: [...state.departments, data] };
      });
    }
  },
  // 학과 수정하기(update)
  updateDepartment: async (id: string, updates: Partial<Department>) => {
    const { data, error } = await supabase
      .from('departments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      set({ error: error.message });
      return null;
    }

    if (data) {
      set((state) => ({
        departments: state.departments.map((dept) =>
          dept.id === id ? { ...dept, ...data } : dept
        ),
      }));
      return data;
    }
    return null;
  },
  // 학과 삭제하기(delete)
  deleteDepartment: async (id) => {
    set({ isLoading: true });

    const { error } = await supabase.from('departments').delete().eq('id', id);

    if (error) {
      console.error('학과 삭제 중 오류가 발생했습니다. :', error);
      set({ error: error.message });
      return false;
    }

    set((state) => ({
      departments: state.departments.filter((dept) => dept.id !== id),
    }));

    return true;
  },
}));
