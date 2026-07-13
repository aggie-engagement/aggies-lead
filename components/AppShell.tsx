"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Compass,
  Database,
  Home,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Settings,
  Smartphone,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/components/AuthState";
import { dashboardForRole, roleLabels } from "@/lib/permissions";
import { readStudentAthletes } from "@/lib/studentAthleteDatabase";

const sidebarItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-roadmap", label: "My Roadmap", icon: Route },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/network", label: "Network", icon: Users },
  { href: "/opportunities", label: "Opportunities", icon: Compass },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/add-to-phone", label: "Add to Phone", icon: Smartphone },
  { href: "/profile", label: "Profile", icon: UserRound },
];

const homeNavItems = [
  { href: "/home", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/onboarding", label: "Profile Setup" },
  { href: "/app-tutorial", label: "Tutorial" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/my-roadmap", label: "My Roadmap" },
  { href: "/add-to-phone", label: "Add to Phone" },
];

function uniqueNavItemsByHref<T extends { href: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout, isReady } = useAuth();
  const isHome = pathname === "/";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const dashboardHref = dashboardForRole(role);
  const roleAwareSidebarItems = sidebarItems.map((item) =>
    item.href === "/dashboard" ? { ...item, href: dashboardHref } : item,
  );
  const visibleSidebarItems = role === "admin"
    ? [
        ...roleAwareSidebarItems,
        { href: "/admin/student-athlete-database", label: "Student Database", icon: Database },
        { href: "/admin/campus-locations", label: "Campus Locations", icon: MapPinned },
        { href: "/settings", label: "Settings", icon: Settings },
      ]
    : roleAwareSidebarItems;
  const roleAwareHomeItems = homeNavItems.map((item) =>
    item.href === "/dashboard" ? { ...item, href: dashboardHref } : item,
  );
  const visibleHomeItems = uniqueNavItemsByHref(roleAwareHomeItems);

  useEffect(() => {
    if (!isReady || !user || user.role !== "student-athlete") return;
    const publicPaths = ["/", "/login", "/forgot-password", "/activate-account"];
    if (publicPaths.includes(pathname)) return;
    if (user.mustChangePassword && pathname !== "/change-password") {
      router.replace("/change-password");
      return;
    }
    if (!user.mustChangePassword) {
      const record = readStudentAthletes().find(
        (item) => item.userId === user.id || item.email.toLowerCase() === user.email.toLowerCase(),
      );
      if (record?.profileStatus !== "Active" && record?.profileStatus !== "Active - TEST ACCOUNT" && pathname !== "/complete-profile") {
        router.replace("/complete-profile");
      }
    }
  }, [isReady, pathname, router, user]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-aggie-silver/15 bg-aggie-navy/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link href={user ? "/home" : "/"} className="flex items-center gap-3">
            <span className="chrome-surface grid h-11 w-11 place-items-center rounded-lg border border-aggie-chrome/50 text-sm font-black text-aggie-navy shadow-glow">
              AL
            </span>
            <span>
              <span className="text-glow block text-lg font-extrabold tracking-wide text-white">
                Aggies Lead
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.24em] text-aggie-silver">
                Utah State Athletics
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
          {isHome ? (
            <nav className="hidden gap-2 md:flex">
              {visibleHomeItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-transparent px-3 py-2 text-sm font-bold text-aggie-light/80 transition hover:border-aggie-silver/20 hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : (
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-lg border border-aggie-silver/20 text-aggie-light lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          {user && role ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="flex min-h-11 items-center gap-3 rounded-lg border border-aggie-silver/20 bg-white/[0.045] px-3 text-left transition hover:border-aggie-ice/40 hover:bg-white/10"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-aggie-silver/20 text-aggie-ice">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-black leading-5 text-white">{user.name}</span>
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-aggie-silver">{roleLabels[role]}</span>
                </span>
              </button>
              {accountOpen ? (
                <div className="absolute right-0 mt-2 w-72 rounded-lg border border-aggie-silver/15 bg-aggie-navy p-4 shadow-2xl">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-aggie-silver">Logged in as</p>
                  <p className="mt-2 text-lg font-black text-white">{user.name}</p>
                  <p className="mt-1 text-sm font-bold text-aggie-light/75">{roleLabels[role]}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen(false);
                      logout();
                    }}
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-red-300/25 bg-red-300/10 px-4 text-sm font-black text-aggie-light transition hover:bg-red-300/15"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg border border-aggie-silver/20 px-3 py-2 text-sm font-bold text-aggie-light/80 transition hover:border-aggie-silver/20 hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Login
            </Link>
          )}
          </div>
        </div>
      </header>

      {isHome ? (
        <main className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      ) : (
        <div
          className={`mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 transition-all duration-300 lg:px-8 lg:py-10 ${
            collapsed ? "lg:grid-cols-[84px_1fr]" : "lg:grid-cols-[240px_1fr]"
          }`}
        >
          <aside className="card-surface sticky top-28 hidden h-fit rounded-lg p-3 lg:block">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCollapsed((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-aggie-light transition hover:bg-white/10"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </button>
            </div>
            <SidebarNav collapsed={collapsed} pathname={pathname} items={visibleSidebarItems} />
          </aside>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm lg:hidden">
              <aside className="card-surface ml-auto h-full max-w-80 rounded-lg p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-aggie-silver">
                    Navigation
                  </p>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-lg border border-aggie-silver/20 text-aggie-light"
                    aria-label="Close navigation"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarNav collapsed={false} pathname={pathname} items={visibleSidebarItems} onNavigate={() => setMobileOpen(false)} />
              </aside>
            </div>
          )}
          <main className="min-w-0">{children}</main>
        </div>
      )}
    </div>
  );
}

function SidebarNav({
  collapsed,
  items,
  pathname,
  onNavigate,
}: {
  collapsed: boolean;
  items: typeof sidebarItems;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            data-testid={`sidebar-${item.label.toLowerCase().replaceAll(" ", "-")}`}
            title={item.label}
            className={`pointer-events-auto flex min-h-11 items-center rounded-lg px-3 text-sm font-bold transition ${
              collapsed ? "justify-center" : "gap-3"
            } ${
              active
                ? "chrome-surface text-aggie-navy shadow-steel"
                : "text-aggie-light/78 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        );
      })}
    </nav>
  );
}
