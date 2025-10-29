import {useEffect, useState} from 'react';
import {Category, FinancialSummary, Transaction} from '@/types/finance';
import api from '@/api';
import {appendTransaction, mergeTransactionById, removeTransactionById, replaceTransactionById} from '@/utils/transactionState';

export const useFinanceData = () => {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeByCategory: {},
    expenseByCategory: {},
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, transactionsRes] = await Promise.all([
        api.get('/categories'),      // GET /categories
        api.get('/transactions')
      ]);

      const categories: Category[] = categoriesRes.data.data;
      setIncomeCategories(categories.filter(c => c.type === 'income'));
      setExpenseCategories(categories.filter(c => c.type === 'expense'));
      setTransactions(transactionsRes.data.data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
    }
  };

  useEffect(() => {
    if (transactions.length > 0) {
      calculateSummary();
    }
  }, [transactions]);

  const calculateSummary = () => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};

    transactions.forEach(t => {
      const category_id = t.category_id ?? t.category_id; // <-- вот здесь важно
      if (t.type === 'income') {
        incomeByCategory[category_id] = (incomeByCategory[category_id] || 0) + parseFloat(t.amount);
      } else {
        expenseByCategory[category_id] = (expenseByCategory[category_id] || 0) + parseFloat(t.amount);
      }
    });

    setSummary({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      incomeByCategory,
      expenseByCategory,
    });
  };


  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const tempId = 'temp-' + Date.now(); // temporary ID
    const tempTransaction: Transaction = { ...transaction, id: tempId };

    // Optimistically add to state
    setTransactions(prev => appendTransaction(prev, tempTransaction));

    try {
      const { data } = await api.post('/transactions', transaction);

      // Replace temporary transaction with real one from backend
      setTransactions(prev => replaceTransactionById(prev, tempId, data.data));
    } catch (error) {
      // Remove temporary transaction if API fails
      setTransactions(prev => removeTransactionById(prev, tempId));
      console.error('Error adding transaction:', error);
    }
  };
  const updateTransaction = async (id: string, updatedTransaction: Partial<Transaction>) => {
    try {
      const {data} = await api.put(`/transactions/${id}`, updatedTransaction);
      const isWrappedResponse = data && typeof data === 'object' && 'data' in data;
      if (!isWrappedResponse) {
        setTransactions(prev => mergeTransactionById(prev, id, data as Partial<Transaction>));
        return;
      }

      setTransactions(prev => replaceTransactionById(prev, id, (data as {data: Transaction}).data));
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    const previousTransactions = [...transactions];
    // Optimistically remove it from UI
    setTransactions(prev => removeTransactionById(prev, id));

    try {
      await api.delete(`/transactions/${id}`);
      // Already removed from state, so no further action
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setTransactions(previousTransactions);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const {data} = await api.post('/categories', category);
      if (category.type === 'income') {
        setIncomeCategories(prev => [...prev, data.data]);
      } else {
        setExpenseCategories(prev => [...prev, data.data]);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const deleteCategory = async (id: string, type: 'income' | 'expense') => {
    try {
      await api.delete(`/categories/${id}`);
      if (type === 'income') {
        setIncomeCategories(prev => prev.filter(c => c.id !== id));
      } else {
        setExpenseCategories(prev => prev.filter(c => c.id !== id));
      }
      setTransactions(prev => prev.filter(t => t.category_id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const getTransactions = async (params: any) => {
    try {
      const {data} = await api.get('/transactions', {params});
      if (params.offset === 0) {
        setTransactions(data.data); // replace
      } else {
        setTransactions(prev => [...prev, ...data.data]); // append
      }
      return data.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  return {
    incomeCategories,
    expenseCategories,
    transactions,
    summary,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
    getTransactions
  };
};
