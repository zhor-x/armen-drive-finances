import assert from 'node:assert/strict';
import {
  appendTransaction,
  mergeTransactionById,
  removeTransactionById,
  replaceTransactionById,
} from '../src/utils/transactionState.js';
import {Transaction} from '../src/types/finance.js';

const baseTransaction: Transaction = {
  id: 'temp-1',
  amount: 100,
  type: 'income',
  description: 'Initial',
  date: '2024-01-01',
  category_id: 'cat-1',
};

const addedTransactions = appendTransaction([], baseTransaction);
assert.equal(addedTransactions.length, 1, 'Transaction should be appended');
assert.equal(addedTransactions[0].id, 'temp-1');

const savedTransaction = {...baseTransaction, id: 'txn-1'};
const persistedTransactions = replaceTransactionById(addedTransactions, baseTransaction.id, savedTransaction);
assert.equal(persistedTransactions[0].id, 'txn-1', 'Temporary ID should be replaced with persisted ID');

const patchedTransactions = mergeTransactionById(persistedTransactions, 'txn-1', {amount: 150, description: 'Updated'});
assert.equal(patchedTransactions[0].amount, 150, 'Amount should be updated optimistically');
assert.equal(patchedTransactions[0].description, 'Updated', 'Description should be updated optimistically');

const removedTransactions = removeTransactionById(patchedTransactions, 'txn-1');
assert.equal(removedTransactions.length, 0, 'Transaction should be removed');

console.log('Transaction sequence add → update → delete passed successfully.');
