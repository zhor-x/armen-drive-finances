import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionDialog } from '@/components/TransactionDialog';
import { CategoryDialog } from '@/components/CategoryDialog';
import { TransactionsTable } from '@/components/TransactionsTable';
import { CategorySummary } from '@/components/CategorySummary';
import { useFinanceData } from '@/hooks/useFinanceData';
import { TrendingDown } from 'lucide-react';

const Expense = () => {
  const { expenseCategories, transactions, summary, addTransaction, deleteTransaction, addCategory, deleteCategory } = useFinanceData();

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingDown className="h-8 w-8 text-destructive" />
            Ծախսեր
          </h2>
          <p className="text-muted-foreground">
            Ավտոդպրոցի բոլոր ծախսերը և դրանց կատեգորիաները
          </p>
        </div>
        <div className="flex gap-2">
          <CategoryDialog onAdd={addCategory} type="expense" />
          <TransactionDialog
            categories={expenseCategories}
            onAdd={addTransaction}
            type="expense"
          />
        </div>
      </div>

      <Card className="bg-gradient-expense">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-white/90 mb-2">Ընդհանուր ծախս</p>
            <p className="text-4xl font-bold text-white">{formatAmount(summary.totalExpense)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Բոլոր գործարքները</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                transactions={transactions}
                categories={expenseCategories}
                onDelete={deleteTransaction}
                type="expense"
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <CategorySummary
            categories={expenseCategories}
            categoryTotals={summary.expenseByCategory}
            total={summary.totalExpense}
            type="expense"
            onDeleteCategory={(id) => deleteCategory(id, 'expense')}
          />
        </div>
      </div>
    </div>
  );
};

export default Expense;
