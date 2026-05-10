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
  CheckSquare,
  Cookie,
  Eraser,
  FileLock,
  Gauge,
  Globe,
  HelpCircle,
  Home,
  Key,
  Lock,
  Package,
  Shield,
  ShieldCheck,
  Swords,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/attack", label: "Attack", icon: Swords },
  { href: "/rate-limiting", label: "Rate limiting", icon: Gauge },
  { href: "/http-cookies", label: "HTTP cookies", icon: Cookie },
  { href: "/csrf-cookies", label: "CSRF cookies", icon: ShieldCheck },
  { href: "/cors", label: "CORS", icon: Globe },
  { href: "/secrets", label: "Secrets", icon: Key },
  { href: "/sensitive-data", label: "Sensitive data", icon: FileLock },
  { href: "/auth-middleware", label: "Auth middleware", icon: Shield },
  { href: "/https", label: "HTTPS", icon: Lock },
  { href: "/sanitizing-inputs", label: "Sanitizing inputs", icon: Eraser },
  { href: "/validation-zod", label: "Validation (Zod)", icon: CheckSquare },
  {
    href: "/non-trivial-packages",
    label: "Non-trivial packages",
    icon: Package,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="none">
      <SidebarHeader className="border-sidebar-border border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <Shield className="size-5 text-primary" />
          <span className="font-semibold">Arcjet</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map(({ href, label, icon: Icon }) => (
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
    </Sidebar>
  );
}
