import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionDialog } from '@/components/TransactionDialog';
import { CategoryDialog } from '@/components/CategoryDialog';
import { TransactionsTable } from '@/components/TransactionsTable';
import { CategorySummary } from '@/components/CategorySummary';
import { useFinanceData } from '@/hooks/useFinanceData';
import { TrendingUp } from 'lucide-react';

const Income = () => {
  const { incomeCategories, transactions, summary, addTransaction, deleteTransaction, addCategory, deleteCategory } = useFinanceData();

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
            Եկամուտներ
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Ավտոդպրոցի բոլոր եկամուտները և դրանց կատեգորիաները
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <CategoryDialog onAdd={addCategory} type="income" />
          <TransactionDialog
            categories={incomeCategories}
            onAdd={addTransaction}
            type="income"
          />
        </div>
      </div>

      <Card className="bg-gradient-income">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-white/90 mb-2">Ընդհանուր եկամուտ</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">{formatAmount(summary.totalIncome)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Բոլոր գործարքները</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                transactions={transactions}
                categories={incomeCategories}
                onDelete={deleteTransaction}
                type="income"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <CategorySummary
            categories={incomeCategories}
            categoryTotals={summary.incomeByCategory}
            total={summary.totalIncome}
            type="income"
            onDeleteCategory={(id) => deleteCategory(id, 'income')}
          />
        </div>
      </div>
    </div>
  );
};

export default Income;
