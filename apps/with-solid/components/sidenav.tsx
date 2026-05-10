"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/ui/sidebar";
import { Layers } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Single Responsibility",
    href: "/srp",
    abbreviation: "SRP",
  },
  {
    title: "Open/Closed",
    href: "/ocp",
    abbreviation: "OCP",
  },
  {
    title: "Liskov Substitution",
    href: "/lsp",
    abbreviation: "LSP",
  },
  {
    title: "Interface Segregation",
    href: "/isp",
    abbreviation: "ISP",
  },
  {
    title: "Dependency Inversion",
    href: "/dip",
    abbreviation: "DIP",
  },
];

export const Sidenav = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  <span className="font-semibold">SOLID Principles</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principles</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <span>{item.title}</span>
                      <span className="ml-auto text-muted-foreground text-xs">
                        {item.abbreviation}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
