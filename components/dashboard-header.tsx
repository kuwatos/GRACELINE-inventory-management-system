'use client'
import  {usePathname} from 'next/navigation'
import { SidebarTrigger } from './ui/sidebar'

export default function DashboardHeader(){
  const pathname = usePathname()
  const user = pathname.split('/')[1].charAt(0).toUpperCase() + pathname.split('/')[1].slice(1)


  return(
    <div className="flex items-center p-5 pl-5 w-full h-20 border-b-[1] border-b-[#0f172a]/15 font-bold text-2xl gap-3">
      <SidebarTrigger className="md:hidden" />
      {user} Dashboard
    </div>
  )
}