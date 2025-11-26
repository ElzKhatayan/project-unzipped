import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  History,
  Bell,
  FileText,
  Brain,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'ML Insights', href: '/ml-insights', icon: Brain },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary text-primary-foreground shadow-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-soft">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-6">
                  <h2 className="text-lg font-bold gradient-primary bg-clip-text text-transparent">
                    Inventory IMS
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Smart Management System
                  </p>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  <NavLinks />
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary" />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold">Inventory IMS</h1>
              <p className="text-xs text-muted-foreground">Smart Management System</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                3
              </span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-card">
          <nav className="flex-1 space-y-1 p-4">
            <NavLinks />
          </nav>
          <div className="border-t p-4">
            <div className="rounded-lg bg-primary/10 p-3 text-sm">
              <p className="font-medium text-primary">Ready for Backend</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect to C#/.NET API
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container max-w-7xl p-4 md:p-6 lg:p-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
