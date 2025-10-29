import {Transaction} from '../types/finance';

export const appendTransaction = (transactions: Transaction[], transaction: Transaction) => {
  return [...transactions, transaction];
};

export const replaceTransactionById = (
  transactions: Transaction[],
  id: string,
  replacement: Transaction,
) => {
  return transactions.map(transaction => (transaction.id === id ? replacement : transaction));
};

export const mergeTransactionById = (
  transactions: Transaction[],
  id: string,
  patch: Partial<Transaction>,
) => {
  return transactions.map(transaction => (transaction.id === id ? {...transaction, ...patch} : transaction));
};

export const removeTransactionById = (transactions: Transaction[], id: string) => {
  return transactions.filter(transaction => transaction.id !== id);
};
