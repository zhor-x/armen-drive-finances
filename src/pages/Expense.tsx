import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionDialog } from '@/components/TransactionDialog';
import { CategoryDialog } from '@/components/CategoryDialog';
import { TransactionsTable } from '@/components/TransactionsTable';
import { CategorySummary } from '@/components/CategorySummary';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { useFinanceData } from '@/hooks/useFinanceData';
import { exportToCSV } from '@/utils/export';
import { TrendingDown, Download } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { isWithinInterval } from 'date-fns';

const Expense = () => {
  const { expenseCategories, transactions, summary, addTransaction, updateTransaction, deleteTransaction, addCategory, deleteCategory } = useFinanceData();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredTransactions = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    if (!dateRange?.from) return true;
    const transactionDate = new Date(t.date);
    if (dateRange.to) {
      return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to });
    }
    return transactionDate >= dateRange.from;
  });

  const filteredExpense = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleExport = () => {
    exportToCSV(filteredTransactions, expenseCategories, 'ծախսեր.csv');
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
            Ծախսեր
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Ավտոդպրոցի բոլոր ծախսերը և դրանց կատեգորիաները
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto flex-wrap">
          <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Արտահանել
          </Button>
          <CategoryDialog onAdd={addCategory} type="expense" />
          <TransactionDialog
            categories={expenseCategories}
            onAdd={addTransaction}
            type="expense"
          />
        </div>
      </div>

      <Card className="bg-gradient-expense">
        <CardContent className="p-4 sm:p-6">
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-white/90 mb-2">
              {dateRange?.from ? 'Ընտրված ժամանակահատված' : 'Ընդհանուր ծախս'}
            </p>
            <p className="text-2xl sm:text-4xl font-bold text-white">{formatAmount(filteredExpense)}</p>
            {dateRange?.from && (
              <p className="text-xs sm:text-sm text-white/80 mt-2">
                Ընդհանուր: {formatAmount(summary.totalExpense)}
              </p>
            )}
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
                transactions={dateRange?.from ? filteredTransactions : transactions}
                categories={expenseCategories}
                onDelete={deleteTransaction}
                onUpdate={updateTransaction}
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
