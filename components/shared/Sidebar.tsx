"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquareText,
  GraduationCap,
  BarChart3,
  ClipboardList,
  BookOpen,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Agent Chat",
    href: "/chat",
    icon: MessageSquareText,
  },
  {
    label: "Students",
    href: "/students",
    icon: GraduationCap,
  },
  {
    label: "Grades",
    href: "/grades",
    icon: BarChart3,
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: ClipboardList,
  },
  {
    label: "Lesson Plans",
    href: "/lessons",
    icon: BookOpen,
  },
  {
    label: "Materials",
    href: "/materials",
    icon: FolderOpen,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-slate-900 text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">EduPilot</span>
        )}
      </div>

      <Separator className="bg-slate-700" />

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-slate-700" />

      {/* Bottom */}
      <div className="px-2 py-4">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-slate-500">Logged in as</p>
            <p className="text-sm font-medium text-slate-300">Teacher</p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </aside>
  );
}