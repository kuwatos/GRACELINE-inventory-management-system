'use client'
import  {usePathname} from 'next/navigation'

export default function DashboardHeader(){
  const pathname = usePathname()
  const user = pathname.split('/')[1].charAt(0).toUpperCase() + pathname.slice(2);

  return(
    <div className="flex items-center pl-5 w-full h-20 border-b-[1] border-b-[#0f172a]/15 font-bold text-2xl">
      {user} Dashboard
    </div>
  )
}