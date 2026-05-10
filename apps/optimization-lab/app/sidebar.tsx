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
import {
  FileStack,
  FlaskConical,
  Home,
  Monitor,
  Package,
  RefreshCw,
  Search,
  ServerCog,
  ShoppingBag,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: Package },
  { href: "/categories", label: "Categories", icon: ShoppingBag },
  { href: "/search", label: "Search", icon: Search },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
] as const;

const renderingNav = [
  { href: "/rendering/ssr", label: "SSR", icon: ServerCog },
  { href: "/rendering/ssg", label: "SSG", icon: FileStack },
  { href: "/rendering/isr", label: "ISR", icon: RefreshCw },
  { href: "/rendering/csr", label: "CSR", icon: Monitor },
  { href: "/rendering/ppr", label: "PPR", icon: Zap },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <FlaskConical className="size-5 text-primary" />
          <span className="font-semibold">Optimization Lab</span>
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
        <SidebarGroup>
          <SidebarGroupLabel>Rendering</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderingNav.map(({ href, label, icon: Icon }) => (
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
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t">
        <div className="p-2">
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
