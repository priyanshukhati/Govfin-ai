"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Search,
  TrendingUp,
  // MessageSquare,
  User,
  Landmark,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="size-5" />,
    href: "/dashboard",
  },
  {
    label: "Scheme Finder",
    icon: <Search className="size-5" />,
    href: "/scheme-finder",
  },
  {
    label: "Finance",
    icon: <TrendingUp className="size-5" />,
    href: "/finance",
  },
  // {
  //   label: "AI Chat",
  //   icon: <MessageSquare className="size-5" />,
  //   href: "/ai-chat",
  // },
  {
    label: "Profile",
    icon: <User className="size-5" />,
    href: "/profile",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r bg-background">
      {/* Logo & Branding */}
      <div className="border-b px-6 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-sm">
            <Landmark className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-foreground">
              GovFin AI
            </span>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
              Smart Financial Assistance
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className={cn(
                    isActive ? "text-indigo-600" : "text-muted-foreground"
                  )}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer tagline */}
      <div className="border-t px-6 py-4">
        <p className="text-center text-[10px] leading-relaxed text-muted-foreground">
          Smart Financial Assistance for Every Citizen
        </p>
      </div>
    </aside>
  )
}
