import { useEffect, useState, useRef, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, Transaction } from '@/types/finance';
import { Trash2, Search, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { hy } from 'date-fns/locale';
import { TransactionDialog } from './TransactionDialog';
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

interface TransactionsTableProps {
    transactions: Transaction[];
    categories: Category[];
    onDelete: (id: string) => void;
    onUpdate?: (id: string, transaction: Partial<Transaction>) => void;
    type: 'income' | 'expense';
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
    loadMore: () => void;
    hasMore: boolean;
    isLoading: boolean;
}

export const TransactionsTable = ({
                                      transactions,
                                      categories,
                                      onDelete,
                                      onUpdate,
                                      type,
                                      searchTerm,
                                      setSearchTerm,
                                      loadMore,
                                      hasMore,
                                  }: TransactionsTableProps) => {
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container || !hasMore) return;

        if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
            loadMore();
        }
    }, [loadMore, hasMore]);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);


    const formatAmount = (num: number) => {
        return new Intl.NumberFormat('hy-AM', {
            style: 'currency',
            currency: 'AMD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    const getCategoryById = (id: string) => categories.find(c => c.id === id);

    return (
        <div className="space-y-4">
            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Փնտրել..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={sortOrder === 'newest' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortOrder('newest')}
                    >
                        Նոր
                    </Button>
                    <Button
                        variant={sortOrder === 'oldest' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortOrder('oldest')}
                    >
                        Հին
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div ref={containerRef} className="rounded-lg border overflow-y-auto h-[500px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Ամսաթիվ</TableHead>
                            <TableHead>Կատեգորիա</TableHead>
                            <TableHead className="text-right">Գումար</TableHead>
                            <TableHead className="hidden sm:table-cell">Նկարագրություն</TableHead>
                            <TableHead className="text-right w-[100px]">Գործողություններ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Տվյալներ չկան
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction) => {
                                const category = getCategoryById(transaction.category_id);
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
                                                        {(transaction.description ?? '')}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-semibold whitespace-nowrap text-xs sm:text-sm ${
                                                type === 'income' ? 'text-success' : 'text-destructive'
                                            }`}
                                        >
                                            {formatAmount(Number(transaction.amount))}
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate hidden sm:table-cell text-sm">
                                            {(transaction.description ?? '')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 justify-end">
                                                {onUpdate && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setEditingTransaction(transaction)}
                                                        className="h-7 w-7 sm:h-8 sm:w-8 text-primary hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(transaction.id)}
                                                    className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                        {hasMore && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-2 text-muted-foreground">
                                    Ավելին բեռնվում է...
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Total */}
            {transactions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                    <p>Ընդամենը {transactions.length} գործարք</p>
                    <p className="font-semibold">
                        Ընդհանուր: {formatAmount(transactions.reduce((sum, t) => sum + Number(t.amount), 0))}
                    </p>
                </div>
            )}

            {/* Editing Dialog */}
            {editingTransaction && onUpdate && (
                <TransactionDialog
                    categories={categories}
                    onAdd={(data) => {
                        onUpdate(editingTransaction.id, data);
                        setEditingTransaction(null);
                    }}
                    type={type}
                    editMode
                    initialData={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                />
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Հաստատեք ջնջումը</AlertDialogTitle>
                        <AlertDialogDescription>
                            Դուք վստա՞հ եք, որ ցանկանում եք ջնջել այս գործարքը։ Այս գործողությունը հնարավոր չէ հետարկել։
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Չեղարկել</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteId) {
                                    onDelete(deleteId);
                                    setDeleteId(null);
                                }
                            }}
                        >
                            Ջնջել
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
