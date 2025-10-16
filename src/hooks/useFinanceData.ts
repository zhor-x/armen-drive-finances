import { useState, useEffect } from 'react';
import { Category, Transaction, FinancialSummary } from '@/types/finance';
import { incomeCategories as defaultIncomeCategories, expenseCategories as defaultExpenseCategories, transactions as defaultTransactions } from '@/data/mockData';

export const useFinanceData = () => {
  const [incomeCategories, setIncomeCategories] = useState<Category[]>(defaultIncomeCategories);
  const [expenseCategories, setExpenseCategories] = useState<Category[]>(defaultExpenseCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    incomeByCategory: {},
    expenseByCategory: {},
  });

  useEffect(() => {
    calculateSummary();
  }, [transactions]);

  const calculateSummary = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const incomeByCategory: Record<string, number> = {};
    const expenseByCategory: Record<string, number> = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        incomeByCategory[t.categoryId] = (incomeByCategory[t.categoryId] || 0) + t.amount;
      } else {
        expenseByCategory[t.categoryId] = (expenseByCategory[t.categoryId] || 0) + t.amount;
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

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    
    if (category.type === 'income') {
      setIncomeCategories([...incomeCategories, newCategory]);
    } else {
      setExpenseCategories([...expenseCategories, newCategory]);
    }
  };

  const deleteCategory = (id: string, type: 'income' | 'expense') => {
    if (type === 'income') {
      setIncomeCategories(incomeCategories.filter(c => c.id !== id));
    } else {
      setExpenseCategories(expenseCategories.filter(c => c.id !== id));
    }
    // Also delete related transactions
    setTransactions(transactions.filter(t => t.categoryId !== id));
  };

  return {
    incomeCategories,
    expenseCategories,
    transactions,
    summary,
    addTransaction,
    deleteTransaction,
    addCategory,
    deleteCategory,
  };
};
