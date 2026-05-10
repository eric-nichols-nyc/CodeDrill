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
import { Boxes, Code, GitCompare, HelpCircle, Home, Layers, RefreshCw, Server, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

const strategiesNav = [
  { href: "/csr", label: "Client-Side (CSR)", icon: Code },
  { href: "/ssr", label: "Server-Side (SSR)", icon: Server },
  { href: "/ssr-vs-csr", label: "SSR vs CSR", icon: GitCompare },
  { href: "/ssg", label: "Static (SSG)", icon: Zap },
  { href: "/isr", label: "ISR", icon: RefreshCw },
  { href: "/rsc", label: "RSC", icon: Boxes },
  { href: "/ppr", label: "PPR", icon: Layers },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <Zap className="size-5 text-primary" />
          <span className="font-semibold">Render Lab</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon className="size-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Strategies</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {strategiesNav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href || pathname.startsWith(`${href}/`)}
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon className="size-4" />
                      <span>{label}</span>
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
}
