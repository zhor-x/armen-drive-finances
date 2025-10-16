import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Category } from '@/types/finance';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CategorySummaryProps {
  categories: Category[];
  categoryTotals: Record<string, number>;
  total: number;
  type: 'income' | 'expense';
  onDeleteCategory: (id: string) => void;
}

export const CategorySummary = ({ categories, categoryTotals, total, type, onDeleteCategory }: CategorySummaryProps) => {
  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const title = type === 'income' ? 'Եկամուտ ըստ կատեգորիաների' : 'Ծախս ըստ կատեգորիաների';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => {
          const amount = categoryTotals[category.id] || 0;
          const percentage = total > 0 ? (amount / total) * 100 : 0;

          return (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${type === 'income' ? 'text-success' : 'text-destructive'}`}>
                    {formatAmount(amount)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteCategory(category.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}

        {categories.length === 0 && (
          <p className="text-center text-muted-foreground">Կատեգորիաներ չկան</p>
        )}
      </CardContent>
    </Card>
  );
};
