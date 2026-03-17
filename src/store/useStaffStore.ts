import { supabase } from '@/utils/supabase/client';
import { create } from 'zustand';

type Staff = {
  id: string;
  school_id: string;
  department_id: string;
  name: string;
  position: string;
  profile_url: string | null;
};

interface StaffState {
  isLoading: boolean;
  error: string | null;

  staff: Staff | null;
  staffs: Staff[];

  fetchStaffs: (departmentId: string) => Promise<void>;
  addStaffProfile: (
    school_id: string,
    department_id: string,
    name: string,
    position: string,
    profile_url: string | null
  ) => Promise<void>;
  deleteStaff: (departmentId: string, staffId: string) => Promise<boolean>;
}

export const useStaffStore = create<StaffState>((set) => ({
  isLoading: false,
  error: null,

  staff: null,
  staffs: [],

  fetchStaffs: async (departmentId) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from('staffs')
      .select('*')
      .eq('department_id', departmentId);

    if (error) {
      set({ isLoading: false, error: error.message });
    } else {
      set({ staffs: data || [], isLoading: false });
    }
  },
  //
  addStaffProfile: async (school_id, department_id, name, position, profile_url) => {
    const { data, error } = await supabase
      .from('staffs')
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
        staffs: [...state.staffs, data],
        isLoading: false,
      }));
    }
  },
  deleteStaff: async (departmentId, staffId) => {
    set({ isLoading: true, error: null });

    try {
      /* storage 파일 삭제 */
      const { data } = await supabase
        .from('staffs')
        .select('profile_url')
        .eq('department_id', departmentId)
        .eq('id', staffId)
        .single();

      const baseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/public/staff-profiles/`;
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
          .from('staff-profiles')
          .remove(filePaths);
        if (storageError) console.warn(`Storage 파일 삭제 중 오류:`, storageError.message);
      }

      const { error: deleteError } = await supabase
        .from('staffs')
        .delete()
        .eq('id', staffId)
        .eq('department_id', departmentId);
      if (deleteError) throw deleteError;

      /* 상태 업데이트 */
      set((state) => ({
        staffs: state.staffs.filter((staff) => staff.id !== staffId),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error('교직원 삭제 중 오류가 발생했습니다. : ', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
