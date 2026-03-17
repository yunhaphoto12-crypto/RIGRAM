import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';

export default async function UsersPage() {
  const supabase = await createClient()

  const { data: departments, error } = await supabase
    .from('departments')
    .select('*')

  if (error) {
    console.error(error)
  }

  return (
    <div className="w-full flex-col gap-8">

      {/* 블록 1 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">샘플 대학교 졸업앨범 2026 </h1>
          </header>
        </div>
      </section>

      {/* 블록 2 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">학교 전경</h1>
          </header>
        </div>
      </section>

      {/* 블록 3 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">연혁</h1>
          </header>
        </div>
      </section>

      {/* 블록 4 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">이사장</h1>
          </header>
        </div>
      </section>

      {/* 블록 5 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">총장</h1>
          </header>
        </div>
      </section>

      {/* 블록 6 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10">
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">행정직원</h1>
          </header>
        </div>
      </section>

      {/* 블록 7 */}
      <section className="relative w-full h-full bg-white border border-border p-5 rounded-xl shadow-dropdown md:p-10"> 
        <div className="flex flex-col gap-5">
          <header className="flex justify-between items-center">
            <h1 className="text-18 md:text-20 font-semibold">학과</h1>
          </header>

          <ul className="grid grid-cols-1 gap-2" role="list">
            {departments?.map((department) => (
              <li key={department.id + '-6'}>
                <Link
                  href={`/department/${department.id}`}  // 이동할 내부 페이지
                  className="block p-4 bg-white border border-border rounded-lg shadow-sm
                            hover:cursor-pointer
                            hover:outline hover:outline-primary-700
                            transition"
                  aria-label={`${department.name} 상세 페이지로 이동`}
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{department.name}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </div>
  )
}