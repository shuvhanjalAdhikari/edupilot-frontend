"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 bg-slate-50 border-slate-200"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-xs bg-blue-500">
            3
          </Badge>
        </Button>
      </div>
    </header>
  );
}