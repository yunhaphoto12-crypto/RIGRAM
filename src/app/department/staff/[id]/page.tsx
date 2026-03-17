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

  const { data: staffs } = await supabase
    .from('staffs')
    .select('*')
    .eq('id', id)

return (
        <div className="w-full flex flex-col gap-8 items-center">

        <section className="relative w-full max-w-screen-xl mx-auto bg-white p-5 rounded-xl md:p-10 flex justify-center">
            
            <div className="flex flex-col items-center gap-4 p-6 rounded-lg">

            <div className="flex gap-4">
                <div className="relative w-[330px] h-[330px] rounded-xl overflow-hidden hover:scale-105 transition">
                    {staffs?.[0]?.profile_url && (
                    <Image
                        src={staffs[0].profile_url}
                        alt="증명사진"
                        fill
                        sizes="330px"
                        className="object-cover"
                    />
                    )}
                </div>
            </div>

            <p className="text-center font-medium text-lg">{staffs?.[0]?.name}</p>

            </div>

        </section>
        </div>
  )
}