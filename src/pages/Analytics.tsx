import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinanceData } from '@/hooks/useFinanceData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { hy } from 'date-fns/locale';

const Analytics = () => {
  const { summary, incomeCategories, expenseCategories, transactions } = useFinanceData();

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const incomeData = incomeCategories.map(cat => ({
    name: cat.name,
    amount: summary.incomeByCategory[cat.id] || 0,
  })).filter(item => item.amount > 0);

  const expenseData = expenseCategories.map(cat => ({
    name: cat.name,
    amount: summary.expenseByCategory[cat.id] || 0,
  })).filter(item => item.amount > 0);

  const comparisonData = [
    {
      name: 'Ֆինանսական ակնարկ',
      'Եկամուտ': summary.totalIncome,
      'Ծախս': summary.totalExpense,
      'Շահույթ': summary.balance,
    }
  ];

  // Monthly trend data
  const monthlyData = (() => {
    const grouped: Record<string, { income: number; expense: number }> = {};

    transactions.forEach(t => {
      const monthKey = format(parseISO(t.date), 'yyyy-MM');
      if (!grouped[monthKey]) grouped[monthKey] = { income: 0, expense: 0 };
      if (t.type === 'income') grouped[monthKey].income += parseFloat(t.amount);
      else grouped[monthKey].expense += parseFloat(t.amount);
    });

    Object.keys(grouped).map(key => {
      console.log(grouped[key])
    });

    return Object.keys(grouped)
        .sort()
        .slice(-6)
        .map(key => ({

          month: format(parseISO(key + '-01'), 'MMM', { locale: hy }),
          Եկամուտ: grouped[key].income,
          Ծախս: grouped[key].expense,
          Շահույթ: grouped[key].income - parseFloat(grouped[key].expense),
        }));
  })();

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // --- Custom Pie label outside the slice ---
  const renderPieLabel = (entry: any) => {
    const name = entry.name.length > 12 ? entry.name.slice(0, 12) + '…' : entry.name;
    const percent = ((entry.amount / entry.total) * 100).toFixed(0) + '%';
    return `${name} ${percent}`;
  };

  const incomeDataWithTotal = incomeData.map(d => ({ ...d, total: summary.totalIncome }));
  const expenseDataWithTotal = expenseData.map(d => ({ ...d, total: summary.totalExpense }));

  return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Վերլուծություն
          </h2>
          <p className="text-muted-foreground">
            Ֆինանսական տվյալների տեսողական ներկայացում և վերլուծություն
          </p>
        </div>

        {/* Comparison and Monthly Trend */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Եկամուտ vs Ծախս</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAmount(Number(value))} />
                  <Legend />
                  <Bar dataKey="Եկամուտ" fill="hsl(var(--success))" />
                  <Bar dataKey="Ծախս" fill="hsl(var(--destructive))" />
                  <Bar dataKey="Շահույթ" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ամսական միտում</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatAmount(parseFloat(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="Եկամուտ" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="Ծախս" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line type="monotone" dataKey="Շահույթ" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pie Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Եկամուտ ըստ կատեգորիաների</CardTitle>
            </CardHeader>
            <CardContent>
              {incomeDataWithTotal.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                          data={incomeDataWithTotal}
                          cx="50%"
                          cy="50%"
                          label={renderPieLabel}
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                      >
                        {incomeDataWithTotal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatAmount(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Տվյալներ չկան
                  </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ծախս ըստ կատեգորիաների</CardTitle>
            </CardHeader>
            <CardContent>
              {expenseDataWithTotal.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                          data={expenseDataWithTotal}
                          cx="50%"
                          cy="50%"
                          label={renderPieLabel}
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="amount"
                      >
                        {expenseDataWithTotal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatAmount(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
              ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Տվյալներ չկան
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vertical Bar Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Եկամտի աղբյուր</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatAmount(Number(value))} />
                  <Bar dataKey="amount" fill="hsl(var(--success))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ծախսի բաշխում</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenseData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatAmount(Number(value))} />
                  <Bar dataKey="amount" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Financial Indicators */}
        <Card>
          <CardHeader>
            <CardTitle>Ֆինանսական ցուցանիշներ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground mb-1">Միջին եկամուտ մեկ գործարքով</p>
                <p className="text-2xl font-bold text-success">
                  {formatAmount(transactions.filter(t => t.type === 'income').length > 0 ? summary.totalIncome / transactions.filter(t => t.type === 'income').length : 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-muted-foreground mb-1">Միջին ծախս մեկ գործարքով</p>
                <p className="text-2xl font-bold text-destructive">
                  {formatAmount(transactions.filter(t => t.type === 'expense').length > 0 ? summary.totalExpense / transactions.filter(t => t.type === 'expense').length : 0)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Շահույթի մարժա</p>
                <p className="text-2xl font-bold text-primary">
                  {summary.totalIncome > 0 ? ((summary.balance / summary.totalIncome) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Analytics;
