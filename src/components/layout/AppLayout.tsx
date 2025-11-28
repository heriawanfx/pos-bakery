import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Boxes,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  ReceiptText,
  SettingsIcon,
  LogOut, // 👈 tambahkan ini
} from "lucide-react";
import clsx from "clsx";
import { ThemeToggle } from "../ThemeToggle";
import { useSettingsStore } from "../../stores/useSettingsStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { Button } from "../ui/Button";

interface AppLayoutProps {
  children?: ReactNode;
}

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/ingredients", label: "Ingredients", icon: Utensils },
  { to: "/categories", label: "Categories", icon: Boxes },
  { to: "/products", label: "Products", icon: ShoppingCart },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders", label: "Orders", icon: ReceiptText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { settings } = useSettingsStore();
  const { app_name, tagline } = settings;
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCloseMobile = () => setMobileOpen(false);

  const renderNavItems = (onNavigate?: () => void) =>
    navItems.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
          onClick={onNavigate}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      );
    });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar (auto expanded on md+) */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            🧁
          </div>
          <div>
            <div className="text-sm font-semibold">{app_name}</div>
            <div className="text-xs text-muted-foreground">
              {tagline}
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {renderNavItems()}
        </nav>

        <div className="mt-auto border-t border-border px-4 py-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <NavLink
          key={"/settings"}
          to={"/settings"} >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </div>
          </NavLink>
        </div>
      </aside>

      {/* Mobile Sidebar / Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={handleCloseMobile}
          />
          {/* Drawer */}
          <div className="w-72 max-w-[80%] bg-card border-l border-border flex flex-col">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  🧁
                </div>
                <div>
                  <div className="text-sm font-semibold">{app_name}</div>
                  <div className="text-xs text-muted-foreground">
                    {tagline}
                  </div>
                </div>
              </div>
              <button
                className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                onClick={handleCloseMobile}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {renderNavItems(handleCloseMobile)}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Hamburger for mobile/tablet */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Logo + title (mobile shows compact, desktop shows text) */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                🧁
              </div>
              <span className="text-sm font-semibold">{app_name}</span>
            </div>

            <div className="hidden md:block text-sm font-semibold">
              {tagline}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
           <div className="flex items-center gap-2">
        {/* Theme toggle dsb */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
        </header>

        {/* Content area */}
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
          <div className="mx-auto max-w-5xl">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
