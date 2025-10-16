import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  type?: 'income' | 'expense' | 'balance';
  trend?: string;
}

export const StatCard = ({ title, amount, icon: Icon, type = 'balance', trend }: StatCardProps) => {
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const gradientClass = {
    income: 'bg-gradient-income',
    expense: 'bg-gradient-expense',
    balance: 'bg-gradient-balance',
  }[type];

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
      'border-none',
      gradientClass
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/90">{title}</p>
            <p className="text-3xl font-bold text-white">{formatAmount(amount)}</p>
            {trend && (
              <p className="text-xs text-white/80">{trend}</p>
            )}
          </div>
          <div className="rounded-lg bg-white/20 p-3">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
