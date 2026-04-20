"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationLoader } from "@/components/providers/navigation-loader";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

export const NavLink = ({ href, children, className, activeClassName }: NavLinkProps) => {
  const { startLoading } = useNavigationLoader();
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={startLoading}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
};