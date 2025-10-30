import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransactionDialog } from '@/components/TransactionDialog';
import { CategoryDialog } from '@/components/CategoryDialog';
import { TransactionsTable } from '@/components/TransactionsTable';
import { CategorySummary } from '@/components/CategorySummary';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { useFinanceData } from '@/hooks/useFinanceData';
import { exportToCSV } from '@/utils/export';
import { Download, TrendingUp } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import type { Transaction } from '@/types/finance';

const LIMIT = 20;

const isValidTransaction = (t: any): t is Transaction =>
    !!t && typeof t === 'object' && 'id' in t && 'amount' in t;

const Income = () => {
  const {
    incomeCategories,
    getTransactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory
  } = useFinanceData();

  // States
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [localTransactions, setLocalTransactions] = useState<Transaction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split('T')[0];
  const [dates, setDates] = useState<string[]>([firstDayOfMonth, lastDayOfMonth]);

  // Default current month dates
  useEffect(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split('T')[0];
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split('T')[0];
    setDates([firstDayOfMonth, lastDayOfMonth]);
  }, []);

  // Update dates when dateRange changes
  useEffect(() => {
    if (dateRange?.from) {
      const start = new Date(dateRange.from);
      const end = dateRange.to ? new Date(dateRange.to) : start;
      setDates([
        start.toISOString().split('T')[0],
        end.toISOString().split('T')[0],
      ]);
    }
  }, [dateRange]);

  // Build fetch object for API
  const buildFetchObject = (offset: number) => {
    const obj: any = {
      type: 'income',
      limit: LIMIT,
      offset,
    };
    if (searchTerm) obj.q = searchTerm;
    if (dates.length === 2) obj.dates = dates;
    return obj;
  };

  // Load transactions with infinite scroll
  const loadTransactions = async (reset = false) => {
    if (isLoading) return;
    setIsLoading(true);

    const currentOffset = reset ? 0 : localTransactions.length;

    const fetched = (await getTransactions(buildFetchObject(currentOffset))) ?? [];

    // pagination flag
    setHasMore(fetched.length >= LIMIT);

    // sanitize
    const cleanedFetched = fetched.filter(isValidTransaction);

    if (reset) {
      setLocalTransactions(cleanedFetched);
    } else {
      setLocalTransactions(prev => {
        const combined = [...prev, ...cleanedFetched].filter(isValidTransaction);
        const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());
        return unique;
      });
    }

    setIsLoading(false);
  };

  // Load/reset transactions when filters/search change
  useEffect(() => {
    loadTransactions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, dateRange]);

  // Calculate total income for summary (safe)
  const filteredIncome = localTransactions.reduce((sum, t) => {
    if (!t || t.amount == null) return sum;
    const n = Number(t.amount);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  const formatAmount = (num: number) =>
      new Intl.NumberFormat('hy-AM', {
        style: 'currency',
        currency: 'AMD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(num);

  const handleExport = () => {
    exportToCSV(localTransactions, incomeCategories, 'եկամուտներ.csv');
  };

  // Keep local list consistent when deleting/updating
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setLocalTransactions(prev => prev.filter(t => t?.id !== id));
    } catch (e) {
      console.error('Error deleting transaction:', e);
    }
  };

  const handleUpdateTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      await updateTransaction(id, transaction);
      setLocalTransactions(prev =>
          prev
              .filter(isValidTransaction)
              .map(t => (t.id === id ? { ...t, ...transaction } : t))
      );
    } catch (e) {
      console.error('Error updating transaction:', e);
    }
  };

  // ✅ HERE: Safe handleAddTransaction
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const created = await addTransaction(transaction);

      // If backend didn’t return a full object (or returned void/bool), refetch to avoid inserting undefined
      if (!isValidTransaction(created)) {
        await loadTransactions(true);
        return;
      }

      setLocalTransactions(prev => {
        const next = [created, ...prev].filter(isValidTransaction);
        const unique = Array.from(new Map(next.map(t => [t.id, t])).values());
        return unique;
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
      <div className="container mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Header */}
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
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Արտահանել
            </Button>
            <CategoryDialog onAdd={addCategory} type="income" />
            <TransactionDialog
                categories={incomeCategories}
                onAdd={handleAddTransaction}
                type="income"
            />
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-income">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <p className="text-xs sm:text-sm font-medium text-white/90 mb-2">
                {dateRange?.from ? 'Ընտրված ժամանակահատված' : 'Ընդհանուր եկամուտ'}
              </p>
              <p className="text-2xl sm:text-4xl font-bold text-white">{formatAmount(filteredIncome)}</p>
              {dateRange?.from && (
                  <p className="text-xs sm:text-sm text-white/80 mt-2">
                    Ընդհանուր: {formatAmount(Number(summary.totalIncome) || 0)}
                  </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table and Category Summary */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Բոլոր գործարքները</CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionsTable
                    transactions={localTransactions}
                    categories={incomeCategories}
                    onDelete={handleDeleteTransaction}
                    onUpdate={handleUpdateTransaction}
                    type="income"
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    loadMore={loadTransactions}
                    hasMore={hasMore}
                    isLoading={isLoading}
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
                onDeleteCategory={(id: string) => deleteCategory(id, 'income')}
            />
          </div>
        </div>
      </div>
  );
};

export default Income;
