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
  Activity,
  BookOpen,
  Code,
  Cpu,
  Database,
  HelpCircle,
  Home,
  Image,
  Layers,
  Network,
  Package,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/flashcards", label: "Flashcards", icon: BookOpen },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
];

const demosNav = [
  { href: "/network-bottleneck", label: "Network Bottleneck", icon: Network },
  { href: "/use-memo-demo", label: "useMemo", icon: Cpu },
  { href: "/optimization-demos", label: "Optimization demos", icon: Sparkles },
  { href: "/swr", label: "SWR", icon: TrendingUp },
  {
    href: "/bundle-analyzer",
    label: "Tree Shaking and Bundle Analysis",
    icon: Package,
  },
  { href: "/dynamic-import", label: "Dynamic Imports", icon: Code },
  { href: "/image-optimization", label: "Image Optimization", icon: Image },
  { href: "/code-splitting", label: "Code Splitting", icon: Layers },
  {
    href: "/list-virtualization",
    label: "List Virtualization",
    icon: ScrollText,
  },
  {
    href: "/performance-monitoring",
    label: "Performance Monitoring and Profiling",
    icon: Activity,
  },
  {
    href: "/database-api-optimization",
    label: "Database and API Optimization",
    icon: Database,
  },
  {
    href: "/memory-leak-prevention",
    label: "Memory Leak Prevention",
    icon: ShieldCheck,
  },
  { href: "/performance-tips", label: "Performance Tips", icon: Zap },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <Zap className="size-5 text-primary" />
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
          <SidebarGroupLabel>Demos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {demosNav.map(({ href, label, icon: Icon }) => (
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
