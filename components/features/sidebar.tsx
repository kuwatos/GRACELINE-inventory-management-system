"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelRightClose, LogOut } from "lucide-react";
import { sideBarNav } from "../config/nav"; // 👈 IMPORT THE CONFIG

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const accountName = "Temporary Name";

  // 1. GET THE CURRENT SECTION FROM URL (e.g., "admin", "warehouse")
  const section = pathname.split('/')[1];

  // 2. LOAD THE CORRECT MENU ITEMS
  // If the URL is weird (like /login), default to "admin" or an empty list
  const navKey = (section in sideBarNav ? section : "admin") as keyof typeof sideBarNav;
  const navItems = sideBarNav[navKey];

  return (
    <aside
      className={`
        flex flex-col justify-between h-screen p-[40px] 
        bg-gray-800 
        font-inter text-white font-normal 
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[110px] py-[40px] px-5" : "w-[366px]"}
      `}
    >
      {/* --- HEADER --- */}
      <div
        className={`
          flex border-b-2 border-[#ffffff41] pb-5 items-center overflow-hidden transition-all duration-300
          ${isCollapsed ? "flex-col gap-4 justify-center" : "justify-between gap-2"}
        `}
      >
        <div className="relative w-[47px] h-[47px] shrink-0 bg-[#1A2F1A] rounded-full border border-white/20">
          <div className="flex h-full w-full items-center justify-center text-xs">
             IMG
          </div>
        </div>

        <span
          className={`
            text-lg font-light whitespace-nowrap overflow-hidden transition-all duration-300
            ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"}
          `}
        >
          {accountName}
        </span>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:text-gray-300 transition-colors"
        >
          <PanelRightClose size={24} />
        </button>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 flex flex-col gap-4 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center p-3 rounded-lg transition-all duration-300 ease-in-out
                hover:bg-[#4c595f77] hover:text-white
                ${isCollapsed ? "justify-center" : "justify-start gap-4"}
                ${isActive ? "bg-[#123112] text-white font-medium shadow-md" : "text-gray-300"}
              `}
            >
              <div className="relative shrink-0">
                <Icon size={24} />
              </div>

              <span
                className={`
                  whitespace-nowrap overflow-hidden transition-all duration-300
                  ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"}
                `}
              >
                {/* Changed item.name to item.label to match config */}
                {item.label} 
              </span>
            </Link>
          );
        })}
      </nav>

      {/* --- FOOTER (LOGOUT) --- */}
      <div className="flex border-t-2 border-[#ffffff41] pt-5">
        <button
          onClick={() => console.log("Logging out...")}
          className={`
            flex items-center p-2 rounded-lg gap-4
            transition-all duration-300 ease-in-out cursor-pointer
            hover:bg-[#1A2F1A80]/50 w-full
            ${isCollapsed ? "justify-center" : "justify-between"}
          `}
        >
          <span
            className={`
              text-lg font-medium whitespace-nowrap transition-all duration-300 overflow-hidden
              ${isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"}
            `}
          >
            Logout
          </span>
          
          <LogOut size={24} />
        </button>
      </div>
    </aside>
  );
}