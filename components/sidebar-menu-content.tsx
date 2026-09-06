"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

// Local storage key for saving collapsed state
const SIDEBAR_COLLAPSED_STATE_KEY = "sidebar-collapsed-state";

// Helper functions for localStorage with error handling
const saveToLocalStorage = (key: string, value: unknown) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return defaultValue;
  }
};

interface SidebarSubItem {
  name: string;
  url: string;
  icon?: LucideIcon;
  subItems?: {
    name: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

interface SidebarItem {
  name: string;
  url: string;
  icon?: LucideIcon;
  subItems?: SidebarSubItem[];
}

interface SidebarMenuContentProps {
  items: SidebarItem[];
}

export const SidebarMenuContent = React.memo(
  ({ items }: SidebarMenuContentProps) => {
    const pathname = usePathname();

    // Load initial state from localStorage on client-side only
    const [openIndices, setOpenIndices] = useState<Set<number>>(
      () => new Set()
    );
    const [isClient, setIsClient] = useState(false);

    // Track explicitly closed menus
    const [userClosedMenus, setUserClosedMenus] = useState<Set<number>>(
      () => new Set()
    );

    // State for nested (3rd-level) collapsibles
    const [openNestedKeys, setOpenNestedKeys] = useState<Set<string>>(
      () => new Set()
    );
    const [userClosedNestedKeys, setUserClosedNestedKeys] = useState<Set<string>>(
      () => new Set()
    );

    // Set isClient to true once component mounts
    useEffect(() => {
      setIsClient(true);
      const savedIndices = loadFromLocalStorage<number[]>(
        SIDEBAR_COLLAPSED_STATE_KEY,
        []
      );
      setOpenIndices(new Set(savedIndices));
    }, []);

    // Save to localStorage whenever state changes, but only on client side
    useEffect(() => {
      if (isClient) {
        const indicesArray = Array.from(openIndices);
        saveToLocalStorage(SIDEBAR_COLLAPSED_STATE_KEY, indicesArray);
      }
    }, [openIndices, isClient]);

    const handleToggle = useCallback((index: number) => {
      setOpenIndices((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
          newSet.delete(index);
          // Track that user explicitly closed this menu
          setUserClosedMenus((prev) => {
            const newClosed = new Set(prev);
            newClosed.add(index);
            return newClosed;
          });
        } else {
          newSet.add(index);
          // User opened this menu, remove from closed tracking
          setUserClosedMenus((prev) => {
            const newClosed = new Set(prev);
            newClosed.delete(index);
            return newClosed;
          });
        }
        return newSet;
      });
    }, []);

    const handleNestedToggle = useCallback((key: string) => {
      setOpenNestedKeys((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
          setUserClosedNestedKeys((prev) => {
            const newClosed = new Set(prev);
            newClosed.add(key);
            return newClosed;
          });
        } else {
          newSet.add(key);
          setUserClosedNestedKeys((prev) => {
            const newClosed = new Set(prev);
            newClosed.delete(key);
            return newClosed;
          });
        }
        return newSet;
      });
    }, []);

    // Auto expand parent menu when a sub-item is active - only runs on pathname change
    useEffect(() => {
      if (!isClient) return;

      const newOpenIndices = new Set<number>(openIndices);
      let hasChanges = false;

      const newNestedKeys = new Set<string>(openNestedKeys);
      let hasNestedChanges = false;

      items.forEach((item, index) => {
        if (item.subItems && item.subItems.length > 0) {
          // Check if any sub-items or their nested items match the current path
          const hasActiveSubItem = item.subItems.some(
            (subItem) =>
              pathname === subItem.url ||
              pathname.startsWith(subItem.url + "/") ||
              (subItem.subItems &&
                subItem.subItems.some(
                  (nested) =>
                    pathname === nested.url ||
                    pathname.startsWith(nested.url + "/")
                ))
          );

          // If a sub-item is active and user hasn't explicitly closed this menu, open it
          if (
            hasActiveSubItem &&
            !newOpenIndices.has(index) &&
            !userClosedMenus.has(index)
          ) {
            newOpenIndices.add(index);
            hasChanges = true;
          }

          // Auto-expand nested collapsibles
          item.subItems.forEach((subItem, subIndex) => {
            if (subItem.subItems && subItem.subItems.length > 0) {
              const nestedKey = `${index}-${subIndex}`;
              const hasActiveNestedItem = subItem.subItems.some(
                (nested) =>
                  pathname === nested.url ||
                  pathname.startsWith(nested.url + "/")
              );
              if (
                hasActiveNestedItem &&
                !newNestedKeys.has(nestedKey) &&
                !userClosedNestedKeys.has(nestedKey)
              ) {
                newNestedKeys.add(nestedKey);
                hasNestedChanges = true;
              }
            }
          });
        }
      });

      if (hasChanges) {
        setOpenIndices(newOpenIndices);
      }
      if (hasNestedChanges) {
        setOpenNestedKeys(newNestedKeys);
      }
    }, [pathname, items, isClient, userClosedMenus, openIndices, userClosedNestedKeys, openNestedKeys]);

    const excludedPaths = useMemo(
      () => [
        "/admin",
        "/admin-fakultas",
        "/superadmin",
        "/tugas-akhir",
        "/kerja-praktek",
        "/bimbingan-karir",
        "/fakultas",
        "/ews",
      ],
      []
    );

    // Sibling routes that should NOT activate the parent Dashboard item.
    // These are the other top-level EWS routes shown in the sidebar.
    const dashboardSiblingPaths = useMemo(
      () =>
        items
          .filter((it) => it.url !== "/ews")
          .map((it) => it.url),
      [items]
    );

    const isDashboardSiblings = useCallback(
      (url: string) =>
        url === "/ews" &&
        dashboardSiblingPaths.some(
          (sibling) => pathname === sibling || pathname.startsWith(sibling + "/")
        ),
      [pathname, dashboardSiblingPaths]
    );

    return (
      <SidebarGroup>
        <SidebarMenu>
          {items.map((item, index) => {
            const isActive =
              pathname === item.url ||
              (pathname.startsWith(item.url + "/") &&
                !item.subItems &&
                (!excludedPaths.includes(item.url) || item.url === "/ews") &&
                !isDashboardSiblings(item.url));

            // Jika tidak ada subItems, render sebagai menu biasa
            if (!item.subItems || item.subItems.length === 0) {
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={`py-3 px-4 h-auto relative ${isActive
                      ? "bg-primary-400/10 text-primary hover:bg-primary-400/10 hover:text-primary before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:bg-primary before:rounded-r-md"
                      : ""
                      }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Jika ada subItems, render sebagai collapsible
            return (
              <Collapsible
                key={item.name}
                asChild
                open={isClient && openIndices.has(index)}
                onOpenChange={() => handleToggle(index)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="py-3 px-4 h-auto" tooltip={item.name}>
                      {item.icon && <item.icon />}
                      <span>{item.name}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <SidebarMenuSub className="ml-[1.6rem] p-0">
                      {item.subItems.map((subItem, subIndex) => {
                        // If subItem has nested subItems, render as nested collapsible
                        if (subItem.subItems && subItem.subItems.length > 0) {
                          const nestedKey = `${index}-${subIndex}`;
                          const hasActiveNestedItem = subItem.subItems.some(
                            (nested) =>
                              pathname === nested.url ||
                              (pathname.startsWith(nested.url + "/") &&
                                !excludedPaths.includes(nested.url))
                          );

                          return (
                            <Collapsible
                              key={subItem.name}
                              open={isClient && openNestedKeys.has(nestedKey)}
                              onOpenChange={() => handleNestedToggle(nestedKey)}
                              className="group/nested"
                            >
                              <SidebarMenuSubItem>
                                <CollapsibleTrigger asChild>
                                  <button
                                    type="button"
                                    className={`flex w-full min-w-0 h-auto items-center gap-2 overflow-hidden rounded-md px-2 text-sm text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground !rounded-lg py-3 pl-4 ml-4 cursor-pointer ${hasActiveNestedItem
                                      ? "text-primary"
                                      : ""
                                      }`}
                                  >
                                    {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                    <span>{subItem.name}</span>
                                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/nested:rotate-90" />
                                  </button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                  <SidebarMenuSub className="ml-4 p-0">
                                    {subItem.subItems.map((nestedItem) => {
                                      const isNestedActive =
                                        pathname === nestedItem.url ||
                                        (pathname.startsWith(nestedItem.url + "/") &&
                                          !excludedPaths.includes(nestedItem.url));

                                      return (
                                        <SidebarMenuSubItem key={nestedItem.name}>
                                          <SidebarMenuSubButton
                                            asChild
                                            className={`!rounded-lg py-3 pl-4 ml-4 h-auto ${isNestedActive
                                              ? "bg-primary-400/10 text-primary [&_icon]:text-primary hover:bg-primary-400/10 hover:text-primary before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:bg-primary before:rounded-r-md"
                                              : ""
                                              }`}
                                          >
                                            <Link href={nestedItem.url}>
                                              {nestedItem.icon && (
                                                <nestedItem.icon
                                                  className={isNestedActive ? "!text-primary" : ""}
                                                />
                                              )}
                                              <span>{nestedItem.name}</span>
                                            </Link>
                                          </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                      );
                                    })}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </SidebarMenuSubItem>
                            </Collapsible>
                          );
                        }

                        // Regular link sub-item (no nested children)
                        const isSubActive =
                          pathname === subItem.url ||
                          (pathname.startsWith(subItem.url + "/") &&
                            !excludedPaths.includes(subItem.url));

                        return (
                          <SidebarMenuSubItem key={subItem.name}>
                            <SidebarMenuSubButton
                              asChild
                              className={`!rounded-lg py-3 pl-4 ml-4 h-auto ${isSubActive
                                ? "bg-primary-400/10 text-primary [&_icon]:text-primary hover:bg-primary-400/10 hover:text-primary before:absolute before:top-2 before:bottom-2 before:left-0 before:w-1 before:bg-primary before:rounded-r-md"
                                : ""
                                }`}
                            >
                              <Link href={subItem.url}>
                                {subItem.icon && (
                                  <subItem.icon
                                    className={`${isSubActive ? "!text-primary" : ""
                                      }`}
                                  />
                                )}
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    );
  }
);

SidebarMenuContent.displayName = "SidebarMenuContent";
