"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  User,
  LogOut,
  ExternalLink,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface DashboardSidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedLink, setCopiedLink] = useState(false);

  // Clear navigating state when pathname changes (navigation complete)
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  // Persist collapsed state
  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar-collapsed", String(next));
    // Dispatch custom event so layout can react
    window.dispatchEvent(new CustomEvent("sidebar-toggle", { detail: next }));
  };

  const handleLogout = async () => {
    const loadingId = toast.loading("Logging out...");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Logged out successfully!", { id: loadingId });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch {
      toast.error("Failed to logout. Please try again.", { id: loadingId });
    }
  };

  const handleCopyStoreLink = async () => {
    const storeUrl = `${window.location.origin}/store/${user.id}`;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopiedLink(true);
      toast.success("Store link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Failed to copy link. Please try again.");
    }
  };

  const sidebarContent = (forMobile = false) => (
    <>
      {/* User Account */}
      <div
        className={cn(
          "border-b border-gray-100/80 dark:border-gray-800 flex items-center",
          forMobile || !collapsed ? "px-5 py-4 gap-2.5" : "px-0 py-4 justify-center"
        )}
      >
        <Link href="/dashboard/profile" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 bg-linear-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-xl flex items-center justify-center text-violet-700 dark:text-violet-400 text-xs font-bold shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-300"
            title={collapsed && !forMobile ? user.name : undefined}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          {(forMobile || !collapsed) && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-4 space-y-1", forMobile || !collapsed ? "px-3" : "px-2")}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const isLoading = navigatingTo === item.href && isPending;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setMobileOpen(false);
                // If already on this page, don't show loading
                if (isActive) return;
                startTransition(() => {
                  setNavigatingTo(item.href);
                });
              }}
              title={collapsed && !forMobile ? item.label : undefined}
              className={cn(
                "flex items-center rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                forMobile || !collapsed
                  ? "gap-3 px-3 py-2.5"
                  : "justify-center px-0 py-2.5",
                isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm shadow-gray-900/10"
                  : isLoading
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {isLoading ? (
                <Loader2 className={cn("w-4.5 h-4.5 shrink-0 animate-spin", "text-violet-500 dark:text-violet-400")} />
              ) : (
                <Icon className={cn("w-4.5 h-4.5 shrink-0", isActive ? "text-white dark:text-gray-900" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
              )}
              {(forMobile || !collapsed) && <span>{item.label}</span>}
              {/* Tooltip for collapsed mode */}
              {collapsed && !forMobile && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        <hr className="my-3 border-gray-100 dark:border-gray-800" />

        <div className="flex items-center gap-1.5 px-1.5">
          <Link
            href={`/store/${user.id}`}
            target="_blank"
            onClick={() => setMobileOpen(false)}
            title={collapsed && !forMobile ? "View Store" : undefined}
            className={cn(
              "flex-1 flex items-center rounded-xl text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 group relative",
              forMobile || !collapsed ? "gap-3 px-3 py-2.5" : "justify-center px-0 py-2.5"
            )}
          >
            <ExternalLink className="w-4.5 h-4.5 shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            {(forMobile || !collapsed) && <span>View Store</span>}
            {collapsed && !forMobile && (
              <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                View Store
              </span>
            )}
          </Link>

          <button
            onClick={handleCopyStoreLink}
            title={copiedLink ? "Link copied!" : "Copy store link"}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200",
              copiedLink
                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            {copiedLink ? (
              <Check className="w-4.5 h-4.5" />
            ) : (
              <Copy className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </nav>

      {/* Collapse toggle — desktop only */}
      {!forMobile && (
        <div className="px-3 py-2 border-t border-gray-100/80 dark:border-gray-800 flex items-center gap-1">
          <button
            onClick={toggleCollapse}
            className={cn(
              "flex items-center rounded-xl text-[13px] font-medium text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200 flex-1",
              collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="w-4.5 h-4.5" />
            ) : (
              <>
                <PanelLeftClose className="w-4.5 h-4.5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Dark Mode & Sign Out */}
      <div className={cn("py-3 border-t border-gray-100/80 dark:border-gray-800", forMobile || !collapsed ? "px-3" : "px-2")}>
        <div
          className={cn(
            "flex items-center mb-1",
            forMobile || !collapsed ? "gap-3 px-3 py-2.5" : "justify-center py-2.5"
          )}
        >
          <ThemeToggle />
          {(forMobile || !collapsed) && (
            <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">Theme</span>
          )}
        </div>
        <button
          onClick={handleLogout}
          title={collapsed && !forMobile ? "Sign Out" : undefined}
          className={cn(
            "flex items-center w-full rounded-xl text-[13px] font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group relative",
            forMobile || !collapsed ? "gap-3 px-3 py-2.5" : "justify-center py-2.5"
          )}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {(forMobile || !collapsed) && <span>Sign Out</span>}
          {collapsed && !forMobile && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/20 rounded-xl flex items-center justify-center text-violet-700 dark:text-violet-400 text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user.name}
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          {mobileOpen ? <X className="w-5 h-5 dark:text-gray-300" /> : <Menu className="w-5 h-5 dark:text-gray-300" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 w-72 h-full bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 flex flex-col transform transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent(true)}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed top-0 left-0 h-full bg-white dark:bg-gray-950 border-r border-gray-100/80 dark:border-gray-800 flex-col z-30 transition-[width] duration-300 ease-in-out",
          collapsed ? "w-17" : "w-60"
        )}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}
