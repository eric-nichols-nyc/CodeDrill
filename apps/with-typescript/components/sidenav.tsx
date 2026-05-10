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
import { Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Quiz",
    href: "/quiz",
    category: "basic",
  },
  {
    title: "Basic Types",
    href: "/basic-types",
    category: "basic",
  },
  {
    title: "Unions",
    href: "/unions",
    category: "intermediate",
  },
  {
    title: "Intersections",
    href: "/intersections",
    category: "intermediate",
  },
  {
    title: "Generics",
    href: "/generics",
    category: "intermediate",
  },
  {
    title: "Tuples",
    href: "/tuples",
    category: "intermediate",
  },
  {
    title: "Utility Types",
    href: "/utility-types",
    category: "advanced",
  },
  {
    title: "Conditional Types",
    href: "/conditional-types",
    category: "advanced",
  },
  {
    title: "Mapped Types",
    href: "/mapped-types",
    category: "advanced",
  },
  {
    title: "Template Literal Types",
    href: "/template-literals",
    category: "advanced",
  },
];

export const Sidenav = () => {
  const pathname = usePathname();

  const basicItems = menuItems.filter((item) => item.category === "basic");
  const intermediateItems = menuItems.filter(
    (item) => item.category === "intermediate"
  );
  const advancedItems = menuItems.filter(
    (item) => item.category === "advanced"
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  <span className="font-semibold">TypeScript Examples</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {basicItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Basic</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {basicItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {intermediateItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Intermediate</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {intermediateItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        {advancedItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Advanced</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {advancedItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link href={item.href}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
