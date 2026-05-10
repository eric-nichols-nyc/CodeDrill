"use client";

import { ModeToggle } from "@repo/design-system/components/mode-toggle";
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
import { Folder, HelpCircle, Home, Palette, Scale, Shapes, Package, Boxes, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/folder-structure", label: "Folder Structure", icon: Folder },
  { href: "/solid", label: "SOLID", icon: Shapes },
  { href: "/compound-design-pattern", label: "Compound design pattern", icon: Boxes },
  { href: "/monorepos", label: "Monorepos", icon: Package },
  { href: "/design-systems", label: "Design systems", icon: Palette },
  { href: "/storybook", label: "Storybook", icon: BookOpen },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <Scale className="size-5 text-primary" />
          <span className="font-semibold">Scalable</span>
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
      <SidebarFooter className="border-sidebar-border border-t">
        <div className="p-2">
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
