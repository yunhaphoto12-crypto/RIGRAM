import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import Image from "next/image";


export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ departmentId: string }>
}) {
  const { departmentId } = await params

  const supabase = await createClient()

  // staffs 중 departmentId 같은 것
  const { data: staffs } = await supabase
    .from('staffs')
    .select('*')
    .eq('department_id', departmentId)

  // students 중 departmentId 같은 것
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('dept_id', departmentId)

return (
    <div className="w-full flex flex-col gap-8">

      <section className="relative w-full max-w-screen-xl mx-auto bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">교수진</h1>
          </header>

          <ul className="grid grid-cols-1 gap-2" role="list">
            {staffs?.map((staff) => (
            <li key={staff.id}>
              <Link
                href={`/department/staff/${staff.id}`}
                className="block p-2 border border-border rounded
                          hover:cursor-pointer
                          hover:outline hover:outline-primary-700
                          transition"
                aria-label={`${staff.name} 상세 페이지로 이동`}
              >
                <div className="flex flex-row items-center gap-4">
                  {/* 이미지 */}
                  {staff.profile_url && (
                    <div className="relative w-32 h-32 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={staff.profile_url}
                        alt={`${staff.name} 이미지`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* 이름 */}
                  <span className="font-medium text-lg">{staff.name}</span>
                </div>
              </Link>
            </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative w-full max-w-screen-xl mx-auto bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10"> 
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">졸업생</h1>
          </header>

          <ul className="grid grid-cols-1 gap-2" role="list">
            {students?.map((student) => (
              <li key={student.id}>
                <Link
                  href={`/department/student/${student.id}`}
                  className="block p-2 border border-border rounded
                            hover:cursor-pointer
                            hover:outline hover:outline-primary-700
                            transition"
                  aria-label={`${student.name} 상세 페이지로 이동`}
                >
                  {student.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative w-full max-w-screen-xl mx-auto bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">실습사진</h1>
          </header>
        </div>
      </section>

      <section className="relative w-full max-w-screen-xl mx-auto bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">축제영상</h1>
          </header>
        </div>
      </section>

    </div>
  )
}