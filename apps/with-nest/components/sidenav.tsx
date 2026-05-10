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
import {
  Box,
  Filter,
  GitBranch,
  Hexagon,
  Layers,
  LayoutTemplate,
  Radio,
  Shield,
  UsersRound,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/overview", label: "Overview", icon: LayoutTemplate },
  { href: "/controllers", label: "Controllers", icon: Radio },
  { href: "/providers", label: "Providers", icon: Box },
  { href: "/modules", label: "Modules", icon: Layers },
  { href: "/middleware", label: "Middleware", icon: Waypoints },
  { href: "/pipes", label: "Pipes", icon: Filter },
  { href: "/guards", label: "Guards", icon: Shield },
  { href: "/interceptors", label: "Interceptors", icon: GitBranch },
] as const;

const demoNav = [
  { href: "/users-demo", label: "Users demo", icon: UsersRound },
] as const;

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
                  <Hexagon className="h-5 w-5" />
                  <span className="font-semibold">with-nest</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Concepts</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={pathname === href}>
                    <Link href={href}>
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Demo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demoNav.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={pathname === href}>
                    <Link href={href}>
                      <Icon className="h-4 w-4" />
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
};
