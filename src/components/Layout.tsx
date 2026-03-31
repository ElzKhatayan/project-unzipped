import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  History,
  Bell,
  FileText,
  Brain,
  Menu,
  Truck,
  ClipboardList,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  Search,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Suppliers', href: '/suppliers', icon: Truck },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'ML Insights', href: '/ml-insights', icon: Brain },
  { name: 'Audit Log', href: '/audit-log', icon: ClipboardList },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const NavLinks = ({ showLabels = true }: { showLabels?: boolean }) => (
    <div className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative',
              isActive
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:bg-primary/10 hover:text-foreground'
            )}
          >
            <item.icon className={cn("h-5 w-5 shrink-0", isActive && "drop-shadow-sm")} />
            {showLabels && (
              <span className="truncate">{item.name}</span>
            )}
            {isActive && (
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 rounded-lg bg-primary -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl shadow-sm">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">InvenTrack</h2>
                      <p className="text-xs text-muted-foreground">Smart IMS</p>
                    </div>
                  </div>
                </div>
                <nav className="flex-1 p-4 overflow-y-auto">
                  <NavLinks />
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <Package className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold leading-tight">InvenTrack</h1>
              <p className="text-[11px] text-muted-foreground -mt-0.5">Inventory Management System</p>
            </div>
          </div>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, transactions, suppliers..."
                className="pl-9 bg-secondary/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Link to="/alerts">
              <Button variant="ghost" size="icon" className="relative h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                  5
                </span>
              </Button>
            </Link>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center ml-1 cursor-pointer shadow-md">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={cn(
          "hidden md:flex flex-col border-r bg-card/50 transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)]",
          collapsed ? "w-16" : "w-64"
        )}>
          <nav className="flex-1 p-3 overflow-y-auto">
            <NavLinks showLabels={!collapsed} />
          </nav>
          <div className="border-t p-3">
            {!collapsed && (
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 p-4 text-sm mb-3">
                <p className="font-semibold text-primary">Backend Ready</p>
                <p className="text-xs text-muted-foreground mt-1">
                  ASP.NET Core + SignalR
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="container max-w-7xl p-4 md:p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
