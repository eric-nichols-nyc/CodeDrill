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
    title: "Scope",
    href: "/scope",
    category: "fundamentals",
  },
  {
    title: "Hoisting",
    href: "/hoisting",
    category: "fundamentals",
  },
  {
    title: "Closures",
    href: "/closures",
    category: "fundamentals",
  },
  {
    title: "This Keyword",
    href: "/this-keyword",
    category: "fundamentals",
  },
  {
    title: "Event Loop",
    href: "/event-loop",
    category: "asynchronous",
  },
  {
    title: "Promises",
    href: "/promises",
    category: "asynchronous",
  },
  {
    title: "Async/Await",
    href: "/async-await",
    category: "asynchronous",
  },
  {
    title: "Prototype",
    href: "/prototype",
    category: "objects",
  },
  {
    title: "Prototype Chain",
    href: "/prototype-chain",
    category: "objects",
  },
  {
    title: "Class vs Prototype",
    href: "/class-vs-prototype",
    category: "objects",
  },
  {
    title: "Generators",
    href: "/generators",
    category: "advanced",
  },
  {
    title: "Iterators",
    href: "/iterators",
    category: "advanced",
  },
  {
    title: "Modules",
    href: "/modules",
    category: "advanced",
  },
];

export const Sidenav = () => {
  const pathname = usePathname();

  const fundamentalItems = menuItems.filter(
    (item) => item.category === "fundamentals"
  );
  const asynchronousItems = menuItems.filter(
    (item) => item.category === "asynchronous"
  );
  const objectsItems = menuItems.filter((item) => item.category === "objects");
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
                  <span className="font-semibold">JavaScript Concepts</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {fundamentalItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Fundamentals</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {fundamentalItems.map((item) => (
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
        {asynchronousItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Asynchronous</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {asynchronousItems.map((item) => (
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
        {objectsItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Objects & Prototypes</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {objectsItems.map((item) => (
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
