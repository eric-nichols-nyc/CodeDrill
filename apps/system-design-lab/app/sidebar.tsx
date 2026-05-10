"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/design-system/components/ui/sidebar";
import {
  Home,
  Image,
  Layout,
  ListOrdered,
  Rocket,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/getting-started", label: "Getting Started", icon: Rocket },
  { href: "/five-step-framework", label: "Five Step Framework", icon: ListOrdered },
  {
    href: "/load-balancers-and-gateways",
    label: "Load Balancers and Gateways",
    icon: Scale,
  },
  { href: "/instagram", label: "Instagram", icon: Image },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <Layout className="size-5 text-primary" />
          <span className="font-semibold">System Design Lab</span>
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
                    isActive={
                      pathname === href ||
                      (href !== "/" && pathname.startsWith(href))
                    }
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
      <SidebarFooter className="border-sidebar-border border-t" />
    </Sidebar>
  );
}
