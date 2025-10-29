import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {TransactionDialog} from '@/components/TransactionDialog';
import {CategoryDialog} from '@/components/CategoryDialog';
import {TransactionsTable} from '@/components/TransactionsTable';
import {CategorySummary} from '@/components/CategorySummary';
import {DateRangeFilter} from '@/components/DateRangeFilter';
import {useFinanceData} from '@/hooks/useFinanceData';
import {exportToCSV} from '@/utils/export';
import {Download, TrendingUp} from 'lucide-react';
import {DateRange} from 'react-day-picker';
import {isWithinInterval} from 'date-fns';
import {Transaction} from "@/types/finance.ts";

const Income = () => {
  const { incomeCategories, transactions, summary, addTransaction, updateTransaction, deleteTransaction, addCategory, deleteCategory } = useFinanceData();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [minAmount, setMinAmount] = useState<number | ''>('');

  // ✅ Filter logic
  const filteredTransactions = transactions.filter((t) => {
    if (t.type !== 'income') return false;

    // Date filter
    if (dateRange?.from) {
      const transactionDate = new Date(t.date);
      if (dateRange.to) {
        if (!isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to }))
          return false;
      } else if (transactionDate < dateRange.from) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'all' && t.category_id !== selectedCategory)
      return false;

    // Min amount filter
    if (minAmount && parseFloat(t.amount as never) < minAmount)
      return false;

    return true;
  });

  const filteredIncome = filteredTransactions.reduce(
      (sum, t: Transaction) => sum + parseFloat(t.amount as never),
      0
  );

  const formatAmount = (num: number) =>
      new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);

  const handleExport = () => {
    exportToCSV(filteredTransactions, incomeCategories, 'եկամուտներ.csv');
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
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Արտահանել
            </Button>
            <CategoryDialog onAdd={addCategory} type="income" />
            <TransactionDialog
                categories={incomeCategories}
                onAdd={addTransaction}
                type="income"
            />
          </div>
        </div>

        <Card className="bg-gradient-income">
          <CardContent className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm font-medium text-white/90 mb-2">
              {dateRange?.from ? 'Ընտրված ժամանակահատված' : 'Ընդհանուր եկամուտ'}
            </p>
            <p className="text-2xl sm:text-4xl font-bold text-white">
              {formatAmount(filteredIncome)}
            </p>
            {dateRange?.from && (
                <p className="text-xs sm:text-sm text-white/80 mt-2">
                  Ընդհանուր: {formatAmount(summary.totalIncome)}
                </p>
            )}
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
                    transactions={filteredTransactions}
                    categories={incomeCategories}
                    onDelete={deleteTransaction}
                    onUpdate={updateTransaction}
                    type="income"
                />
              </CardContent>
            </Card>
          </div>

          <CategorySummary
              categories={incomeCategories}
              categoryTotals={summary.incomeByCategory}
              total={summary.totalIncome}
              type="income"
              onDeleteCategory={(id) => deleteCategory(id, 'income')}
          />
        </div>
      </div>
  );
};

export default Income;
