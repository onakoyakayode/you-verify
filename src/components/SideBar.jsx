"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  HelpCircle,
  Building2,
  CreditCard,
} from "lucide-react";

const navigation = [
  { name: "Getting Started", href: "#", icon: LayoutDashboard, current: false },
  { name: "Overview", href: "#", icon: FileText, current: true },
  { name: "Accounts", href: "#", icon: CreditCard, current: false },
  { name: "Invoice", href: "#", icon: FileText, current: false },
  { name: "Beneficiary Management", href: "#", icon: Users, current: false },
  { name: "Help Center", href: "#", icon: HelpCircle, current: false },
  { name: "Settings", href: "#", icon: Settings, current: false },
];

export function Sidebar({ className }) {
  return (
    <div
      className={cn("flex h-full w-64 flex-col bg-white border-r", className)}
    >
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">INVOICE</span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant={item.current ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left font-normal",
                item.current && "bg-blue-50 text-blue-700 hover:bg-blue-50"
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
