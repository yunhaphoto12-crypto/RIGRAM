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

        <section className="relative w-full max-w-screen-xl mx-auto bg-white p-5 rounded-xl md:p-10 flex justify-center">
            
            <div className="flex flex-col items-center gap-4 p-6 rounded-lg">

            {/* 사진 2개 가로 배치 */}
            <div className="flex gap-4">
                <Link href={`/department/student/${students?.[0]?.id}/image/default`}>
                <div className="relative w-[380px] h-[380px] rounded-xl overflow-hidden hover:scale-105 transition">
                    {students?.[0]?.profile_default && (
                    <Image
                        src={students[0].profile_default}
                        alt="증명사진"
                        fill
                        sizes="380px"
                        className="object-cover"
                    />
                    )}
                </div>
                </Link>
            </div>

            {/* 이름 */}
            <p className="text-center font-medium text-lg">{students?.[0]?.name}</p>

            </div>

        </section>
        </div>
  )
}