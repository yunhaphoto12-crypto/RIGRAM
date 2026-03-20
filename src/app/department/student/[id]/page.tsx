import { createClient } from '@/utils/supabase/server'
import Link from "next/link";
import Image from "next/image";

export default async function DepartmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)

return (
<div className="w-full flex flex-col gap-8 items-center">

  <section className="w-full max-w-[1600px] mx-auto bg-white border border-border rounded-md p-5 md:p-10 shadow-dropdown transition"> 
    <div className="flex flex-col items-center gap-12">

      {/* 이미지 영역 */}
      <div className="flex gap-4 flex-wrap justify-center">

        <Link href={`/department/student/${students?.[0]?.id}/image/graduate`}>
          <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] rounded-xl overflow-hidden bg-gray-100 hover:scale-105 transition">
            {students?.[0]?.profile_graduate && (
              <Image
                src={students[0].profile_graduate}
                alt="증명사진"
                fill
                sizes="(max-width: 640px) 250px, (max-width: 768px) 300px, 380px"
                className="object-contain"
              />
            )}
          </div>
        </Link>

        <Link href={`/department/student/${students?.[0]?.id}/image/default`}>
          <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[380px] md:h-[380px] rounded-xl overflow-hidden bg-gray-100 hover:scale-105 transition">
            {students?.[0]?.profile_default && (
              <Image
                src={students[0].profile_default}
                alt="증명사진"
                fill
                sizes="(max-width: 640px) 250px, (max-width: 768px) 300px, 380px"
                className="object-contain"
              />
            )}
          </div>
        </Link>

      </div>

      {/* 이름 */}
      <h1 className="text-xl md:text-2xl font-bold">{students?.[0]?.name}</h1>
    </div>
  </section>
</div>

  )
}