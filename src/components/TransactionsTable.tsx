import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, Transaction } from '@/types/finance';
import { Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { hy } from 'date-fns/locale';

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
  type: 'income' | 'expense';
}

export const TransactionsTable = ({ transactions, categories, onDelete, type }: TransactionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions
    .filter(t => t.type === type)
    .filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatAmount = (num: number) => {
    return new Intl.NumberFormat('hy-AM', {
      style: 'currency',
      currency: 'AMD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Փնտրել..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Ամսաթիվ</TableHead>
              <TableHead className="whitespace-nowrap">Կատեգորիա</TableHead>
              <TableHead className="hidden sm:table-cell">Նկարագրություն</TableHead>
              <TableHead className="text-right whitespace-nowrap">Գումար</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Տվյալներ չկան
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => {
                const category = getCategoryById(transaction.categoryId);
                return (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm">
                      {format(new Date(transaction.date), 'dd MMM', { locale: hy })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-base sm:text-lg">{category?.icon}</span>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm block truncate">{category?.name}</span>
                          <span className="text-xs text-muted-foreground sm:hidden block truncate">
                            {transaction.description}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate hidden sm:table-cell text-sm">
                      {transaction.description}
                    </TableCell>
                    <TableCell className={`text-right font-semibold whitespace-nowrap text-xs sm:text-sm ${type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {formatAmount(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction.id)}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredTransactions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <p>Ընդամենը {filteredTransactions.length} գործարք</p>
          <p className="font-semibold">
            Ընդհանուր: {formatAmount(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
          </p>
        </div>
      )}
    </div>
  );
};
