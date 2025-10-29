import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Category } from '@/types/finance';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface CategorySummaryProps {
  categories: Category[];
  categoryTotals: Record<string, number>;
  total: number;
  type: 'income' | 'expense';
  onDeleteCategory: (id: string) => void;
}

export const CategorySummary = ({ categories, categoryTotals, total, type, onDeleteCategory }: CategorySummaryProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
        <CardContent className="space-y-4  h-[500px] overflow-y-auto">
          {categories.map((category) => {
            const amount = categoryTotals[category.id] || 0;
            const percentage = total > 0 ? (amount / total) * 100 : 0;

             return (
                <div key={category.id} className="space-y-2 ">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-lg sm:text-xl flex-shrink-0">{category.icon}</span>
                      <span className="font-medium text-sm sm:text-base truncate">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <span className={`font-semibold text-xs sm:text-sm ${type === 'income' ? 'text-success' : 'text-destructive'}`}>
                    {formatAmount(amount)}
                  </span>
                      <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(category.id)}
                          className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-xs sm:text-sm text-muted-foreground w-10 sm:w-12 text-right flex-shrink-0">
                  {percentage.toFixed(0)}%
                </span>
                  </div>
                </div>
            );
          })}

          {categories.length === 0 && (
              <p className="text-center text-muted-foreground">Կատեգորիաներ չկան</p>
          )}

          <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Հաստատեք ջնջումը</AlertDialogTitle>
                <AlertDialogDescription>
                  Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս կատեգորիան։ Բոլոր կապակցված գործարքները նույնպես կջնջվեն։ Այս գործողությունը հնարավոր չէ հետարկել։
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => {
                      if (deleteId) {
                        onDeleteCategory(deleteId);
                        setDeleteId(null);
                      }
                    }}
                >
                  Ջնջել
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
  );
};