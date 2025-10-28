import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3, Menu, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Դուք դուրս եկաք');
    navigate('/login');
  };

  const links = [
    { href: '/', label: 'Վահանակ', icon: LayoutDashboard },
    { href: '/income', label: 'Եկամուտ', icon: TrendingUp },
    { href: '/expense', label: 'Ծախս', icon: TrendingDown },
    { href: '/analytics', label: 'Վերլուծություն', icon: BarChart3 },
  ];

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.href;
        
        return (
          <Link
            key={link.href}
            to={link.href}
            onClick={() => mobile && setOpen(false)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
              mobile ? 'w-full' : '',
              isActive
                ? 'bg-primary text-primary-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className={mobile ? '' : 'hidden sm:inline'}>{link.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-2xl">🚗</div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold truncate">Ավտոդպրոց - Ֆինանսներ</h1>
              {user && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {user.email}
                </span>
              )}
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <NavLinks />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Ելք
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="mt-8 flex flex-col gap-2">
                <NavLinks mobile />
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="justify-start gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Ելք
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
