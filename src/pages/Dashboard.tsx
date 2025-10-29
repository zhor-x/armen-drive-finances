import { StatCard } from '@/components/StatCard';
import { CategorySummary } from '@/components/CategorySummary';
import { useFinanceData } from '@/hooks/useFinanceData';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { hy } from 'date-fns/locale';

const Dashboard = () => {
  const { summary, transactions, incomeCategories, expenseCategories, deleteCategory } = useFinanceData();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getCategoryById = (id: string) => {
    return [...incomeCategories, ...expenseCategories].find(c => c.id === id);
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ֆինանսական ակնարկ</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Ավտոդպրոցի ընդհանուր ֆինանսական վիճակ</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Ընդհանուր եկամուտ"
          amount={summary.totalIncome}
          icon={TrendingUp}
          type="income"
        />
        <StatCard
          title="Ընդհանուր ծախս"
          amount={summary.totalExpense}
          icon={TrendingDown}
          type="expense"
        />
        <StatCard
          title="Մնացորդ"
          amount={summary.balance}
          icon={Wallet}
          type="balance"
        />
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <CategorySummary
          categories={incomeCategories}
          categoryTotals={summary.incomeByCategory}
          total={summary.totalIncome}
          type="income"
          onDeleteCategory={(id) => deleteCategory(id, 'income')}
        />
        <CategorySummary
          categories={expenseCategories}
          categoryTotals={summary.expenseByCategory}
          total={summary.totalExpense}
          type="expense"
          onDeleteCategory={(id) => deleteCategory(id, 'expense')}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Վերջին գործարքներ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(transaction.category_id);
              return (
                <div key={transaction.id} className="flex items-start sm:items-center justify-between p-3 rounded-lg bg-accent/50 gap-2">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="text-xl sm:text-2xl flex-shrink-0">{category?.icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base truncate">{category?.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {format(new Date(transaction.date), 'dd MMM yyyy', { locale: hy })}
                      </p>
                      {transaction.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground truncate sm:hidden">
                          {transaction.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold text-sm sm:text-base ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-muted-foreground max-w-[150px] truncate hidden sm:block">
                        {transaction.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
