import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const links = [
    { href: '/', label: 'Վահանակ', icon: LayoutDashboard },
    { href: '/income', label: 'Եկամուտ', icon: TrendingUp },
    { href: '/expense', label: 'Ծախս', icon: TrendingDown },
    { href: '/analytics', label: 'Վերլուծություն', icon: BarChart3 },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🚗</div>
            <h1 className="text-xl font-bold">Ավտոդպրոց - Ֆինանսներ</h1>
          </div>
          
          <div className="flex gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
